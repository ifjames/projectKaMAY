// Shared type definitions

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation: string;
  audioUrl?: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  dialectId: string;
  title: string;
  content: string;
  lessonNumber: number;
  audioUrl: string | null;
  vocabulary: VocabularyItem[];
  quiz: QuizItem[];
}

export interface Dialect {
  id: string;
  name: string;
  description: string;
  region: string;
  speakers: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
  totalLessons: number;
  estimatedTime: string;
}

export interface UserSettings {
  pushNotifications?: boolean;
  weeklyGoalMinutes?: number;
  dailyReminders?: boolean;
  achievementAlerts?: boolean;
  weeklyProgress?: boolean;
  theme?: string;
  privateProfile?: boolean;
  dataSharing?: boolean;
  lastNameChange?: string;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  learningProgress?: {
    [dialectId: string]: {
      lessonsCompleted: number;
      totalLessons: number;
      achievementsEarned: string[];
      streak: number;
    };
  };
  settings?: UserSettings;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  dialectId: string;
  completedAt: Date;
  score: number;
}
