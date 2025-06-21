import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Initialize auth
if (!auth) {
  console.error("Firebase auth is not initialized properly");
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  learningProgress: {
    [dialectId: string]: {
      lessonsCompleted: number;
      totalLessons: number;
      achievementsEarned: string[];
      streak: number;
    };
  };
  settings?: {
    audioSpeed?: string;
    autoPlayAudio?: boolean;
    pushNotifications?: boolean;
    weeklyGoalMinutes?: number;
  };
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, displayName: string) {
    try {
      console.log('Starting Firebase signup process...');
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', user.uid);
      
      await updateProfile(user, { displayName });
      console.log('Profile updated successfully');
      
      // Create user document in Firestore
      const userDoc: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName,
        ...(user.photoURL && { photoURL: user.photoURL }),
        createdAt: new Date(),
        lastLoginAt: new Date(),
        learningProgress: {},
      };
      
      await setDoc(doc(db, 'users', user.uid), userDoc);
      console.log('User document created in Firestore');
      
      console.log('User setup complete');
    } catch (error: any) {
      console.error('Firebase signup error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login time
    await setDoc(doc(db, 'users', user.uid), {
      lastLoginAt: new Date(),
    }, { merge: true });
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if user document exists, create if not
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      const userDoc: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        ...(user.photoURL && { photoURL: user.photoURL }),
        createdAt: new Date(),
        lastLoginAt: new Date(),
        learningProgress: {},
      };
      
      await setDoc(userDocRef, userDoc);
      
      console.log('Google user setup complete');
    } else {
      // Update last login time
      await setDoc(userDocRef, {
        lastLoginAt: new Date(),
      }, { merge: true });
    }
  }

  function logout() {
    return signOut(auth);
  }

  async function updateUserProfile(displayName: string, photoURL?: string) {
    if (currentUser) {
      await updateProfile(currentUser, { displayName, photoURL });
      const updateData: any = { displayName };
      if (photoURL) {
        updateData.photoURL = photoURL;
      }
      await setDoc(doc(db, 'users', currentUser.uid), updateData, { merge: true });
    }
  }

  useEffect(() => {
    // Make sure auth is initialized before setting up the listener
    console.log("Setting up auth state listener");
    
    let unsubscribe: () => void;
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth state changed:", user ? `User: ${user.uid}` : "No user");
        setCurrentUser(user);
        
        if (user) {
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          }
        } else {
          setUserData(null);
        }
        
        setLoading(false);
      });
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}