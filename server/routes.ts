import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema } from "@shared/schema";
import path from "path";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve audio files
  app.use('/api/audio', express.static(path.join(process.cwd(), 'server/audio')));

  // Get current user (for demo, always return user 1)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user settings
  app.patch("/api/user", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(1, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get all dialects
  app.get("/api/dialects", async (req, res) => {
    try {
      const dialects = await storage.getAllDialects();
      res.json(dialects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dialects" });
    }
  });

  // Get dialect by ID
  app.get("/api/dialects/:id", async (req, res) => {
    try {
      const dialectId = parseInt(req.params.id);
      const dialect = await storage.getDialect(dialectId);
      if (!dialect) {
        return res.status(404).json({ message: "Dialect not found" });
      }
      res.json(dialect);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dialect" });
    }
  });

  // Get lessons for a dialect
  app.get("/api/dialects/:id/lessons", async (req, res) => {
    try {
      const dialectId = parseInt(req.params.id);
      const lessons = await storage.getLessonsByDialect(dialectId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  // Get specific lesson
  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Get user progress for all dialects
  app.get("/api/user/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(1);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Get user progress for specific dialect
  app.get("/api/user/progress/:dialectId", async (req, res) => {
    try {
      const dialectId = parseInt(req.params.dialectId);
      const progress = await storage.getUserProgressForDialect(1, dialectId);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Update user progress
  app.patch("/api/user/progress/:dialectId", async (req, res) => {
    try {
      const dialectId = parseInt(req.params.dialectId);
      const updates = req.body;
      const progress = await storage.updateUserProgress(1, dialectId, updates);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Get user achievements
  app.get("/api/user/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(1);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Complete lesson (update progress and check for achievements)
  app.post("/api/lessons/:id/complete", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Update progress
      const currentProgress = await storage.getUserProgressForDialect(1, lesson.dialectId);
      const newLessonsCompleted = (currentProgress?.lessonsCompleted || 0) + 1;
      const newProgress = Math.round((newLessonsCompleted / 16) * 100);

      const updatedProgress = await storage.updateUserProgress(1, lesson.dialectId, {
        lessonsCompleted: newLessonsCompleted,
        currentLesson: newLessonsCompleted + 1,
        progress: newProgress,
      });

      // Check for achievements
      if (newLessonsCompleted === 1) {
        await storage.createAchievement({
          userId: 1,
          title: "First Lesson Complete",
          description: "Completed your first lesson",
          icon: "medal",
        });
      }

      res.json(updatedProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete lesson" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
