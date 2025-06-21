import { Trophy, Medal, Star, Crown, Globe, Zap, Target, Award, Flame, BookOpen } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconComponent: any; // Lucide icon component
  points: number;
  type: 'lesson' | 'quiz' | 'streak' | 'milestone' | 'special';
  category: 'beginner' | 'intermediate' | 'advanced' | 'master';
  condition?: {
    type: 'lessonComplete' | 'quizScore' | 'timeLimit' | 'streakDays' | 'totalLessons' | 'dialectComplete' | 'allDialects';
    value?: number;
    dialectId?: number;
  };
}

// Master achievements list - add new achievements here
export const ACHIEVEMENTS: Achievement[] = [
  // Beginner Achievements
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Completed your first dialect lesson',
    icon: 'star',
    iconComponent: Star,
    points: 50,
    type: 'lesson',
    category: 'beginner',
    condition: {
      type: 'lessonComplete',
      value: 1
    }
  },
  {
    id: 'first_lesson_complete',
    title: 'First Lesson Complete!',
    description: 'Completed your first lesson',
    icon: 'trophy',
    iconComponent: Trophy,
    points: 100,
    type: 'lesson',
    category: 'beginner',
    condition: {
      type: 'totalLessons',
      value: 1
    }
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Completed a lesson in under 5 minutes',
    icon: 'zap',
    iconComponent: Zap,
    points: 75,
    type: 'quiz',
    category: 'beginner'
  },
  {
    id: 'perfect_scholar',
    title: 'Perfect Scholar',
    description: 'Scored 100% on a lesson quiz',
    icon: 'target',
    iconComponent: Target,
    points: 100,
    type: 'quiz',
    category: 'beginner'
  },

  // Intermediate Achievements
  {
    id: 'learning_streak',
    title: 'Learning Streak!',
    description: 'Completed 5 lessons',
    icon: 'flame',
    iconComponent: Flame,
    points: 250,
    type: 'milestone',
    category: 'intermediate',
    condition: {
      type: 'totalLessons',
      value: 5
    }
  },
  {
    id: 'dedicated_learner',
    title: 'Dedicated Learner!',
    description: 'Completed 10 lessons',
    icon: 'book-open',
    iconComponent: BookOpen,
    points: 500,
    type: 'milestone',
    category: 'intermediate',
    condition: {
      type: 'totalLessons',
      value: 10
    }
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Scored 90% or higher on 5 quizzes',
    icon: 'medal',
    iconComponent: Medal,
    points: 300,
    type: 'quiz',
    category: 'intermediate'
  },

  // Advanced Achievements
  {
    id: 'dialect_explorer',
    title: 'Dialect Explorer',
    description: 'Started learning 3 different dialects',
    icon: 'globe',
    iconComponent: Globe,
    points: 400,
    type: 'milestone',
    category: 'advanced'
  },
  {
    id: 'consistent_learner',
    title: 'Consistent Learner',
    description: 'Maintained a 7-day learning streak',
    icon: 'flame',
    iconComponent: Flame,
    points: 350,
    type: 'streak',
    category: 'advanced',
    condition: {
      type: 'streakDays',
      value: 7
    }
  },
  {
    id: 'dialect_master',
    title: 'Dialect Master',
    description: 'Completed all lessons in a dialect',
    icon: 'crown',
    iconComponent: Crown,
    points: 1000,
    type: 'milestone',
    category: 'advanced',
    condition: {
      type: 'dialectComplete'
    }
  },

  // Master Achievements
  {
    id: 'polyglot',
    title: 'Polyglot',
    description: 'Completed lessons in all 4 dialects',
    icon: 'globe',
    iconComponent: Globe,
    points: 2000,
    type: 'special',
    category: 'master',
    condition: {
      type: 'allDialects'
    }
  },
  {
    id: 'ultimate_scholar',
    title: 'Ultimate Scholar',
    description: 'Completed all lessons with 90%+ average',
    icon: 'crown',
    iconComponent: Crown,
    points: 3000,
    type: 'special',
    category: 'master'
  },
  {
    id: 'speed_runner',
    title: 'Speed Runner',
    description: 'Completed 10 lessons in under 3 minutes each',
    icon: 'zap',
    iconComponent: Zap,
    points: 500,
    type: 'special',
    category: 'advanced'
  },
  
  // Fun & Motivational Achievements
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Completed a lesson before 8 AM',
    icon: 'star',
    iconComponent: Star,
    points: 50,
    type: 'special',
    category: 'beginner'
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Completed a lesson after 10 PM',
    icon: 'star',
    iconComponent: Star,
    points: 50,
    type: 'special',
    category: 'beginner'
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Completed 5 lessons on weekends',
    icon: 'flame',
    iconComponent: Flame,
    points: 200,
    type: 'special',
    category: 'intermediate'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Scored 100% on 3 consecutive quizzes',
    icon: 'target',
    iconComponent: Target,
    points: 300,
    type: 'quiz',
    category: 'intermediate'
  },
  {
    id: 'comeback_kid',
    title: 'Comeback Kid',
    description: 'Improved from 60% to 100% on retaking a quiz',
    icon: 'trophy',
    iconComponent: Trophy,
    points: 150,
    type: 'quiz',
    category: 'intermediate'
  },
  {
    id: 'cultural_explorer',
    title: 'Cultural Explorer',
    description: 'Read all cultural notes in lessons',
    icon: 'book-open',
    iconComponent: BookOpen,
    points: 250,
    type: 'special',
    category: 'intermediate'
  },
  {
    id: 'vocabulary_master',
    title: 'Vocabulary Master',
    description: 'Learned 100+ new words',
    icon: 'medal',
    iconComponent: Medal,
    points: 400,
    type: 'milestone',
    category: 'advanced'
  },
  // Special Time-based Achievements
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Completed a lesson before 8 AM',
    icon: 'sun',
    iconComponent: Star, // Using Star as a placeholder, you can add Sun if needed
    points: 150,
    type: 'special',
    category: 'intermediate'
  },
  {
    id: 'night_owl',
    title: 'Night Owl', 
    description: 'Completed a lesson after 10 PM',
    icon: 'moon',
    iconComponent: Star, // Using Star as a placeholder, you can add Moon if needed
    points: 150,
    type: 'special',
    category: 'intermediate'
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Completed lessons on the weekend',
    icon: 'calendar',
    iconComponent: Trophy,
    points: 200,
    type: 'special',
    category: 'intermediate'
  },

  // ...existing code...
];

