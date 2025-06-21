// Import Firebase modules
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQGEfNSUjO8uND1lX2DgexTfxr0jwS51w",
  authDomain: "projectkamay.firebaseapp.com",
  projectId: "projectkamay",
  storageBucket: "projectkamay.firebasestorage.app",
  messagingSenderId: "927171432130",
  appId: "1:927171432130:web:4b4a7b9aa79cfc75c7355b"
};

// Initialize Firebase app
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
const auth = getAuth(firebaseApp);

// Initialize Cloud Firestore
const db = getFirestore(firebaseApp);

// Suppress Firebase network errors in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Override console.warn to filter out Firebase network noise
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('ERR_BLOCKED_BY_CLIENT') || 
        message.includes('webchannel_blob_es2018') ||
        message.includes('firestore.googleapis.com')) {
      return; // Suppress these specific Firebase network warnings
    }
    originalWarn.apply(console, args);
  };
}

// Export instances
export { firebaseApp as app, auth, db };