import { createContext, useContext, useEffect, useState } from 'react';
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
  const [demoMode, setDemoMode] = useState(false);

  async function signup(email: string, password: string, displayName: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    const userDoc: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName,
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      learningProgress: {},
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc);
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
        photoURL: user.photoURL || undefined,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        learningProgress: {},
      };
      
      await setDoc(userDocRef, userDoc);
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
      await setDoc(doc(db, 'users', currentUser.uid), {
        displayName,
        photoURL,
      }, { merge: true });
    }
  }

  useEffect(() => {
    // Check if Firebase config is available
    const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                              import.meta.env.VITE_FIREBASE_API_KEY !== "demo-api-key";
    
    if (!hasFirebaseConfig) {
      // Demo mode - simulate authentication for development
      setDemoMode(true);
      const demoUser = {
        uid: 'demo-user',
        email: 'demo@kamay.app',
        displayName: 'Demo User',
        photoURL: null,
      } as User;
      
      const demoUserData: UserData = {
        uid: 'demo-user',
        email: 'demo@kamay.app',
        displayName: 'Demo User',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        learningProgress: {},
      };
      
      setCurrentUser(demoUser);
      setUserData(demoUserData);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

      return unsubscribe;
    } catch (error) {
      console.warn('Firebase Auth initialization failed, using demo mode:', error);
      setDemoMode(true);
      setLoading(false);
    }
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