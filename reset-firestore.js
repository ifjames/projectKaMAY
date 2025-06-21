// Reset Firestore script - must be run with Node.js
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  writeBatch,
  serverTimestamp
} = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC2wdAtsJsoBc_4dKmMZH6UkrRGfZxWmiw",
  authDomain: "projectkamay.firebaseapp.com",
  projectId: "projectkamay",
  storageBucket: "projectkamay.appspot.com",
  messagingSenderId: "563959154121",
  appId: "1:563959154121:web:b9817273aef6cb77309426"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetFirestore() {
  console.log('Starting Firestore reset...');
  
  try {
    // Delete all existing data in main collections
    await deleteCollection('dialects');
    await deleteCollection('lessons');
    await deleteCollection('user_progress');
    await deleteCollection('user_achievements');
    
    console.log('All collections deleted successfully');
    
    // Initialize dialects with 10 total lessons
    await initializeDialects();
    
    console.log('Data reset complete. Application will initialize fresh data on next startup.');
  } catch (error) {
    console.error('Error resetting Firestore:', error);
  }
}

async function deleteCollection(collectionName) {
  console.log(`Deleting collection: ${collectionName}`);
  
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  
  const deletePromises = [];
  snapshot.forEach(doc => {
    deletePromises.push(deleteDoc(doc.ref));
  });
  
  await Promise.all(deletePromises);
  console.log(`Deleted ${snapshot.size} documents from ${collectionName}`);
}

async function initializeDialects() {
  console.log('Initializing dialects...');
  
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
  console.log('Dialects initialized successfully');
}

// Run reset
resetFirestore();
