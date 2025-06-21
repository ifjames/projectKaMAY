import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  writeBatch,
  increment,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { ACHIEVEMENTS, getAchievementById, checkLessonAchievements } from './achievements';

// Firestore types (using string IDs)
interface FirestoreDialect {
  id: string;
  name: string;
  description: string;
  region: string;
  color: string;
  totalLessons: number;
}

interface FirestoreLesson {
  id: string;
  dialectId: number;
  title: string;
  content: string;
  lessonNumber: number;
  type: 'audio' | 'text' | 'mixed';
  vocabulary?: Array<{word: string, translation: string, audioUrl?: string}>;
  quiz?: Array<{question: string, options: string[], correctAnswer: number}>;
}

interface FirestoreUserProgress {
  id: string;
  userId: string;
  dialectId: number;
  lessonsCompleted: number;
  progress: number;
  completedLessonIds: string[];
  lastStudiedAt?: any;
}

interface FirestoreUser {
  id: string;
  name: string;
  email: string;
  overallProgress: number;
  streak: number;
  weeklyGoalMinutes: number;
  audioSpeed: string;
  autoPlayAudio: boolean;
  pushNotifications: boolean;
  lastActiveDate?: any;
}

interface FirestoreAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points?: number;
  earnedAt?: any;
}

// User Management
export const createUserProfile = async (userData: {
  name: string;
  email: string;
}): Promise<FirestoreUser> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  console.log('Creating user profile for:', user.uid);

  const userDoc: FirestoreUser = {
    id: user.uid,
    name: userData.name,
    email: userData.email,
    overallProgress: 0,
    streak: 0,
    weeklyGoalMinutes: 30,
    audioSpeed: 'normal',
    autoPlayAudio: true,
    pushNotifications: true,
    lastActiveDate: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', user.uid), userDoc);
  console.log('User profile created successfully');
  return userDoc;
};

export const getUserProfile = async (): Promise<FirestoreUser | null> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user found');
    return null;
  }

  console.log('Getting user profile for:', user.uid);

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.log('User profile does not exist, creating default profile');
      // Create default profile if it doesn't exist
      return await createUserProfile({
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email || 'student@kamay.ph'
      });
    }

    console.log('User profile found:', userDoc.data());
    return userDoc.data() as FirestoreUser;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Dialects Management
export const initializeDialects = async () => {
  const dialectsCol = collection(db, 'dialects');
  const dialectsSnapshot = await getDocs(dialectsCol);
  
  if (dialectsSnapshot.empty) {
    const dialects = [
      {
        name: 'Hiligaynon',
        description: 'Learn the language of the Western Visayas region',
        region: 'Western Visayas',
        color: 'filipino-blue',
        totalLessons: 10,
        createdAt: serverTimestamp()
      },
      {
        name: 'Waray',
        description: 'Discover the beautiful language of Eastern Visayas',
        region: 'Eastern Visayas',
        color: 'filipino-red',
        totalLessons: 10,
        createdAt: serverTimestamp()
      },
      {
        name: 'Bikol',
        description: 'Master the language of the Bicol region',
        region: 'Bicol',
        color: 'filipino-yellow',
        totalLessons: 10,
        createdAt: serverTimestamp()
      },
      {
        name: 'Ilocano',
        description: 'Learn the language of Northern Luzon',
        region: 'Northern Luzon',
        color: 'filipino-green',
        totalLessons: 10,
        createdAt: serverTimestamp()
      }
    ];

    const batch = writeBatch(db);
    dialects.forEach((dialect, index) => {
      const dialectRef = doc(db, 'dialects', (index + 1).toString());
      batch.set(dialectRef, dialect);
    });
    await batch.commit();
  }
};

export const getDialects = async (): Promise<FirestoreDialect[]> => {
  try {
    console.log('Getting dialects...');
    await initializeDialects();
    
    const dialectsCol = collection(db, 'dialects');
    const dialectsSnapshot = await getDocs(dialectsCol);
    
    const dialects = dialectsSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as FirestoreDialect[];
    
    console.log('Dialects retrieved:', dialects);
    return dialects;
  } catch (error) {
    console.error('Error getting dialects:', error);
    throw error;
  }
};

// Lessons Management
import { dialectData } from './dialect-content';
import { lessonContent, getLesson } from '@/data/lesson-content';

// Store active listeners to avoid multiple subscriptions
const activeListeners = new Map();

