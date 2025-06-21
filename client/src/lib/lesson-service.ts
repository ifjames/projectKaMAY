import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Dialect, Lesson } from '@/types';

// Default dialects data
const DEFAULT_DIALECTS: Omit<Dialect, 'id'>[] = [
  {
    name: 'Tagalog',
    description: 'The basis of Filipino, spoken in Metro Manila and surrounding regions',
    region: 'Luzon',
    speakers: '28 million',
    difficulty: 'beginner' as const,
    color: '#1e40af',
    totalLessons: 8,
    estimatedTime: '2-3 weeks'
  },
  {
    name: 'Cebuano',
    description: 'Widely spoken in the Visayas and northern Mindanao',
    region: 'Visayas & Mindanao',
    speakers: '25 million',
    difficulty: 'intermediate' as const,
    color: '#dc2626',
    totalLessons: 8,
    estimatedTime: '3-4 weeks'
  },
  {
    name: 'Ilocano',
    description: 'Predominant language of Northern Luzon',
    region: 'Northern Luzon',
    speakers: '10 million',
    difficulty: 'intermediate' as const,
    color: '#059669',
    totalLessons: 8,
    estimatedTime: '3-4 weeks'
  },
  {
    name: 'Hiligaynon',
    description: 'Spoken in Western Visayas, also known as Ilonggo',
    region: 'Western Visayas',
    speakers: '7 million',
    difficulty: 'intermediate' as const,
    color: '#7c3aed',
    totalLessons: 8,
    estimatedTime: '3-4 weeks'
  },
  {
    name: 'Waray',
    description: 'Native to the islands of Samar, Leyte, and Biliran',
    region: 'Eastern Visayas',
    speakers: '3.5 million',
    difficulty: 'advanced' as const,
    color: '#ea580c',
    totalLessons: 8,
    estimatedTime: '4-5 weeks'
  },
  {
    name: 'Kapampangan',
    description: 'Spoken in the province of Pampanga and surrounding areas',
    region: 'Central Luzon',
    speakers: '2.9 million',
    difficulty: 'advanced' as const,
    color: '#0891b2',
    totalLessons: 8,
    estimatedTime: '4-5 weeks'
  }
];

