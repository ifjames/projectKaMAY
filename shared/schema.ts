import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  overallProgress: integer("overall_progress").default(0),
  streak: integer("streak").default(0),
  weeklyGoalMinutes: integer("weekly_goal_minutes").default(15),
  audioSpeed: text("audio_speed").default("normal"),
  autoPlayAudio: boolean("auto_play_audio").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  lastActiveDate: timestamp("last_active_date").defaultNow(),
});

export const dialects = pgTable("dialects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  region: text("region").notNull(),
  color: text("color").notNull(),
  totalLessons: integer("total_lessons").default(16),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  dialectId: integer("dialect_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  audioUrl: text("audio_url"),
  lessonNumber: integer("lesson_number").notNull(),
  vocabulary: jsonb("vocabulary").$type<Array<{word: string, translation: string, audioUrl?: string}>>(),
  quiz: jsonb("quiz").$type<Array<{question: string, options: string[], correctAnswer: number}>>(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dialectId: integer("dialect_id").notNull(),
  lessonsCompleted: integer("lessons_completed").default(0),
  currentLesson: integer("current_lesson").default(1),
  progress: integer("progress").default(0), // percentage
  lastStudiedAt: timestamp("last_studied_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastActiveDate: true,
});

export const insertDialectSchema = createInsertSchema(dialects).omit({
  id: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastStudiedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Dialect = typeof dialects.$inferSelect;
export type InsertDialect = z.infer<typeof insertDialectSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
