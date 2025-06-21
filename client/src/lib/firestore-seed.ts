import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Comprehensive dialect data based on the original implementation
const sampleDialects = [
  {
    id: 'tagalog',
    name: 'Tagalog',
    description: 'The basis of Filipino, spoken in Metro Manila and surrounding regions',
    region: 'Luzon',
    speakers: '28 million',
    difficulty: 'beginner' as const,
    color: '#1e40af', // blue
    totalLessons: 20,
    estimatedTime: '4 weeks'
  },
  {
    id: 'cebuano',
    name: 'Cebuano',
    description: 'Widely spoken in the Visayas and northern Mindanao',
    region: 'Visayas & Mindanao',
    speakers: '21 million',
    difficulty: 'intermediate' as const,
    color: '#dc2626', // red
    totalLessons: 25,
    estimatedTime: '6 weeks'
  },
  {
    id: 'ilocano',
    name: 'Ilocano',
    description: 'Predominant language of Northern Luzon',
    region: 'Northern Luzon',
    speakers: '9 million',
    difficulty: 'intermediate' as const,
    color: '#059669', // green
    totalLessons: 22,
    estimatedTime: '5 weeks'
  },
  {
    id: 'hiligaynon',
    name: 'Hiligaynon',
    description: 'Also known as Ilonggo, spoken in Western Visayas',
    region: 'Western Visayas',
    speakers: '7 million',
    difficulty: 'beginner' as const,
    color: '#7c3aed', // purple
    totalLessons: 18,
    estimatedTime: '4 weeks'
  },
  {
    id: 'bikol',
    name: 'Bikol',
    description: 'Spoken in the Bicol Region of southeastern Luzon',
    region: 'Bicol',
    speakers: '5 million',
    difficulty: 'intermediate' as const,
    color: '#eab308', // yellow
    totalLessons: 16,
    estimatedTime: '4 weeks'
  }
];

// Function to seed dialects
export async function seedDialects() {
  try {
    console.log('Seeding dialects...');
    
    for (const dialect of sampleDialects) {
      await setDoc(doc(db, 'dialects', dialect.id), dialect);
      console.log(`Added dialect: ${dialect.name}`);
    }
    
    console.log('Dialects seeded successfully!');
  } catch (error) {
    console.error('Error seeding dialects:', error);
  }
}

// Function to seed user progress (call this after user signs up)
export async function seedUserProgress(userId: string) {
  try {
    console.log('Seeding user progress...');
    
    // Sample progress for each dialect
    const progressData = [
      {
        userId,
        dialectId: 'tagalog',
        lessonsCompleted: 5,
        totalLessons: 20,
        streak: 3,
        achievementsEarned: ['first-lesson'],
        lastStudied: new Date(),
      },
      {
        userId,
        dialectId: 'cebuano',
        lessonsCompleted: 2,
        totalLessons: 25,
        streak: 1,
        achievementsEarned: [],
        lastStudied: new Date(Date.now() - 86400000), // yesterday
      }
    ];
    
    for (const progress of progressData) {
      await addDoc(collection(db, 'user_progress'), progress);
    }
    
    console.log('User progress seeded successfully!');
  } catch (error) {
    console.error('Error seeding user progress:', error);
  }
}

// Function to seed user achievements
export async function seedUserAchievements(userId: string) {
  try {
    console.log('Seeding user achievements...');
    
    const achievements = [
      {
        userId,
        id: 'first-lesson',
        title: 'First Steps',
        description: 'Completed your first lesson!',
        icon: 'star',
        earnedAt: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        userId,
        id: 'three-day-streak',
        title: 'On Fire!',
        description: 'Maintained a 3-day learning streak',
        icon: 'medal',
        earnedAt: new Date(),
      }
    ];
    
    for (const achievement of achievements) {
      await addDoc(collection(db, 'user_achievements'), achievement);
    }
    
    console.log('User achievements seeded successfully!');
  } catch (error) {
    console.error('Error seeding user achievements:', error);
  }
}

// Function to seed all data
export async function seedAllData(userId?: string) {
  await seedDialects();
  if (userId) {
    await seedUserProgress(userId);
    await seedUserAchievements(userId);
  }
}