// Default lessons data for each dialect
const DEFAULT_LESSONS: { [dialectName: string]: Omit<Lesson, 'id' | 'dialectId'>[] } = {
  'Tagalog': [
    {
      title: 'Basic Greetings',
      content: 'Learn how to greet people in Tagalog. These are essential phrases you\'ll use every day.',
      lessonNumber: 1,
      audioUrl: null,
      vocabulary: [
        { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MOOS-tah' },
        { word: 'Salamat', translation: 'Thank you', pronunciation: 'sah-LAH-maht' },
        { word: 'Paalam', translation: 'Goodbye', pronunciation: 'pah-AH-lahm' },
        { word: 'Magandang umaga', translation: 'Good morning', pronunciation: 'mah-gahn-DAHNG oo-MAH-gah' }
      ],
      quiz: [
        {
          question: 'How do you say "Hello" in Tagalog?',
          options: ['Salamat', 'Kumusta', 'Paalam', 'Maganda'],
          correctAnswer: 1
        },
        {
          question: 'What does "Salamat" mean?',
          options: ['Goodbye', 'Hello', 'Thank you', 'Good morning'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Numbers and Counting',
      content: 'Master basic numbers in Tagalog from 1 to 10.',
      lessonNumber: 2,
      audioUrl: null,
      vocabulary: [
        { word: 'Isa', translation: 'One', pronunciation: 'EE-sah' },
        { word: 'Dalawa', translation: 'Two', pronunciation: 'dah-LAH-wah' },
        { word: 'Tatlo', translation: 'Three', pronunciation: 'TAHT-loh' },
        { word: 'Apat', translation: 'Four', pronunciation: 'AH-paht' }
      ],
      quiz: [
        {
          question: 'What number is "Tatlo"?',
          options: ['Two', 'Three', 'Four', 'Five'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Family Members',
      content: 'Learn how to talk about your family in Tagalog.',
      lessonNumber: 3,
      audioUrl: null,
      vocabulary: [
        { word: 'Pamilya', translation: 'Family', pronunciation: 'pah-MEEL-yah' },
        { word: 'Nanay', translation: 'Mother', pronunciation: 'nah-NAHY' },
        { word: 'Tatay', translation: 'Father', pronunciation: 'tah-TAHY' },
        { word: 'Kapatid', translation: 'Sibling', pronunciation: 'kah-pah-TEED' }
      ],
      quiz: [
        {
          question: 'How do you say "Mother" in Tagalog?',
          options: ['Tatay', 'Nanay', 'Kapatid', 'Pamilya'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Colors and Descriptions',
      content: 'Describe objects and people using colors in Tagalog.',
      lessonNumber: 4,
      audioUrl: null,
      vocabulary: [
        { word: 'Pula', translation: 'Red', pronunciation: 'POO-lah' },
        { word: 'Asul', translation: 'Blue', pronunciation: 'AH-sool' },
        { word: 'Dilaw', translation: 'Yellow', pronunciation: 'DEE-lahw' },
        { word: 'Berde', translation: 'Green', pronunciation: 'BEHR-deh' }
      ],
      quiz: [
        {
          question: 'What color is "Pula"?',
          options: ['Blue', 'Yellow', 'Red', 'Green'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Food and Drinks',
      content: 'Essential vocabulary for ordering food and drinks.',
      lessonNumber: 5,
      audioUrl: null,
      vocabulary: [
        { word: 'Pagkain', translation: 'Food', pronunciation: 'pahg-KAH-een' },
        { word: 'Tubig', translation: 'Water', pronunciation: 'TOO-beeg' },
        { word: 'Kanin', translation: 'Rice', pronunciation: 'kah-NEEN' },
        { word: 'Isda', translation: 'Fish', pronunciation: 'EES-dah' }
      ],
      quiz: [
        {
          question: 'How do you say "Water" in Tagalog?',
          options: ['Tubig', 'Kanin', 'Isda', 'Pagkain'],
          correctAnswer: 0
        }
      ]
    },
    {
      title: 'Time and Days',
      content: 'Learn to tell time and talk about days of the week.',
      lessonNumber: 6,
      audioUrl: null,
      vocabulary: [
        { word: 'Oras', translation: 'Time', pronunciation: 'OH-rahs' },
        { word: 'Lunes', translation: 'Monday', pronunciation: 'LOO-nehs' },
        { word: 'Martes', translation: 'Tuesday', pronunciation: 'MAHR-tehs' },
        { word: 'Miyerkoles', translation: 'Wednesday', pronunciation: 'mee-yer-KOH-lehs' }
      ],
      quiz: [
        {
          question: 'What day is "Lunes"?',
          options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Directions and Places',
      content: 'Navigate and ask for directions in Tagalog.',
      lessonNumber: 7,
      audioUrl: null,
      vocabulary: [
        { word: 'Saan', translation: 'Where', pronunciation: 'SAH-ahn' },
        { word: 'Dito', translation: 'Here', pronunciation: 'DEE-toh' },
        { word: 'Doon', translation: 'There', pronunciation: 'DOH-ohn' },
        { word: 'Bahay', translation: 'House', pronunciation: 'BAH-hahy' }
      ],
      quiz: [
        {
          question: 'How do you ask "Where?" in Tagalog?',
          options: ['Dito', 'Doon', 'Saan', 'Bahay'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Weather and Feelings',
      content: 'Express emotions and talk about the weather.',
      lessonNumber: 8,
      audioUrl: null,
      vocabulary: [
        { word: 'Masaya', translation: 'Happy', pronunciation: 'mah-sah-YAH' },
        { word: 'Malungkot', translation: 'Sad', pronunciation: 'mah-loong-KOHT' },
        { word: 'Ulan', translation: 'Rain', pronunciation: 'OO-lahn' },
        { word: 'Araw', translation: 'Sun/Day', pronunciation: 'AH-rahw' }
      ],
      quiz: [
        {
          question: 'How do you say "Happy" in Tagalog?',
          options: ['Malungkot', 'Masaya', 'Ulan', 'Araw'],
          correctAnswer: 1
        }
      ]
    }
  ],
  'Cebuano': [
    {
      title: 'Basic Greetings',
      content: 'Learn essential Cebuano greetings for daily conversations.',
      lessonNumber: 1,
      audioUrl: null,
      vocabulary: [
        { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MOOS-tah' },
        { word: 'Salamat', translation: 'Thank you', pronunciation: 'sah-LAH-maht' },
        { word: 'Maayong adlaw', translation: 'Good day', pronunciation: 'mah-AH-yohng AHD-lahw' },
        { word: 'Babay', translation: 'Goodbye', pronunciation: 'BAH-bahy' }
      ],
      quiz: [
        {
          question: 'How do you say "Good day" in Cebuano?',
          options: ['Kumusta', 'Salamat', 'Maayong adlaw', 'Babay'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Numbers 1-10',
      content: 'Master counting from 1 to 10 in Cebuano.',
      lessonNumber: 2,
      audioUrl: null,
      vocabulary: [
        { word: 'Usa', translation: 'One', pronunciation: 'OO-sah' },
        { word: 'Duha', translation: 'Two', pronunciation: 'DOO-hah' },
        { word: 'Tulo', translation: 'Three', pronunciation: 'TOO-loh' },
        { word: 'Upat', translation: 'Four', pronunciation: 'OO-paht' }
      ],
      quiz: [
        {
          question: 'What number is "Tulo" in Cebuano?',
          options: ['Two', 'Three', 'Four', 'Five'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Family Terms',
      content: 'Learn how to refer to family members in Cebuano.',
      lessonNumber: 3,
      audioUrl: null,
      vocabulary: [
        { word: 'Pamilya', translation: 'Family', pronunciation: 'pah-MEEL-yah' },
        { word: 'Mama', translation: 'Mother', pronunciation: 'mah-MAH' },
        { word: 'Papa', translation: 'Father', pronunciation: 'pah-PAH' },
        { word: 'Igsuon', translation: 'Sibling', pronunciation: 'eeg-SOO-ohn' }
      ],
      quiz: [
        {
          question: 'How do you say "Sibling" in Cebuano?',
          options: ['Mama', 'Papa', 'Igsuon', 'Pamilya'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Colors',
      content: 'Describe the world around you with Cebuano colors.',
      lessonNumber: 4,
      audioUrl: null,
      vocabulary: [
        { word: 'Pula', translation: 'Red', pronunciation: 'POO-lah' },
        { word: 'Asul', translation: 'Blue', pronunciation: 'AH-sool' },
        { word: 'Dalag', translation: 'Yellow', pronunciation: 'DAH-lahg' },
        { word: 'Lunhaw', translation: 'Green', pronunciation: 'loon-HAHW' }
      ],
      quiz: [
        {
          question: 'What color is "Lunhaw"?',
          options: ['Red', 'Blue', 'Yellow', 'Green'],
          correctAnswer: 3
        }
      ]
    },
    {
      title: 'Food Vocabulary',
      content: 'Essential words for talking about food in Cebuano.',
      lessonNumber: 5,
      audioUrl: null,
      vocabulary: [
        { word: 'Pagkaon', translation: 'Food', pronunciation: 'pahg-KAH-ohn' },
        { word: 'Tubig', translation: 'Water', pronunciation: 'TOO-beeg' },
        { word: 'Bugas', translation: 'Rice', pronunciation: 'BOO-gahs' },
        { word: 'Isda', translation: 'Fish', pronunciation: 'EES-dah' }
      ],
      quiz: [
        {
          question: 'How do you say "Rice" in Cebuano?',
          options: ['Tubig', 'Bugas', 'Isda', 'Pagkaon'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Time and Days',
      content: 'Talk about time and days of the week in Cebuano.',
      lessonNumber: 6,
      audioUrl: null,
      vocabulary: [
        { word: 'Oras', translation: 'Time', pronunciation: 'OH-rahs' },
        { word: 'Lunes', translation: 'Monday', pronunciation: 'LOO-nehs' },
        { word: 'Martes', translation: 'Tuesday', pronunciation: 'MAHR-tehs' },
        { word: 'Miyerkules', translation: 'Wednesday', pronunciation: 'mee-yer-KOO-lehs' }
      ],
      quiz: [
        {
          question: 'What does "Oras" mean?',
          options: ['Day', 'Time', 'Week', 'Month'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Directions',
      content: 'Navigate and give directions in Cebuano.',
      lessonNumber: 7,
      audioUrl: null,
      vocabulary: [
        { word: 'Asa', translation: 'Where', pronunciation: 'AH-sah' },
        { word: 'Dinhi', translation: 'Here', pronunciation: 'DEEN-hee' },
        { word: 'Didto', translation: 'There', pronunciation: 'DEED-toh' },
        { word: 'Balay', translation: 'House', pronunciation: 'BAH-lahy' }
      ],
      quiz: [
        {
          question: 'How do you ask "Where?" in Cebuano?',
          options: ['Dinhi', 'Didto', 'Asa', 'Balay'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Emotions and Weather',
      content: 'Express feelings and describe weather in Cebuano.',
      lessonNumber: 8,
      audioUrl: null,
      vocabulary: [
        { word: 'Malipayon', translation: 'Happy', pronunciation: 'mah-lee-pah-YOHN' },
        { word: 'Masulob-on', translation: 'Sad', pronunciation: 'mah-soo-lohb-OHN' },
        { word: 'Ulan', translation: 'Rain', pronunciation: 'OO-lahn' },
        { word: 'Adlaw', translation: 'Sun/Day', pronunciation: 'AHD-lahw' }
      ],
      quiz: [
        {
          question: 'How do you say "Happy" in Cebuano?',
          options: ['Masulob-on', 'Malipayon', 'Ulan', 'Adlaw'],
          correctAnswer: 1
        }
      ]
    }
  ],
  'Ilocano': [
    {
      title: 'Basic Greetings',
      content: 'Essential Ilocano greetings for everyday use.',
      lessonNumber: 1,
      audioUrl: null,
      vocabulary: [
        { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MOOS-tah' },
        { word: 'Agyaman', translation: 'Thank you', pronunciation: 'ahg-YAH-mahn' },
        { word: 'Naimbag nga aldaw', translation: 'Good day', pronunciation: 'nah-eem-BAHG ngah AHL-dahw' },
        { word: 'Agpakadan', translation: 'Goodbye', pronunciation: 'ahg-pah-kah-DAHN' }
      ],
      quiz: [
        {
          question: 'How do you say "Thank you" in Ilocano?',
          options: ['Kumusta', 'Agyaman', 'Naimbag', 'Agpakadan'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Numbers',
      content: 'Learn to count from 1 to 10 in Ilocano.',
      lessonNumber: 2,
      audioUrl: null,
      vocabulary: [
        { word: 'Maysa', translation: 'One', pronunciation: 'MAHY-sah' },
        { word: 'Dua', translation: 'Two', pronunciation: 'DOO-ah' },
        { word: 'Tallo', translation: 'Three', pronunciation: 'TAH-loh' },
        { word: 'Uppat', translation: 'Four', pronunciation: 'OOP-paht' }
      ],
      quiz: [
        {
          question: 'What number is "Tallo"?',
          options: ['Two', 'Three', 'Four', 'Five'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Family',
      content: 'Talk about your family in Ilocano.',
      lessonNumber: 3,
      audioUrl: null,
      vocabulary: [
        { word: 'Pamilia', translation: 'Family', pronunciation: 'pah-mee-LEE-ah' },
        { word: 'Ina', translation: 'Mother', pronunciation: 'EE-nah' },
        { word: 'Ama', translation: 'Father', pronunciation: 'AH-mah' },
        { word: 'Kabsat', translation: 'Sibling', pronunciation: 'kahb-SAHT' }
      ],
      quiz: [
        {
          question: 'How do you say "Father" in Ilocano?',
          options: ['Ina', 'Ama', 'Kabsat', 'Pamilia'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Colors',
      content: 'Describe colors in Ilocano.',
      lessonNumber: 4,
      audioUrl: null,
      vocabulary: [
        { word: 'Nalabaga', translation: 'Red', pronunciation: 'nah-lah-BAH-gah' },
        { word: 'Asul', translation: 'Blue', pronunciation: 'AH-sool' },
        { word: 'Duyaw', translation: 'Yellow', pronunciation: 'doo-YAHW' },
        { word: 'Berde', translation: 'Green', pronunciation: 'BEHR-deh' }
      ],
      quiz: [
        {
          question: 'What color is "Duyaw"?',
          options: ['Red', 'Blue', 'Yellow', 'Green'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Food',
      content: 'Essential food vocabulary in Ilocano.',
      lessonNumber: 5,
      audioUrl: null,
      vocabulary: [
        { word: 'Taraon', translation: 'Food', pronunciation: 'tah-rah-OHN' },
        { word: 'Danum', translation: 'Water', pronunciation: 'DAH-noom' },
        { word: 'Pagay', translation: 'Rice', pronunciation: 'PAH-gahy' },
        { word: 'Lames', translation: 'Fish', pronunciation: 'LAH-mehs' }
      ],
      quiz: [
        {
          question: 'How do you say "Water" in Ilocano?',
          options: ['Taraon', 'Danum', 'Pagay', 'Lames'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Time',
      content: 'Learn about time and days in Ilocano.',
      lessonNumber: 6,
      audioUrl: null,
      vocabulary: [
        { word: 'Oras', translation: 'Time', pronunciation: 'OH-rahs' },
        { word: 'Lunes', translation: 'Monday', pronunciation: 'LOO-nehs' },
        { word: 'Martes', translation: 'Tuesday', pronunciation: 'MAHR-tehs' },
        { word: 'Mierkules', translation: 'Wednesday', pronunciation: 'mee-ehr-KOO-lehs' }
      ],
      quiz: [
        {
          question: 'What day is "Lunes"?',
          options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Places',
      content: 'Navigate and talk about places in Ilocano.',
      lessonNumber: 7,
      audioUrl: null,
      vocabulary: [
        { word: 'Sadino', translation: 'Where', pronunciation: 'sah-DEE-noh' },
        { word: 'Ditoy', translation: 'Here', pronunciation: 'DEE-tohy' },
        { word: 'Sadiay', translation: 'There', pronunciation: 'sah-dee-AHY' },
        { word: 'Balay', translation: 'House', pronunciation: 'BAH-lahy' }
      ],
      quiz: [
        {
          question: 'How do you ask "Where?" in Ilocano?',
          options: ['Ditoy', 'Sadiay', 'Sadino', 'Balay'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Feelings and Weather',
      content: 'Express emotions and describe weather in Ilocano.',
      lessonNumber: 8,
      audioUrl: null,
      vocabulary: [
        { word: 'Naragsak', translation: 'Happy', pronunciation: 'nah-rahg-SAHK' },
        { word: 'Naladingit', translation: 'Sad', pronunciation: 'nah-lah-DEE-ngeet' },
        { word: 'Tudo', translation: 'Rain', pronunciation: 'TOO-doh' },
        { word: 'Init', translation: 'Sun/Hot', pronunciation: 'ee-NEET' }
      ],
      quiz: [
        {
          question: 'How do you say "Happy" in Ilocano?',
          options: ['Naladingit', 'Naragsak', 'Tudo', 'Init'],
          correctAnswer: 1
        }
      ]
    }
  ],
  'Hiligaynon': [
    {
      title: 'Basic Greetings',
      content: 'Learn essential Hiligaynon greetings.',
      lessonNumber: 1,
      audioUrl: null,
      vocabulary: [
        { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MOOS-tah' },
        { word: 'Salamat', translation: 'Thank you', pronunciation: 'sah-LAH-maht' },
        { word: 'Maayong adlaw', translation: 'Good day', pronunciation: 'mah-AH-yohng AHD-lahw' },
        { word: 'Paalam', translation: 'Goodbye', pronunciation: 'pah-AH-lahm' }
      ],
      quiz: [
        {
          question: 'How do you say "Good day" in Hiligaynon?',
          options: ['Kumusta', 'Salamat', 'Maayong adlaw', 'Paalam'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Numbers',
      content: 'Count from 1 to 10 in Hiligaynon.',
      lessonNumber: 2,
      audioUrl: null,
      vocabulary: [
        { word: 'Isa', translation: 'One', pronunciation: 'EE-sah' },
        { word: 'Duha', translation: 'Two', pronunciation: 'DOO-hah' },
        { word: 'Tatlo', translation: 'Three', pronunciation: 'TAHT-loh' },
        { word: 'Apat', translation: 'Four', pronunciation: 'AH-paht' }
      ],
      quiz: [
        {
          question: 'What number is "Duha"?',
          options: ['One', 'Two', 'Three', 'Four'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Family',
      content: 'Learn family terms in Hiligaynon.',
      lessonNumber: 3,
      audioUrl: null,
      vocabulary: [
        { word: 'Pamilya', translation: 'Family', pronunciation: 'pah-MEEL-yah' },
        { word: 'Iloy', translation: 'Mother', pronunciation: 'EE-lohy' },
        { word: 'Tatay', translation: 'Father', pronunciation: 'tah-TAHY' },
        { word: 'Utod', translation: 'Sibling', pronunciation: 'OO-tohd' }
      ],
      quiz: [
        {
          question: 'How do you say "Mother" in Hiligaynon?',
          options: ['Tatay', 'Iloy', 'Utod', 'Pamilya'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Colors',
      content: 'Describe colors in Hiligaynon.',
      lessonNumber: 4,
      audioUrl: null,
      vocabulary: [
        { word: 'Pula', translation: 'Red', pronunciation: 'POO-lah' },
        { word: 'Asul', translation: 'Blue', pronunciation: 'AH-sool' },
        { word: 'Dalag', translation: 'Yellow', pronunciation: 'DAH-lahg' },
        { word: 'Lunhaw', translation: 'Green', pronunciation: 'loon-HAHW' }
      ],
      quiz: [
        {
          question: 'What color is "Pula"?',
          options: ['Blue', 'Yellow', 'Red', 'Green'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Food',
      content: 'Essential food vocabulary in Hiligaynon.',
      lessonNumber: 5,
      audioUrl: null,
      vocabulary: [
        { word: 'Pagkaon', translation: 'Food', pronunciation: 'pahg-KAH-ohn' },
        { word: 'Tubig', translation: 'Water', pronunciation: 'TOO-beeg' },
        { word: 'Bugas', translation: 'Rice', pronunciation: 'BOO-gahs' },
        { word: 'Isda', translation: 'Fish', pronunciation: 'EES-dah' }
      ],
      quiz: [
        {
          question: 'How do you say "Food" in Hiligaynon?',
          options: ['Pagkaon', 'Tubig', 'Bugas', 'Isda'],
          correctAnswer: 0
        }
      ]
    },
    {
      title: 'Time',
      content: 'Learn about time in Hiligaynon.',
      lessonNumber: 6,
      audioUrl: null,
      vocabulary: [
        { word: 'Oras', translation: 'Time', pronunciation: 'OH-rahs' },
        { word: 'Lunes', translation: 'Monday', pronunciation: 'LOO-nehs' },
        { word: 'Martes', translation: 'Tuesday', pronunciation: 'MAHR-tehs' },
        { word: 'Miyerkules', translation: 'Wednesday', pronunciation: 'mee-yer-KOO-lehs' }
      ],
      quiz: [
        {
          question: 'What does "Oras" mean?',
          options: ['Day', 'Time', 'Week', 'Month'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Directions',
      content: 'Navigate using Hiligaynon directions.',
      lessonNumber: 7,
      audioUrl: null,
      vocabulary: [
        { word: 'Diin', translation: 'Where', pronunciation: 'DEE-een' },
        { word: 'Diri', translation: 'Here', pronunciation: 'DEE-ree' },
        { word: 'Didto', translation: 'There', pronunciation: 'DEED-toh' },
        { word: 'Balay', translation: 'House', pronunciation: 'BAH-lahy' }
      ],
      quiz: [
        {
          question: 'How do you ask "Where?" in Hiligaynon?',
          options: ['Diri', 'Didto', 'Diin', 'Balay'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Emotions',
      content: 'Express feelings in Hiligaynon.',
      lessonNumber: 8,
      audioUrl: null,
      vocabulary: [
        { word: 'Malipayon', translation: 'Happy', pronunciation: 'mah-lee-pah-YOHN' },
        { word: 'Masubo', translation: 'Sad', pronunciation: 'mah-SOO-boh' },
        { word: 'Ulan', translation: 'Rain', pronunciation: 'OO-lahn' },
        { word: 'Adlaw', translation: 'Sun/Day', pronunciation: 'AHD-lahw' }
      ],
      quiz: [
        {
          question: 'How do you say "Sad" in Hiligaynon?',
          options: ['Malipayon', 'Masubo', 'Ulan', 'Adlaw'],
          correctAnswer: 1
        }
      ]
    }
  ],
  'Waray': [
    {
      title: 'Basic Greetings',
      content: 'Essential Waray greetings for daily use.',
      lessonNumber: 1,
      audioUrl: null,
      vocabulary: [
        { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MOOS-tah' },
        { word: 'Salamat', translation: 'Thank you', pronunciation: 'sah-LAH-maht' },
        { word: 'Maupay nga adlaw', translation: 'Good day', pronunciation: 'mah-OO-pahy ngah AHD-lahw' },
        { word: 'Babay', translation: 'Goodbye', pronunciation: 'BAH-bahy' }
      ],
      quiz: [
        {
          question: 'How do you say "Good day" in Waray?',
          options: ['Kumusta', 'Salamat', 'Maupay nga adlaw', 'Babay'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Numbers',
      content: 'Learn numbers 1-10 in Waray.',
      lessonNumber: 2,
      audioUrl: null,
      vocabulary: [
        { word: 'Usa', translation: 'One', pronunciation: 'OO-sah' },
        { word: 'Duha', translation: 'Two', pronunciation: 'DOO-hah' },
        { word: 'Tulo', translation: 'Three', pronunciation: 'TOO-loh' },
        { word: 'Upat', translation: 'Four', pronunciation: 'OO-paht' }
      ],
      quiz: [
        {
          question: 'What number is "Upat"?',
          options: ['Two', 'Three', 'Four', 'Five'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Family',
      content: 'Family terms in Waray.',
      lessonNumber: 3,
      audioUrl: null,
      vocabulary: [
        { word: 'Pamilya', translation: 'Family', pronunciation: 'pah-MEEL-yah' },
        { word: 'Nanay', translation: 'Mother', pronunciation: 'nah-NAHY' },
        { word: 'Tatay', translation: 'Father', pronunciation: 'tah-TAHY' },
        { word: 'Bugto', translation: 'Sibling', pronunciation: 'BOOG-toh' }
      ],
      quiz: [
        {
          question: 'How do you say "Sibling" in Waray?',
          options: ['Nanay', 'Tatay', 'Bugto', 'Pamilya'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Colors',
      content: 'Describe colors in Waray.',
      lessonNumber: 4,
      audioUrl: null,
      vocabulary: [
        { word: 'Pula', translation: 'Red', pronunciation: 'POO-lah' },
        { word: 'Asul', translation: 'Blue', pronunciation: 'AH-sool' },
        { word: 'Dalag', translation: 'Yellow', pronunciation: 'DAH-lahg' },
        { word: 'Lunhaw', translation: 'Green', pronunciation: 'loon-HAHW' }
      ],
      quiz: [
        {
          question: 'What color is "Asul"?',
          options: ['Red', 'Blue', 'Yellow', 'Green'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Food',
      content: 'Essential food vocabulary in Waray.',
      lessonNumber: 5,
      audioUrl: null,
      vocabulary: [
        { word: 'Pagkaon', translation: 'Food', pronunciation: 'pahg-KAH-ohn' },
        { word: 'Tubig', translation: 'Water', pronunciation: 'TOO-beeg' },
        { word: 'Bugas', translation: 'Rice', pronunciation: 'BOO-gahs' },
        { word: 'Isda', translation: 'Fish', pronunciation: 'EES-dah' }
      ],
      quiz: [
        {
          question: 'How do you say "Water" in Waray?',
          options: ['Pagkaon', 'Tubig', 'Bugas', 'Isda'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Time',
      content: 'Time and days in Waray.',
      lessonNumber: 6,
      audioUrl: null,
      vocabulary: [
        { word: 'Oras', translation: 'Time', pronunciation: 'OH-rahs' },
        { word: 'Lunes', translation: 'Monday', pronunciation: 'LOO-nehs' },
        { word: 'Martes', translation: 'Tuesday', pronunciation: 'MAHR-tehs' },
        { word: 'Miyerkules', translation: 'Wednesday', pronunciation: 'mee-yer-KOO-lehs' }
      ],
      quiz: [
        {
          question: 'What day is "Martes"?',
          options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Places',
      content: 'Navigate and talk about places in Waray.',
      lessonNumber: 7,
      audioUrl: null,
      vocabulary: [
        { word: 'Hain', translation: 'Where', pronunciation: 'HAH-een' },
        { word: 'Dinhi', translation: 'Here', pronunciation: 'DEEN-hee' },
        { word: 'Didto', translation: 'There', pronunciation: 'DEED-toh' },
        { word: 'Balay', translation: 'House', pronunciation: 'BAH-lahy' }
      ],
      quiz: [
        {
          question: 'How do you ask "Where?" in Waray?',
          options: ['Dinhi', 'Didto', 'Hain', 'Balay'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Emotions',
      content: 'Express feelings in Waray.',
      lessonNumber: 8,
      audioUrl: null,
      vocabulary: [
        { word: 'Malipayon', translation: 'Happy', pronunciation: 'mah-lee-pah-YOHN' },
        { word: 'Masulob-on', translation: 'Sad', pronunciation: 'mah-soo-lohb-OHN' },
        { word: 'Uran', translation: 'Rain', pronunciation: 'OO-rahn' },
        { word: 'Adlaw', translation: 'Sun/Day', pronunciation: 'AHD-lahw' }
      ],
      quiz: [
        {
          question: 'How do you say "Rain" in Waray?',
          options: ['Malipayon', 'Masulob-on', 'Uran', 'Adlaw'],
          correctAnswer: 2
        }
      ]
    }
  ],
  'Kapampangan': [
    {
      title: 'Basic Greetings',
      content: 'Learn essential Kapampangan greetings.',
      lessonNumber: 1,
      audioUrl: null,
      vocabulary: [
        { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MOOS-tah' },
        { word: 'Salamat', translation: 'Thank you', pronunciation: 'sah-LAH-maht' },
        { word: 'Mayap a abak', translation: 'Good day', pronunciation: 'mah-YAHP ah AH-bahk' },
        { word: 'Paalam', translation: 'Goodbye', pronunciation: 'pah-AH-lahm' }
      ],
      quiz: [
        {
          question: 'How do you say "Good day" in Kapampangan?',
          options: ['Kumusta', 'Salamat', 'Mayap a abak', 'Paalam'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Numbers',
      content: 'Count from 1 to 10 in Kapampangan.',
      lessonNumber: 2,
      audioUrl: null,
      vocabulary: [
        { word: 'Metung', translation: 'One', pronunciation: 'meh-TOONG' },
        { word: 'Adwa', translation: 'Two', pronunciation: 'AHD-wah' },
        { word: 'Atlu', translation: 'Three', pronunciation: 'AHT-loo' },
        { word: 'Apat', translation: 'Four', pronunciation: 'AH-paht' }
      ],
      quiz: [
        {
          question: 'What number is "Atlu"?',
          options: ['Two', 'Three', 'Four', 'Five'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Family',
      content: 'Family terms in Kapampangan.',
      lessonNumber: 3,
      audioUrl: null,
      vocabulary: [
        { word: 'Pamamilya', translation: 'Family', pronunciation: 'pah-mah-MEEL-yah' },
        { word: 'Ima', translation: 'Mother', pronunciation: 'EE-mah' },
        { word: 'Tata', translation: 'Father', pronunciation: 'tah-TAH' },
        { word: 'Kapatad', translation: 'Sibling', pronunciation: 'kah-pah-TAHD' }
      ],
      quiz: [
        {
          question: 'How do you say "Father" in Kapampangan?',
          options: ['Ima', 'Tata', 'Kapatad', 'Pamamilya'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Colors',
      content: 'Describe colors in Kapampangan.',
      lessonNumber: 4,
      audioUrl: null,
      vocabulary: [
        { word: 'Mapula', translation: 'Red', pronunciation: 'mah-POO-lah' },
        { word: 'Masul', translation: 'Blue', pronunciation: 'mah-SOOL' },
        { word: 'Madilaw', translation: 'Yellow', pronunciation: 'mah-DEE-lahw' },
        { word: 'Maluntian', translation: 'Green', pronunciation: 'mah-loon-tee-AHN' }
      ],
      quiz: [
        {
          question: 'What color is "Madilaw"?',
          options: ['Red', 'Blue', 'Yellow', 'Green'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Food',
      content: 'Essential food vocabulary in Kapampangan.',
      lessonNumber: 5,
      audioUrl: null,
      vocabulary: [
        { word: 'Pamangan', translation: 'Food', pronunciation: 'pah-mah-NGAHN' },
        { word: 'Danum', translation: 'Water', pronunciation: 'DAH-noom' },
        { word: 'Abias', translation: 'Rice', pronunciation: 'ah-BEE-ahs' },
        { word: 'Asan', translation: 'Fish', pronunciation: 'AH-sahn' }
      ],
      quiz: [
        {
          question: 'How do you say "Rice" in Kapampangan?',
          options: ['Pamangan', 'Danum', 'Abias', 'Asan'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Time',
      content: 'Time and days in Kapampangan.',
      lessonNumber: 6,
      audioUrl: null,
      vocabulary: [
        { word: 'Oras', translation: 'Time', pronunciation: 'OH-rahs' },
        { word: 'Lunes', translation: 'Monday', pronunciation: 'LOO-nehs' },
        { word: 'Martes', translation: 'Tuesday', pronunciation: 'MAHR-tehs' },
        { word: 'Mierkules', translation: 'Wednesday', pronunciation: 'mee-ehr-KOO-lehs' }
      ],
      quiz: [
        {
          question: 'What does "Oras" mean?',
          options: ['Day', 'Time', 'Week', 'Month'],
          correctAnswer: 1
        }
      ]
    },
    {
      title: 'Directions',
      content: 'Navigate using Kapampangan directions.',
      lessonNumber: 7,
      audioUrl: null,
      vocabulary: [
        { word: 'Nokarin', translation: 'Where', pronunciation: 'noh-kah-REEN' },
        { word: 'Keni', translation: 'Here', pronunciation: 'keh-NEE' },
        { word: 'Keta', translation: 'There', pronunciation: 'keh-TAH' },
        { word: 'Bale', translation: 'House', pronunciation: 'BAH-leh' }
      ],
      quiz: [
        {
          question: 'How do you ask "Where?" in Kapampangan?',
          options: ['Keni', 'Keta', 'Nokarin', 'Bale'],
          correctAnswer: 2
        }
      ]
    },
    {
      title: 'Emotions',
      content: 'Express feelings in Kapampangan.',
      lessonNumber: 8,
      audioUrl: null,
      vocabulary: [
        { word: 'Masaya', translation: 'Happy', pronunciation: 'mah-sah-YAH' },
        { word: 'Malungkut', translation: 'Sad', pronunciation: 'mah-loong-KOOT' },
        { word: 'Uran', translation: 'Rain', pronunciation: 'OO-rahn' },
        { word: 'Aldo', translation: 'Sun/Day', pronunciation: 'AHL-doh' }
      ],
      quiz: [
        {
          question: 'How do you say "Happy" in Kapampangan?',
          options: ['Malungkut', 'Masaya', 'Uran', 'Aldo'],
          correctAnswer: 1
        }
      ]
    }
  ]
};

/**
 * Ensure dialects exist in Firestore, create them if they don't
 */
export async function ensureDialectsExist(): Promise<Dialect[]> {
  try {
    // Check if dialects already exist
    const dialectsCollection = collection(db, 'dialects');
    const dialectsSnapshot = await getDocs(dialectsCollection);
    
    if (dialectsSnapshot.empty) {
      console.log('No dialects found, creating default dialects...');
      
      try {
        // Try to create default dialects
        const createdDialects: Dialect[] = [];
        
        for (const dialectData of DEFAULT_DIALECTS) {
          const dialectRef = doc(dialectsCollection);
          const dialectWithId = { ...dialectData, id: dialectRef.id };
          
          await setDoc(dialectRef, dialectWithId);
          createdDialects.push(dialectWithId);
          
          console.log(`Created dialect: ${dialectData.name}`);
        }
        
        return createdDialects;
      } catch (writeError) {
        console.error('Failed to write dialects to Firestore:', writeError);
        throw writeError;
      }
    } else {
      // Return existing dialects
      return dialectsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Dialect));
    }
  } catch (error) {
    console.error('Error ensuring dialects exist:', error);
    throw error;
  }
}

/**
 * Ensure lessons exist for all dialects in Firestore, create them if they don't
 */
export async function ensureLessonsExist(dialects: Dialect[]): Promise<Lesson[]> {
  try {
    // Check if lessons already exist
    const lessonsCollection = collection(db, 'lessons');
    const lessonsSnapshot = await getDocs(lessonsCollection);
    
    if (lessonsSnapshot.empty) {
      console.log('No lessons found, creating default lessons...');
      
      // Create default lessons for each dialect
      const createdLessons: Lesson[] = [];
      
      for (const dialect of dialects) {
        const dialectLessons = DEFAULT_LESSONS[dialect.name];
        
        if (dialectLessons) {
          for (const lessonData of dialectLessons) {
            const lessonRef = doc(lessonsCollection);
            const lessonWithId = { 
              ...lessonData, 
              id: lessonRef.id,
              dialectId: dialect.id 
            };
            
            await setDoc(lessonRef, lessonWithId);
            createdLessons.push(lessonWithId);
            
            console.log(`Created lesson: ${lessonData.title} for ${dialect.name}`);
          }
        }
      }
      
      return createdLessons;
    } else {
      // Return existing lessons
      return lessonsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Lesson));
    }
  } catch (error) {
    console.error('Error ensuring lessons exist:', error);
    throw error;
  }
}

/**
 * Initialize the lesson system - ensure both dialects and lessons exist
 */
export async function initializeLessonSystem(): Promise<{ dialects: Dialect[], lessons: Lesson[] }> {
  try {
    console.log('Initializing lesson system...');
    
    // First ensure dialects exist
    const dialects = await ensureDialectsExist();
    
    // Then ensure lessons exist for all dialects
    const lessons = await ensureLessonsExist(dialects);
    
    console.log(`Lesson system initialized with ${dialects.length} dialects and ${lessons.length} lessons`);
    
    return { dialects, lessons };
  } catch (error) {
    console.error('Error initializing lesson system:', error);
    throw error;
  }
}
