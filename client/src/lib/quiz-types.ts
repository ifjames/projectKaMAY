// Updated quiz schema to support multiple questions, points, and review/retake functionality
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
  // New fields for enhanced quiz system
  questionType?: 'multiple-choice' | 'matching' | 'fill-in-blank';
  difficulty?: 'easy' | 'medium' | 'hard';
  imageUrl?: string; // Optional image for visual questions
}

export interface QuizResult {
  questionId: string;
  selectedAnswer: number | null;
  isCorrect: boolean;
  pointsEarned: number;
  timeTaken?: number; // Track how long it took to answer (ms)
}

export interface UserLessonState {
  lessonId: string;
  currentStep: 'vocabulary' | 'content' | 'quiz' | 'complete';
  quizAttempts: number;
  lastScore: number;
  bestScore: number;
  lastQuizResults: QuizResult[];
  completedAt?: Date;
  // Tracking for achievement purposes
  timeSpent?: number;
  mistakesMade?: number;
}

// New interface for quiz session data
export interface QuizSession {
  startTime: number;
  endTime?: number;
  totalScore: number;
  totalPossiblePoints: number;
  results: QuizResult[];
  attemptNumber: number;
}
