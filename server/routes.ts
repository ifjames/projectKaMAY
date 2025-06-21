import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since we're using Firestore directly from the client,
  // we don't need server API routes anymore.
  // Just serve static files.

  const httpServer = createServer(app);
  return httpServer;
}
