// Helper utility to force reinitialize Firestore data
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { initializeLessons } from './firestore-service-simple';

export const reinitializeAllLessons = async () => {
  try {
    console.log("Starting data reinitialization...");
    
    // Delete all existing lessons
    const lessonCol = collection(db, 'lessons');
    const lessonSnapshot = await getDocs(lessonCol);
    
    console.log(`Found ${lessonSnapshot.docs.length} lessons to delete`);
    
    // Delete all existing lessons
    const deletePromises = lessonSnapshot.docs.map(docSnap => {
      console.log(`Deleting lesson ${docSnap.id}`);
      return deleteDoc(doc(db, 'lessons', docSnap.id));
    });
    
    await Promise.all(deletePromises);
    console.log("All lessons deleted");
    
    // Reinitialize lessons with enhanced data
    await initializeLessons();
    console.log("Lessons reinitialized successfully with enhanced content");
    
    return { success: true, message: "Data reinitialized successfully" };
  } catch (error) {
    console.error("Error reinitializing data:", error);
    return { success: false, message: "Error reinitializing data" };
  }
};