// Listen for real-time updates to a specific lesson
export const listenToLesson = (
  dialectId: number,
  lessonId: string,
  callback: (lesson: FirestoreLesson) => void
): () => void => {
  const listenerId = `lesson_${dialectId}_${lessonId}`;
  
  // Remove any existing listener for this lesson
  if (activeListeners.has(listenerId)) {
    activeListeners.get(listenerId)();
  }
  
  // Create new listener
  const unsubscribe = onSnapshot(
    doc(db, 'lessons', lessonId),
    (doc) => {
      if (doc.exists()) {
        callback({ 
          ...doc.data(),
          id: doc.id
        } as FirestoreLesson);
      }
    },
    (error) => {
      console.error('Error listening to lesson updates:', error);
    }
  );
  
  // Store the unsubscribe function
  activeListeners.set(listenerId, unsubscribe);
  
  // Return function to stop listening
  return unsubscribe;
};

// Listen for real-time updates to all lessons for a dialect
export const listenToDialectLessons = (
  dialectId: number,
  callback: (lessons: FirestoreLesson[]) => void
): () => void => {
  const listenerId = `dialect_${dialectId}_lessons`;
  
  // Remove any existing listener
  if (activeListeners.has(listenerId)) {
    activeListeners.get(listenerId)();
  }
  
  const lessonsQuery = query(
    collection(db, 'lessons'),
    where('dialectId', '==', dialectId)
  );
  
  // Create new listener
  const unsubscribe = onSnapshot(
    lessonsQuery,
    (snapshot) => {
      const lessons = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as FirestoreLesson));
      
      // Sort lessons by lessonNumber
      callback(lessons.sort((a, b) => a.lessonNumber - b.lessonNumber));
    },
    (error) => {
      console.error('Error listening to dialect lessons updates:', error);
    }
  );
  
  // Store the unsubscribe function
  activeListeners.set(listenerId, unsubscribe);
  
  // Return function to stop listening
  return unsubscribe;
};

export const initializeLessons = async () => {
  const lessonsCol = collection(db, 'lessons');
  const lessonsSnapshot = await getDocs(lessonsCol);
  
  if (lessonsSnapshot.empty) {
    const batch = writeBatch(db);
    
    for (let dialectId = 1; dialectId <= 4; dialectId++) {
      // Generate 10 lessons per dialect with dialect-specific content
      for (let lessonNumber = 1; lessonNumber <= 10; lessonNumber++) {
        // Get dialect-specific lesson content from our centralized content file
        const lessonData = getLesson(dialectId, lessonNumber);
        
        if (!lessonData) continue;
        
        // Determine lesson type (1-5 audio, 6-10 text)
        const lessonType = lessonNumber <= 5 ? 'audio' : 'text';
        
        // Only store the vocabulary without pre-generated audio URLs
        // Audio URL is null since we no longer use TTS
        const vocabulary = lessonData.vocabulary;
        
        // Create lesson object
        const lesson = {
          dialectId,
          lessonNumber,
          title: lessonData.title,
          description: lessonData.description,
          content: lessonData.content,
          type: lessonType,
          vocabulary: vocabulary, // No audioUrl stored statically
          quiz: lessonData.quizQuestions,
          createdAt: serverTimestamp()
        };
        
        // Add to batch
        const lessonRef = doc(db, 'lessons', `${dialectId}-${lessonNumber}`);
        batch.set(lessonRef, lesson);
      }
    }
    
    await batch.commit();
    console.log('Lessons initialized with content from lesson-content.ts');
  }
};

export const getLessonsForDialect = async (dialectId: number): Promise<FirestoreLesson[]> => {
  try {
    await initializeLessons();
    const lessonsCol = collection(db, 'lessons');
    const lessonsQuery = query(lessonsCol, where('dialectId', '==', dialectId));
    const lessonsSnapshot = await getDocs(lessonsQuery);
    
    // Sort lessons manually by lessonNumber to avoid needing composite index
    const lessons = lessonsSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as FirestoreLesson[];
    
    return lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
  } catch (error) {
    console.error('Error loading lessons for dialect:', error);
    return [];
  }
};

// User Progress Management
export const getUserProgress = async (): Promise<FirestoreUserProgress[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user for getUserProgress');
    return [];
  }

  try {
    console.log('Getting user progress for:', user.uid);
    
    const progressCol = collection(db, 'user_progress');
    const progressQuery = query(progressCol, where('userId', '==', user.uid));
    const progressSnapshot = await getDocs(progressQuery);
    
    const progress = progressSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as FirestoreUserProgress[];
    
    console.log('User progress retrieved:', progress);
    return progress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return [];
  }
};

