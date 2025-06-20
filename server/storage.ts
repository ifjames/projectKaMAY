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

    // Create comprehensive lessons for each dialect
    dialectsData.forEach((dialect, dialectIndex) => {
      const lessonsData = [
        {
          title: "Basic Greetings",
          content: "Learn essential greetings and polite expressions",
          type: "audio",
          parts: [
            { type: "audio", word: "Kumusta", translation: "Hello/How are you?", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/kumusta.mp3` },
            { type: "audio", word: "Maayong adlaw", translation: "Good day", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/maayong-adlaw.mp3` },
            { type: "audio", word: "Maayong gabi", translation: "Good evening", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/maayong-gabi.mp3` },
            { type: "audio", word: "Paalam", translation: "Goodbye", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/paalam.mp3` },
            { type: "audio", word: "Salamat", translation: "Thank you", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/salamat.mp3` },
          ],
          vocabulary: [
            { word: "Kumusta", translation: "Hello/How are you?", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/kumusta.mp3` },
            { word: "Maayong adlaw", translation: "Good day", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/maayong-adlaw.mp3` },
          ],
          quiz: {
            question: "What does 'Kumusta' mean?",
            options: ["How are you?", "What's your name?", "Where are you going?", "Good morning"],
            correctAnswer: 0,
          }
        },
        {
          title: "Family Terms",
          content: "Learn how to address family members",
          type: "mixed",
          parts: [
            { type: "audio", word: "Tatay", translation: "Father", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/tatay.mp3` },
            { type: "audio", word: "Nanay", translation: "Mother", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/nanay.mp3` },
            { type: "text", word: "Kuya", translation: "Older brother", description: "Used to address older male siblings or cousins" },
            { type: "text", word: "Ate", translation: "Older sister", description: "Used to address older female siblings or cousins" },
            { type: "text", word: "Lolo", translation: "Grandfather", description: "Respectful term for elderly males" },
            { type: "text", word: "Lola", translation: "Grandmother", description: "Respectful term for elderly females" },
          ],
          vocabulary: [
            { word: "Tatay", translation: "Father", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/tatay.mp3` },
            { word: "Nanay", translation: "Mother", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/nanay.mp3` },
          ],
          quiz: {
            question: "What does 'Nanay' mean?",
            options: ["Sister", "Mother", "Grandmother", "Aunt"],
            correctAnswer: 1,
          }
        },
        {
          title: "Numbers 1-10",
          content: "Count from one to ten in " + dialect.name,
          type: "audio",
          parts: [
            { type: "audio", word: "Isa", translation: "One", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/isa.mp3` },
            { type: "audio", word: "Duha", translation: "Two", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/duha.mp3` },
            { type: "audio", word: "Tulo", translation: "Three", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/tulo.mp3` },
            { type: "audio", word: "Upat", translation: "Four", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/upat.mp3` },
            { type: "audio", word: "Lima", translation: "Five", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/lima.mp3` },
          ],
          vocabulary: [
            { word: "Isa", translation: "One", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/isa.mp3` },
            { word: "Duha", translation: "Two", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/duha.mp3` },
          ],
          quiz: {
            question: "What number is 'Duha'?",
            options: ["One", "Two", "Three", "Four"],
            correctAnswer: 1,
          }
        },
        {
          title: "Common Phrases",
          content: "Essential phrases for daily conversation",
          type: "text",
          parts: [
            { type: "text", word: "Mahal kita", translation: "I love you", description: "Expression of deep affection" },
            { type: "text", word: "Pasensya na", translation: "Sorry/Excuse me", description: "Polite way to apologize" },
            { type: "text", word: "Pwede ba?", translation: "May I?/Is it okay?", description: "Asking for permission" },
            { type: "text", word: "Ingat", translation: "Take care", description: "Wishing someone safety" },
            { type: "text", word: "Sige", translation: "Okay/Alright", description: "Agreement or acknowledgment" },
          ],
          vocabulary: [
            { word: "Salamat", translation: "Thank you", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/salamat.mp3` },
            { word: "Oo", translation: "Yes", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/oo.mp3` },
          ],
          quiz: {
            question: "How do you say 'Thank you'?",
            options: ["Salamat", "Kumusta", "Oo", "Hindi"],
            correctAnswer: 0,
          }
        },
        {
          title: "Food & Eating",
          content: "Learn about Filipino food culture and dining",
          type: "mixed",
          parts: [
            { type: "audio", word: "Kaon", translation: "Eat/Food", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/kaon.mp3` },
            { type: "audio", word: "Tubig", translation: "Water", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/tubig.mp3` },
            { type: "text", word: "Busog", translation: "Full (satisfied)", description: "When you've eaten enough" },
            { type: "text", word: "Gutom", translation: "Hungry", description: "Feeling of hunger" },
          ],
          vocabulary: [
            { word: "Kaon", translation: "Eat/Food", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/kaon.mp3` },
            { word: "Tubig", translation: "Water", audioUrl: `/api/audio/${dialect.name.toLowerCase()}/tubig.mp3` },
          ],
          quiz: {
            question: "What does 'Kaon' mean?",
            options: ["Sleep", "Eat", "Drink", "Walk"],
            correctAnswer: 1,
          }
        }
      ];

      lessonsData.forEach((lessonData, index) => {
        const lesson: Lesson = {
          id: this.currentLessonId++,
          dialectId: dialect.id,
          title: lessonData.title,
          content: lessonData.content,
          audioUrl: `/api/audio/${dialect.name.toLowerCase()}/lesson${index + 1}.mp3`,
          lessonNumber: index + 1,
          vocabulary: lessonData.vocabulary,
          quiz: [lessonData.quiz],
        };
        this.lessons.set(lesson.id, lesson);
      });
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
      id: this.currentUserId++,
      name: insertUser.name,
      email: insertUser.email,
      overallProgress: insertUser.overallProgress ?? 0,
      streak: insertUser.streak ?? 0,
      weeklyGoalMinutes: insertUser.weeklyGoalMinutes ?? 15,
      audioSpeed: insertUser.audioSpeed ?? "normal",
      autoPlayAudio: insertUser.autoPlayAudio ?? true,
      pushNotifications: insertUser.pushNotifications ?? true,
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
      id: this.currentDialectId++,
      name: insertDialect.name,
      description: insertDialect.description,
      region: insertDialect.region,
      color: insertDialect.color,
      totalLessons: insertDialect.totalLessons || 16,
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
      id: this.currentLessonId++,
      dialectId: insertLesson.dialectId,
      title: insertLesson.title,
      content: insertLesson.content,
      audioUrl: insertLesson.audioUrl || null,
      lessonNumber: insertLesson.lessonNumber,
      vocabulary: insertLesson.vocabulary || null,
      quiz: insertLesson.quiz || null,
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
