import { 
  users, dialects, lessons, userProgress, achievements,
  type User, type InsertUser, 
  type Dialect, type InsertDialect,
  type Lesson, type InsertLesson,
  type UserProgress, type InsertUserProgress,
  type Achievement, type InsertAchievement
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Dialect methods
  getAllDialects(): Promise<Dialect[]>;
  getDialect(id: number): Promise<Dialect | undefined>;
  createDialect(dialect: InsertDialect): Promise<Dialect>;

  // Lesson methods
  getLessonsByDialect(dialectId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressForDialect(userId: number, dialectId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, dialectId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress>;

  // Achievement methods
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private dialects: Map<number, Dialect> = new Map();
  private lessons: Map<number, Lesson> = new Map();
  private userProgress: Map<string, UserProgress> = new Map(); // key: `${userId}-${dialectId}`
  private achievements: Map<number, Achievement> = new Map();
  
  private currentUserId = 1;
  private currentDialectId = 1;
  private currentLessonId = 1;
  private currentProgressId = 1;
  private currentAchievementId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      name: "Maria Santos",
      email: "maria.santos@email.com",
      overallProgress: 68,
      streak: 7,
      weeklyGoalMinutes: 30,
      audioSpeed: "normal",
      autoPlayAudio: true,
      pushNotifications: true,
      lastActiveDate: new Date(),
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Create dialects
    const dialectsData: Dialect[] = [
      {
        id: 1,
        name: "Hiligaynon",
        description: "Western Visayas region dialect",
        region: "Western Visayas",
        color: "filipino-blue",
        totalLessons: 16,
      },
      {
        id: 2,
        name: "Waray",
        description: "Eastern Visayas region dialect", 
        region: "Eastern Visayas",
        color: "filipino-red",
        totalLessons: 16,
      },
      {
        id: 3,
        name: "Bikol",
        description: "Bicol region dialect",
        region: "Bicol",
        color: "filipino-yellow",
        totalLessons: 16,
      },
      {
        id: 4,
        name: "Ilocano",
        description: "Northern Luzon dialect",
        region: "Northern Luzon", 
        color: "green-500",
        totalLessons: 16,
      },
    ];

    dialectsData.forEach(dialect => {
      this.dialects.set(dialect.id, dialect);
    });
    this.currentDialectId = 5;

    // Create sample lessons for each dialect
    dialectsData.forEach(dialect => {
      const lesson: Lesson = {
        id: this.currentLessonId++,
        dialectId: dialect.id,
        title: "Basic Greetings",
        content: "Learn essential greetings in " + dialect.name,
        audioUrl: `/api/audio/${dialect.name.toLowerCase()}/kumusta.mp3`,
        lessonNumber: 1,
        vocabulary: [
          { word: "Kumusta", translation: "Hello/How are you?", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/kumusta.mp3` },
          { word: "Maayong adlaw", translation: "Good day", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/maayong-adlaw.mp3` },
        ],
        quiz: [
          {
            question: "What does 'Kumusta' mean?",
            options: ["How are you?", "What's your name?", "Where are you going?", "Good morning"],
            correctAnswer: 0,
          },
        ],
      };
      this.lessons.set(lesson.id, lesson);
    });

    // Create user progress
    const progressData = [
      { dialectId: 1, lessonsCompleted: 12, progress: 75 },
      { dialectId: 2, lessonsCompleted: 5, progress: 30 },
      { dialectId: 3, lessonsCompleted: 3, progress: 20 },
      { dialectId: 4, lessonsCompleted: 2, progress: 15 },
    ];

    progressData.forEach(data => {
      const progress: UserProgress = {
        id: this.currentProgressId++,
        userId: 1,
        dialectId: data.dialectId,
        lessonsCompleted: data.lessonsCompleted,
        currentLesson: data.lessonsCompleted + 1,
        progress: data.progress,
        lastStudiedAt: new Date(),
      };
      this.userProgress.set(`1-${data.dialectId}`, progress);
    });

    // Create achievements
    const achievementsData: Achievement[] = [
      {
        id: 1,
        userId: 1,
        title: "First Lesson Complete",
        description: "Completed your first lesson",
        icon: "medal",
        earnedAt: new Date(Date.now() - 86400000), // yesterday
      },
      {
        id: 2,
        userId: 1,
        title: "7-Day Streak",
        description: "Studied for 7 days in a row",
        icon: "star",
        earnedAt: new Date(),
      },
    ];

    achievementsData.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
    this.currentAchievementId = 3;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      lastActiveDate: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Dialect methods
  async getAllDialects(): Promise<Dialect[]> {
    return Array.from(this.dialects.values());
  }

  async getDialect(id: number): Promise<Dialect | undefined> {
    return this.dialects.get(id);
  }

  async createDialect(insertDialect: InsertDialect): Promise<Dialect> {
    const dialect: Dialect = {
      ...insertDialect,
      id: this.currentDialectId++,
    };
    this.dialects.set(dialect.id, dialect);
    return dialect;
  }

  // Lesson methods
  async getLessonsByDialect(dialectId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(lesson => lesson.dialectId === dialectId);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const lesson: Lesson = {
      ...insertLesson,
      id: this.currentLessonId++,
    };
    this.lessons.set(lesson.id, lesson);
    return lesson;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressForDialect(userId: number, dialectId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${dialectId}`);
  }

  async updateUserProgress(userId: number, dialectId: number, updates: Partial<InsertUserProgress>): Promise<UserProgress> {
    const key = `${userId}-${dialectId}`;
    const existing = this.userProgress.get(key);
    
    const progress: UserProgress = existing ? 
      { ...existing, ...updates, lastStudiedAt: new Date() } :
      {
        id: this.currentProgressId++,
        userId,
        dialectId,
        lessonsCompleted: 0,
        currentLesson: 1,
        progress: 0,
        lastStudiedAt: new Date(),
        ...updates,
      };
    
    this.userProgress.set(key, progress);
    return progress;
  }

  // Achievement methods
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      ...insertAchievement,
      id: this.currentAchievementId++,
      earnedAt: new Date(),
    };
    this.achievements.set(achievement.id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