export const updateUserProgress = async (dialectId: number, lessonId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  console.log('Updating user progress:', { dialectId, lessonId, userId: user.uid });

  const progressDocId = `${user.uid}_${dialectId}`;
  const progressRef = doc(db, 'user_progress', progressDocId);
  const progressDoc = await getDoc(progressRef);

  if (progressDoc.exists()) {
    const currentData = progressDoc.data() as FirestoreUserProgress;
    const completedLessonIds = currentData.completedLessonIds || [];
    
    // Only update if lesson not already completed
    if (!completedLessonIds.includes(lessonId)) {
      const newCompletedIds = [...completedLessonIds, lessonId];
      const lessonsCompleted = newCompletedIds.length;
      const progress = Math.round((lessonsCompleted / 10) * 100); // 10 lessons per dialect
      
      await updateDoc(progressRef, {
        lessonsCompleted,
        completedLessonIds: newCompletedIds,
        lastStudiedAt: serverTimestamp(),
        progress
      });
      
      console.log('Progress updated:', { lessonsCompleted, progress, completedLessonIds: newCompletedIds });
    }
  } else {
    // Create new progress document
    const newProgressData: Partial<FirestoreUserProgress> = {
      userId: user.uid,
      dialectId,
      lessonsCompleted: 1,
      completedLessonIds: [lessonId],
      lastStudiedAt: serverTimestamp(),
      progress: 10 // 10% for first lesson (1/10)
    };
    
    await setDoc(progressRef, newProgressData);
    console.log('New progress document created:', newProgressData);
  }
  
  // Update overall user progress
  await updateUserOverallProgress();
};

export const updateUserOverallProgress = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const progressData = await getUserProgress();
  const totalProgress = progressData.reduce((sum, p) => sum + (p.progress || 0), 0);
  const overallProgress = Math.round(totalProgress / 4); // 4 dialects

  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    overallProgress,
    lastActiveDate: serverTimestamp()
  });
};

// Check if a lesson is completed
export const isLessonCompleted = async (lessonId: string): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  const progressData = await getUserProgress();
  return progressData.some(p => p.completedLessonIds?.includes(lessonId));
};

// Get completed lesson IDs
export const getCompletedLessonIds = async (): Promise<string[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const progressData = await getUserProgress();
  const completedIds: string[] = [];
  
  progressData.forEach(p => {
    if (p.completedLessonIds) {
      completedIds.push(...p.completedLessonIds);
    }
  });
  
  return completedIds;
};

// Achievements Management
export const getUserAchievements = async (): Promise<FirestoreAchievement[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user for getUserAchievements');
    return [];
  }

  try {
    console.log('Getting user achievements for:', user.uid);
    
    const achievementsCol = collection(db, 'user_achievements');
    const achievementsQuery = query(achievementsCol, where('userId', '==', user.uid));
    const achievementsSnapshot = await getDocs(achievementsQuery);
    
    const achievements = achievementsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreAchievement[];
    
    console.log('User achievements retrieved:', achievements);
    return achievements;
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return [];
  }
};

