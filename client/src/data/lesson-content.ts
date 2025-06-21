// Comprehensive lesson content for Filipino dialect learning app
// This file centralizes all dialect lesson content for easy management and updates
// Updated with authentic content based on reliable linguistic sources

import { dialectData } from '@/lib/dialect-content';
import { authenticLessonContent, culturalNotes } from './authentic-lesson-content';

// Types for lesson content
export interface LessonWord {
  word: string;
  translation: string;
  pronunciation?: string;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

export interface LessonContent {
  title: string;
  description: string;
  content: string;
  vocabulary: LessonWord[];
  quizQuestions: LessonQuizQuestion[];
}

// Main content repository - now using authentic linguistic content
// Based on: Omniglot, Kiddle, Wikivoyage, and Traveloka sources
export const lessonContent: Record<number, Record<number, LessonContent>> = authenticLessonContent;

// Export cultural information for enhanced learning
export { culturalNotes };

// Helper function to get cultural information for a dialect
export const getCulturalInfo = (dialectId: number) => {
  return culturalNotes[dialectId as keyof typeof culturalNotes];
};

// Helper function to get all available lessons for a dialect
export const getDialectLessons = (dialectId: number): LessonContent[] => {
  const dialectLessons = lessonContent[dialectId];
  if (!dialectLessons) return [];
  
  return Object.values(dialectLessons);
};

// Helper function to get a specific lesson
export const getLesson = (dialectId: number, lessonNumber: number): LessonContent | null => {
  return lessonContent[dialectId]?.[lessonNumber] || null;
};

// Get total number of lessons for a dialect
export const getTotalLessonsForDialect = (dialectId: number): number => {
  return Object.keys(lessonContent[dialectId] || {}).length;
};

// Validate that lesson content exists
export const hasLesson = (dialectId: number, lessonNumber: number): boolean => {
  return !!(lessonContent[dialectId]?.[lessonNumber]);
};
