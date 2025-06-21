import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { app } from "./lib/firebase";

// Make sure Firebase is initialized before rendering
console.log("Firebase initialized with app:", app.name);

// Add global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  // Don't prevent the default behavior to avoid Vite Internal Server Error
});

createRoot(document.getElementById("root")!).render(<App />);