export const checkAndAwardAchievements = async (
  lessonAchievements?: string[], 
  lessonData?: {
    lessonNumber: number;
    dialectId: number;
    timeSpent?: number;
    score?: number;
  }
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ No authenticated user for checkAndAwardAchievements');
      return;
    }

    console.log('🏆 === ACHIEVEMENT CHECKING DEBUG ===');
    console.log('🏆 User:', user.uid);
    console.log('🏆 Lesson achievements:', lessonAchievements);
    console.log('🏆 Lesson data:', lessonData);

    const progressData = await getUserProgress();
    const totalCompleted = progressData.reduce((sum, p) => sum + p.lessonsCompleted, 0);
    
    console.log('🏆 Total lessons completed:', totalCompleted);
    console.log('🏆 Progress data:', progressData);
    
    // Check automatic achievements based on lesson data
    let autoAchievements: string[] = [];
    if (lessonData) {
      autoAchievements = checkLessonAchievements(
        lessonData.lessonNumber,
        lessonData.dialectId,
        totalCompleted,
        lessonData.timeSpent,
        lessonData.score
      );
      console.log('🏆 Auto achievements from checkLessonAchievements:', autoAchievements);
    }

    // Combine manual and automatic achievements
    const allAchievements = [...(lessonAchievements || []), ...autoAchievements];
    const uniqueAchievements = Array.from(new Set(allAchievements));

    console.log('🏆 All achievements to check:', uniqueAchievements);

    // Award achievements
    for (const achievementId of uniqueAchievements) {
      console.log('🏆 Processing achievement:', achievementId);
      const achievement = getAchievementById(achievementId);
      if (achievement) {
        console.log('🏆 Found achievement definition:', achievement.title);
        const docId = `${user.uid}_${achievementId}`;
        
        try {
          const existingDoc = await getDoc(doc(db, 'user_achievements', docId));
          
          if (!existingDoc.exists()) {
            console.log('🏆 Awarding NEW achievement:', achievement.title);
            try {
              await setDoc(doc(db, 'user_achievements', docId), {
                userId: user.uid,
                achievementId: achievementId,
                title: achievement.title,
                description: achievement.description,
                icon: achievement.icon,
                points: achievement.points,
                category: achievement.category,
                type: achievement.type,
                earnedAt: serverTimestamp()
              });
              console.log('✅ Achievement', achievement.title, 'awarded successfully to Firestore!');
            } catch (error) {
              console.error('❌ Error awarding achievement to Firestore:', error);
              // Continue processing other achievements even if one fails
            }
          } else {
            console.log('🏆 Achievement', achievement.title, 'already exists, skipping');
          }
        } catch (error) {
          console.error('❌ Error checking existing achievement:', error);
          // Continue processing other achievements
        }
      } else {
        console.log('❌ No achievement definition found for:', achievementId);
      }
    }
    console.log('🏆 === END ACHIEVEMENT CHECKING ===');
  } catch (error) {
    console.error('❌ Critical error in checkAndAwardAchievements:', error);
    // Don't throw the error, just log it so the lesson completion can continue
  }
};

// Clean up duplicate achievements
export const cleanupDuplicateAchievements = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const achievementsCol = collection(db, 'user_achievements');
    const achievementsQuery = query(achievementsCol, where('userId', '==', user.uid));
    const achievementsSnapshot = await getDocs(achievementsQuery);
    
    const achievementMap = new Map<string, any[]>();
    
    // Group achievements by achievementId
    achievementsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const achievementId = data.achievementId;
      
      if (!achievementMap.has(achievementId)) {
        achievementMap.set(achievementId, []);
      }
      achievementMap.get(achievementId)!.push({ id: doc.id, data });
    });
    
    // Delete duplicates (keep the first one, delete the rest)
    const batch = writeBatch(db);
    let deletions = 0;
    
    achievementMap.forEach((docs, achievementId) => {
      if (docs.length > 1) {
        // Keep the first one, delete the rest
        for (let i = 1; i < docs.length; i++) {
          batch.delete(doc(db, 'user_achievements', docs[i].id));
          deletions++;
        }
      }
    });
    
    if (deletions > 0) {
      await batch.commit();
      console.log(`Cleaned up ${deletions} duplicate achievements`);
    } else {
      console.log('No duplicate achievements found');
    }
  } catch (error) {
    console.error('Error cleaning up duplicate achievements:', error);
  }
};

// Reset all Firestore data
export const resetFirestoreData = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  const batch = writeBatch(db);
  
  // Delete user progress
  const progressCol = collection(db, 'userProgress');
  const progressQuery = query(progressCol, where('userId', '==', user.uid));
  const progressSnapshot = await getDocs(progressQuery);
  progressSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  // Reset user profile
  const userRef = doc(db, 'users', user.uid);
  batch.update(userRef, {
    overallProgress: 0,
    streak: 0,
    lastActiveDate: serverTimestamp()
  });
  
  await batch.commit();
};

// Reset user data (progress and achievements)
export const resetUserData = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  const batch = writeBatch(db);

  // Delete user progress
  const progressCol = collection(db, 'user_progress');
  const progressQuery = query(progressCol, where('userId', '==', user.uid));
  const progressSnapshot = await getDocs(progressQuery);
  progressSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  // Delete user achievements
  const achievementsCol = collection(db, 'user_achievements');
  const achievementsQuery = query(achievementsCol, where('userId', '==', user.uid));
  const achievementsSnapshot = await getDocs(achievementsQuery);
  achievementsSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  // Reset user profile
  const userDoc = doc(db, 'users', user.uid);
  await updateDoc(userDoc, {
    overallProgress: 0,
    streak: 0,
    lastActiveDate: serverTimestamp()
  });

  await batch.commit();
  console.log('User data has been reset');
};