// Helper functions
export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
};

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
};

export const getAchievementsByType = (type: Achievement['type']): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.type === type);
};

// Achievement checking functions
export const checkLessonAchievements = (
  lessonNumber: number,
  dialectId: number,
  totalCompleted: number,
  timeSpent?: number,
  score?: number
): string[] => {
  const earnedAchievements: string[] = [];

  // Check first lesson
  if (lessonNumber === 1) {
    earnedAchievements.push('first_steps');
  }

  // Check speed demon (under 5 minutes = 300000ms)
  if (timeSpent && timeSpent < 300000) {
    earnedAchievements.push('speed_demon');
  }

  // Check perfect score
  if (score === 100) {
    earnedAchievements.push('perfect_scholar');
  }

  // Check milestone achievements
  ACHIEVEMENTS.forEach(achievement => {
    if (achievement.condition?.type === 'totalLessons' && 
        totalCompleted >= (achievement.condition.value || 0)) {
      earnedAchievements.push(achievement.id);
    }
  });

  return earnedAchievements;
};

export const checkDialectCompletion = (dialectId: number, completedLessons: number, totalLessons: number): string[] => {
  const earnedAchievements: string[] = [];
  
  if (completedLessons >= totalLessons) {
    earnedAchievements.push('dialect_master');
  }
  
  return earnedAchievements;
};

export const checkAllDialectsCompletion = (dialectsCompleted: number): string[] => {
  const earnedAchievements: string[] = [];
  
  if (dialectsCompleted >= 4) {
    earnedAchievements.push('polyglot');
  }
  
  return earnedAchievements;
};

export const checkTimeBasedAchievements = (): string[] => {
  const earnedAchievements: string[] = [];
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Early Bird (before 8 AM)
  if (hour < 8) {
    earnedAchievements.push('early_bird');
  }
  
  // Night Owl (after 10 PM)
  if (hour >= 22) {
    earnedAchievements.push('night_owl');
  }
  
  // Weekend Warrior (Saturday or Sunday)
  if (day === 0 || day === 6) {
    earnedAchievements.push('weekend_warrior');
  }
  
  return earnedAchievements;
};

export const checkQuizStreakAchievements = (recentScores: number[]): string[] => {
  const earnedAchievements: string[] = [];
  
  // Perfectionist - 3 consecutive 100% scores
  if (recentScores.length >= 3) {
    const lastThree = recentScores.slice(-3);
    if (lastThree.every(score => score === 100)) {
      earnedAchievements.push('perfectionist');
    }
  }
  
  return earnedAchievements;
};

// Points and level calculation
export const calculateLevel = (totalPoints: number): number => {
  return Math.floor(totalPoints / 500) + 1; // 500 points per level
};

export const getPointsForNextLevel = (totalPoints: number): number => {
  const currentLevel = calculateLevel(totalPoints);
  const pointsForNextLevel = currentLevel * 500;
  return pointsForNextLevel - totalPoints;
};

export const getProgressToNextLevel = (totalPoints: number): number => {
  const currentLevel = calculateLevel(totalPoints);
  const pointsInCurrentLevel = totalPoints - ((currentLevel - 1) * 500);
  return (pointsInCurrentLevel / 500) * 100;
};
