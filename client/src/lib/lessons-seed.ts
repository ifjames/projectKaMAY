import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// Comprehensive lesson data based on the original implementation
const sampleLessons = [
  // TAGALOG LESSONS
  {
    id: 'tagalog-lesson-1',
    dialectId: 'tagalog',
    title: 'Basic Greetings',
    content: 'Learn essential greetings and polite expressions in Tagalog',
    lessonNumber: 1,
    audioUrl: '/api/audio/tagalog/lesson1.mp3',
    vocabulary: [
      { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MUS-tah' },
      { word: 'Magandang umaga', translation: 'Good morning', pronunciation: 'ma-gan-DANG oo-MA-ga' },
      { word: 'Magandang hapon', translation: 'Good afternoon', pronunciation: 'ma-gan-DANG ha-PON' },
      { word: 'Magandang gabi', translation: 'Good evening', pronunciation: 'ma-gan-DANG ga-BI' },
      { word: 'Paalam', translation: 'Goodbye', pronunciation: 'pa-A-lam' },
      { word: 'Salamat', translation: 'Thank you', pronunciation: 'sa-LA-mat' }
    ],
    quiz: [
      {
        question: 'What does "Kumusta" mean?',
        options: ['How are you?', 'What\'s your name?', 'Where are you going?', 'Good morning'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'tagalog-lesson-2',
    dialectId: 'tagalog',
    title: 'Family Terms',
    content: 'Learn how to address family members in Tagalog',
    lessonNumber: 2,
    audioUrl: '/api/audio/tagalog/lesson2.mp3',
    vocabulary: [
      { word: 'Tatay', translation: 'Father', pronunciation: 'ta-TAY' },
      { word: 'Nanay', translation: 'Mother', pronunciation: 'na-NAY' },
      { word: 'Kuya', translation: 'Older brother', pronunciation: 'KOO-ya' },
      { word: 'Ate', translation: 'Older sister', pronunciation: 'A-teh' },
      { word: 'Lolo', translation: 'Grandfather', pronunciation: 'LO-lo' },
      { word: 'Lola', translation: 'Grandmother', pronunciation: 'LO-la' }
    ],
    quiz: [
      {
        question: 'What does "Nanay" mean?',
        options: ['Sister', 'Mother', 'Grandmother', 'Aunt'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'tagalog-lesson-3',
    dialectId: 'tagalog',
    title: 'Numbers 1-10',
    content: 'Count from one to ten in Tagalog',
    lessonNumber: 3,
    audioUrl: '/api/audio/tagalog/lesson3.mp3',
    vocabulary: [
      { word: 'Isa', translation: 'One', pronunciation: 'E-sa' },
      { word: 'Dalawa', translation: 'Two', pronunciation: 'da-LA-wa' },
      { word: 'Tatlo', translation: 'Three', pronunciation: 'TAT-lo' },
      { word: 'Apat', translation: 'Four', pronunciation: 'A-pat' },
      { word: 'Lima', translation: 'Five', pronunciation: 'LI-ma' },
      { word: 'Anim', translation: 'Six', pronunciation: 'A-nim' },
      { word: 'Pito', translation: 'Seven', pronunciation: 'PI-to' },
      { word: 'Walo', translation: 'Eight', pronunciation: 'WA-lo' },
      { word: 'Siyam', translation: 'Nine', pronunciation: 'SI-yam' },
      { word: 'Sampu', translation: 'Ten', pronunciation: 'SAM-pu' }
    ],
    quiz: [
      {
        question: 'What number is "Dalawa"?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'tagalog-lesson-4',
    dialectId: 'tagalog',
    title: 'Common Phrases',
    content: 'Essential phrases for daily conversation in Tagalog',
    lessonNumber: 4,
    audioUrl: '/api/audio/tagalog/lesson4.mp3',
    vocabulary: [
      { word: 'Mahal kita', translation: 'I love you', pronunciation: 'ma-HAL ki-TA' },
      { word: 'Pasensya na', translation: 'Sorry/Excuse me', pronunciation: 'pa-SEN-sya na' },
      { word: 'Pwede ba?', translation: 'May I?/Is it okay?', pronunciation: 'pwe-DE ba' },
      { word: 'Ingat', translation: 'Take care', pronunciation: 'i-NGAT' },
      { word: 'Sige', translation: 'Okay/Alright', pronunciation: 'SI-ge' }
    ],
    quiz: [
      {
        question: 'How do you say "Thank you" in Tagalog?',
        options: ['Salamat', 'Kumusta', 'Oo', 'Hindi'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'tagalog-lesson-5',
    dialectId: 'tagalog',
    title: 'Food & Eating',
    content: 'Learn about Filipino food culture and dining in Tagalog',
    lessonNumber: 5,
    audioUrl: '/api/audio/tagalog/lesson5.mp3',
    vocabulary: [
      { word: 'Kain', translation: 'Eat/Food', pronunciation: 'KA-in' },
      { word: 'Tubig', translation: 'Water', pronunciation: 'TOO-big' },
      { word: 'Busog', translation: 'Full (satisfied)', pronunciation: 'BOO-sog' },
      { word: 'Gutom', translation: 'Hungry', pronunciation: 'GOO-tom' },
      { word: 'Masarap', translation: 'Delicious', pronunciation: 'ma-SA-rap' }
    ],
    quiz: [
      {
        question: 'What does "Kain" mean?',
        options: ['Sleep', 'Eat', 'Drink', 'Walk'],
        correctAnswer: 1
      }
    ]
  },

  // CEBUANO LESSONS
  {
    id: 'cebuano-lesson-1',
    dialectId: 'cebuano',
    title: 'Basic Greetings',
    content: 'Learn essential greetings and polite expressions in Cebuano',
    lessonNumber: 1,
    audioUrl: '/api/audio/cebuano/lesson1.mp3',
    vocabulary: [
      { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MOOS-ta' },
      { word: 'Maayong buntag', translation: 'Good morning', pronunciation: 'ma-A-yong BOON-tag' },
      { word: 'Maayong hapon', translation: 'Good afternoon', pronunciation: 'ma-A-yong HA-pon' },
      { word: 'Maayong gabii', translation: 'Good evening', pronunciation: 'ma-A-yong ga-BEE' },
      { word: 'Hangtod sa sunod', translation: 'See you later', pronunciation: 'hang-TOD sa SOO-nod' },
      { word: 'Salamat', translation: 'Thank you', pronunciation: 'sa-LA-mat' }
    ],
    quiz: [
      {
        question: 'What does "Kumusta" mean in Cebuano?',
        options: ['How are you?', 'What\'s your name?', 'Where are you going?', 'Good morning'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'cebuano-lesson-2',
    dialectId: 'cebuano',
    title: 'Family Terms',
    content: 'Learn how to address family members in Cebuano',
    lessonNumber: 2,
    audioUrl: '/api/audio/cebuano/lesson2.mp3',
    vocabulary: [
      { word: 'Tatay/Amahan', translation: 'Father', pronunciation: 'ta-TAY/a-MA-han' },
      { word: 'Nanay/Inahan', translation: 'Mother', pronunciation: 'na-NAY/i-NA-han' },
      { word: 'Kuya/Manong', translation: 'Older brother', pronunciation: 'KOO-ya/ma-NONG' },
      { word: 'Ate/Manang', translation: 'Older sister', pronunciation: 'A-teh/ma-NANG' },
      { word: 'Lolo/Apohan', translation: 'Grandfather', pronunciation: 'LO-lo/a-PO-han' },
      { word: 'Lola/Apohang babaye', translation: 'Grandmother', pronunciation: 'LO-la/a-PO-hang ba-BA-ye' }
    ],
    quiz: [
      {
        question: 'What does "Inahan" mean in Cebuano?',
        options: ['Sister', 'Mother', 'Grandmother', 'Aunt'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'cebuano-lesson-3',
    dialectId: 'cebuano',
    title: 'Numbers 1-10',
    content: 'Count from one to ten in Cebuano',
    lessonNumber: 3,
    audioUrl: '/api/audio/cebuano/lesson3.mp3',
    vocabulary: [
      { word: 'Usa', translation: 'One', pronunciation: 'OO-sa' },
      { word: 'Duha', translation: 'Two', pronunciation: 'DOO-ha' },
      { word: 'Tulo', translation: 'Three', pronunciation: 'TOO-lo' },
      { word: 'Upat', translation: 'Four', pronunciation: 'OO-pat' },
      { word: 'Lima', translation: 'Five', pronunciation: 'LI-ma' },
      { word: 'Unom', translation: 'Six', pronunciation: 'OO-nom' },
      { word: 'Pito', translation: 'Seven', pronunciation: 'PI-to' },
      { word: 'Walo', translation: 'Eight', pronunciation: 'WA-lo' },
      { word: 'Siyam', translation: 'Nine', pronunciation: 'SI-yam' },
      { word: 'Napulo', translation: 'Ten', pronunciation: 'na-POO-lo' }
    ],
    quiz: [
      {
        question: 'What number is "Duha" in Cebuano?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'cebuano-lesson-4',
    dialectId: 'cebuano',
    title: 'Common Phrases',
    content: 'Essential phrases for daily conversation in Cebuano',
    lessonNumber: 4,
    audioUrl: '/api/audio/cebuano/lesson4.mp3',
    vocabulary: [
      { word: 'Gihigugma ko ikaw', translation: 'I love you', pronunciation: 'gi-hi-GOG-ma ko i-KAW' },
      { word: 'Pasaylo', translation: 'Sorry/Excuse me', pronunciation: 'pa-SAY-lo' },
      { word: 'Mahimo ba?', translation: 'May I?/Is it okay?', pronunciation: 'ma-HI-mo ba' },
      { word: 'Amping', translation: 'Take care', pronunciation: 'AM-ping' },
      { word: 'Sige', translation: 'Okay/Alright', pronunciation: 'SI-ge' }
    ],
    quiz: [
      {
        question: 'How do you say "Thank you" in Cebuano?',
        options: ['Salamat', 'Kumusta', 'Oo', 'Dili'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'cebuano-lesson-5',
    dialectId: 'cebuano',
    title: 'Food & Eating',
    content: 'Learn about Filipino food culture and dining in Cebuano',
    lessonNumber: 5,
    audioUrl: '/api/audio/cebuano/lesson5.mp3',
    vocabulary: [
      { word: 'Kaon', translation: 'Eat/Food', pronunciation: 'KA-on' },
      { word: 'Tubig', translation: 'Water', pronunciation: 'TOO-big' },
      { word: 'Busog', translation: 'Full (satisfied)', pronunciation: 'BOO-sog' },
      { word: 'Gigutom', translation: 'Hungry', pronunciation: 'gi-GOO-tom' },
      { word: 'Lami', translation: 'Delicious', pronunciation: 'LA-mi' }
    ],
    quiz: [
      {
        question: 'What does "Kaon" mean in Cebuano?',
        options: ['Sleep', 'Eat', 'Drink', 'Walk'],
        correctAnswer: 1
      }
    ]
  },

  // ILOCANO LESSONS
  {
    id: 'ilocano-lesson-1',
    dialectId: 'ilocano',
    title: 'Basic Greetings',
    content: 'Learn essential greetings and polite expressions in Ilocano',
    lessonNumber: 1,
    audioUrl: '/api/audio/ilocano/lesson1.mp3',
    vocabulary: [
      { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MOOS-ta' },
      { word: 'Naimbag a bigat', translation: 'Good morning', pronunciation: 'na-im-BAG a bi-GAT' },
      { word: 'Naimbag a malem', translation: 'Good afternoon', pronunciation: 'na-im-BAG a ma-LEM' },
      { word: 'Naimbag a rabii', translation: 'Good evening', pronunciation: 'na-im-BAG a ra-BEE' },
      { word: 'Agpakadaakon', translation: 'Goodbye', pronunciation: 'ag-pa-ka-da-A-kon' },
      { word: 'Agyamanak', translation: 'Thank you', pronunciation: 'ag-ya-MA-nak' }
    ],
    quiz: [
      {
        question: 'What does "Kumusta" mean in Ilocano?',
        options: ['How are you?', 'What\'s your name?', 'Where are you going?', 'Good morning'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'ilocano-lesson-2',
    dialectId: 'ilocano',
    title: 'Family Terms',
    content: 'Learn how to address family members in Ilocano',
    lessonNumber: 2,
    audioUrl: '/api/audio/ilocano/lesson2.mp3',
    vocabulary: [
      { word: 'Tatang/Ama', translation: 'Father', pronunciation: 'ta-TANG/A-ma' },
      { word: 'Nanang/Ina', translation: 'Mother', pronunciation: 'na-NANG/I-na' },
      { word: 'Manong', translation: 'Older brother', pronunciation: 'ma-NONG' },
      { word: 'Manang', translation: 'Older sister', pronunciation: 'ma-NANG' },
      { word: 'Lolo/Apong lalaki', translation: 'Grandfather', pronunciation: 'LO-lo/A-pong la-LA-ki' },
      { word: 'Lola/Apong babai', translation: 'Grandmother', pronunciation: 'LO-la/A-pong ba-BA-i' }
    ],
    quiz: [
      {
        question: 'What does "Ina" mean in Ilocano?',
        options: ['Sister', 'Mother', 'Grandmother', 'Aunt'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'ilocano-lesson-3',
    dialectId: 'ilocano',
    title: 'Numbers 1-10',
    content: 'Count from one to ten in Ilocano',
    lessonNumber: 3,
    audioUrl: '/api/audio/ilocano/lesson3.mp3',
    vocabulary: [
      { word: 'Maysa', translation: 'One', pronunciation: 'MAY-sa' },
      { word: 'Dua', translation: 'Two', pronunciation: 'DOO-a' },
      { word: 'Tallo', translation: 'Three', pronunciation: 'TAL-lo' },
      { word: 'Uppat', translation: 'Four', pronunciation: 'OOP-pat' },
      { word: 'Lima', translation: 'Five', pronunciation: 'LI-ma' },
      { word: 'Innem', translation: 'Six', pronunciation: 'IN-nem' },
      { word: 'Pito', translation: 'Seven', pronunciation: 'PI-to' },
      { word: 'Walo', translation: 'Eight', pronunciation: 'WA-lo' },
      { word: 'Siam', translation: 'Nine', pronunciation: 'SI-am' },
      { word: 'Sangapulo', translation: 'Ten', pronunciation: 'sa-nga-POO-lo' }
    ],
    quiz: [
      {
        question: 'What number is "Dua" in Ilocano?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'ilocano-lesson-4',
    dialectId: 'ilocano',
    title: 'Common Phrases',
    content: 'Essential phrases for daily conversation in Ilocano',
    lessonNumber: 4,
    audioUrl: '/api/audio/ilocano/lesson4.mp3',
    vocabulary: [
      { word: 'Ay-ayaten ka', translation: 'I love you', pronunciation: 'ay-a-YA-ten ka' },
      { word: 'Pasensia', translation: 'Sorry/Excuse me', pronunciation: 'pa-SEN-sya' },
      { word: 'Mabalin?', translation: 'May I?/Is it okay?', pronunciation: 'ma-BA-lin' },
      { word: 'Agtarabay ka', translation: 'Take care', pronunciation: 'ag-ta-RA-bay ka' },
      { word: 'Wen', translation: 'Yes', pronunciation: 'WEN' },
      { word: 'Saan', translation: 'No', pronunciation: 'SA-an' }
    ],
    quiz: [
      {
        question: 'How do you say "Thank you" in Ilocano?',
        options: ['Agyamanak', 'Kumusta', 'Wen', 'Saan'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'ilocano-lesson-5',
    dialectId: 'ilocano',
    title: 'Food & Eating',
    content: 'Learn about Filipino food culture and dining in Ilocano',
    lessonNumber: 5,
    audioUrl: '/api/audio/ilocano/lesson5.mp3',
    vocabulary: [
      { word: 'Mangan', translation: 'Eat/Food', pronunciation: 'MA-ngan' },
      { word: 'Danum', translation: 'Water', pronunciation: 'DA-num' },
      { word: 'Nabsog', translation: 'Full (satisfied)', pronunciation: 'NAB-sog' },
      { word: 'Mabisinak', translation: 'Hungry', pronunciation: 'ma-bi-SI-nak' },
      { word: 'Naimas', translation: 'Delicious', pronunciation: 'na-I-mas' }
    ],
    quiz: [
      {
        question: 'What does "Mangan" mean in Ilocano?',
        options: ['Sleep', 'Eat', 'Drink', 'Walk'],
        correctAnswer: 1
      }
    ]
  },

  // HILIGAYNON LESSONS
  {
    id: 'hiligaynon-lesson-1',
    dialectId: 'hiligaynon',
    title: 'Basic Greetings',
    content: 'Learn essential greetings and polite expressions in Hiligaynon',
    lessonNumber: 1,
    audioUrl: '/api/audio/hiligaynon/lesson1.mp3',
    vocabulary: [
      { word: 'Kamusta', translation: 'Hello/How are you?', pronunciation: 'ka-MOOS-ta' },
      { word: 'Maayong aga', translation: 'Good morning', pronunciation: 'ma-A-yong A-ga' },
      { word: 'Maayong hapon', translation: 'Good afternoon', pronunciation: 'ma-A-yong HA-pon' },
      { word: 'Maayong gab-i', translation: 'Good evening', pronunciation: 'ma-A-yong GAB-i' },
      { word: 'Paalam', translation: 'Goodbye', pronunciation: 'pa-A-lam' },
      { word: 'Salamat', translation: 'Thank you', pronunciation: 'sa-LA-mat' }
    ],
    quiz: [
      {
        question: 'What does "Kamusta" mean in Hiligaynon?',
        options: ['How are you?', 'What\'s your name?', 'Where are you going?', 'Good morning'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'hiligaynon-lesson-2',
    dialectId: 'hiligaynon',
    title: 'Family Terms',
    content: 'Learn how to address family members in Hiligaynon',
    lessonNumber: 2,
    audioUrl: '/api/audio/hiligaynon/lesson2.mp3',
    vocabulary: [
      { word: 'Tatay/Amay', translation: 'Father', pronunciation: 'ta-TAY/A-may' },
      { word: 'Nanay/Iloy', translation: 'Mother', pronunciation: 'na-NAY/I-loy' },
      { word: 'Manong', translation: 'Older brother', pronunciation: 'ma-NONG' },
      { word: 'Manang', translation: 'Older sister', pronunciation: 'ma-NANG' },
      { word: 'Lolo', translation: 'Grandfather', pronunciation: 'LO-lo' },
      { word: 'Lola', translation: 'Grandmother', pronunciation: 'LO-la' }
    ],
    quiz: [
      {
        question: 'What does "Iloy" mean in Hiligaynon?',
        options: ['Sister', 'Mother', 'Grandmother', 'Aunt'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'hiligaynon-lesson-3',
    dialectId: 'hiligaynon',
    title: 'Numbers 1-10',
    content: 'Count from one to ten in Hiligaynon',
    lessonNumber: 3,
    audioUrl: '/api/audio/hiligaynon/lesson3.mp3',
    vocabulary: [
      { word: 'Isa', translation: 'One', pronunciation: 'I-sa' },
      { word: 'Duha', translation: 'Two', pronunciation: 'DOO-ha' },
      { word: 'Tatlo', translation: 'Three', pronunciation: 'TAT-lo' },
      { word: 'Apat', translation: 'Four', pronunciation: 'A-pat' },
      { word: 'Lima', translation: 'Five', pronunciation: 'LI-ma' },
      { word: 'Anom', translation: 'Six', pronunciation: 'A-nom' },
      { word: 'Pito', translation: 'Seven', pronunciation: 'PI-to' },
      { word: 'Walo', translation: 'Eight', pronunciation: 'WA-lo' },
      { word: 'Siyam', translation: 'Nine', pronunciation: 'SI-yam' },
      { word: 'Napulo', translation: 'Ten', pronunciation: 'na-POO-lo' }
    ],
    quiz: [
      {
        question: 'What number is "Duha" in Hiligaynon?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'hiligaynon-lesson-4',
    dialectId: 'hiligaynon',
    title: 'Common Phrases',
    content: 'Essential phrases for daily conversation in Hiligaynon',
    lessonNumber: 4,
    audioUrl: '/api/audio/hiligaynon/lesson4.mp3',
    vocabulary: [
      { word: 'Palangga ta ka', translation: 'I love you', pronunciation: 'pa-LANG-ga ta ka' },
      { word: 'Pasensya na', translation: 'Sorry/Excuse me', pronunciation: 'pa-SEN-sya na' },
      { word: 'Pwede?', translation: 'May I?/Is it okay?', pronunciation: 'PWE-de' },
      { word: 'Halong', translation: 'Take care', pronunciation: 'HA-long' },
      { word: 'Sige', translation: 'Okay/Alright', pronunciation: 'SI-ge' },
      { word: 'Huo', translation: 'Yes', pronunciation: 'HUO' },
      { word: 'Indi', translation: 'No', pronunciation: 'IN-di' }
    ],
    quiz: [
      {
        question: 'How do you say "Thank you" in Hiligaynon?',
        options: ['Salamat', 'Kamusta', 'Huo', 'Indi'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'hiligaynon-lesson-5',
    dialectId: 'hiligaynon',
    title: 'Food & Eating',
    content: 'Learn about Filipino food culture and dining in Hiligaynon',
    lessonNumber: 5,
    audioUrl: '/api/audio/hiligaynon/lesson5.mp3',
    vocabulary: [
      { word: 'Kaon', translation: 'Eat/Food', pronunciation: 'KA-on' },
      { word: 'Tubig', translation: 'Water', pronunciation: 'TOO-big' },
      { word: 'Busog', translation: 'Full (satisfied)', pronunciation: 'BOO-sog' },
      { word: 'Gutom', translation: 'Hungry', pronunciation: 'GOO-tom' },
      { word: 'Namit', translation: 'Delicious', pronunciation: 'NA-mit' }
    ],
    quiz: [
      {
        question: 'What does "Kaon" mean in Hiligaynon?',
        options: ['Sleep', 'Eat', 'Drink', 'Walk'],
        correctAnswer: 1
      }
    ]
  },
  
  // BIKOL LESSONS
  {
    id: 'bikol-lesson-1',
    dialectId: 'bikol',
    title: 'Basic Greetings',
    content: 'Learn essential greetings and polite expressions in Bikol',
    lessonNumber: 1,
    audioUrl: '/api/audio/bikol/lesson1.mp3',
    vocabulary: [
      { word: 'Kumusta', translation: 'Hello/How are you?', pronunciation: 'koo-MOOS-ta' },
      { word: 'Marhay na aga', translation: 'Good morning', pronunciation: 'mar-HAY na A-ga' },
      { word: 'Marhay na hapon', translation: 'Good afternoon', pronunciation: 'mar-HAY na HA-pon' },
      { word: 'Marhay na banggi', translation: 'Good evening', pronunciation: 'mar-HAY na BANG-gi' },
      { word: 'Paaram na', translation: 'Goodbye', pronunciation: 'pa-A-ram na' },
      { word: 'Salamat', translation: 'Thank you', pronunciation: 'sa-LA-mat' }
    ],
    quiz: [
      {
        question: 'What does "Kumusta" mean in Bikol?',
        options: ['How are you?', 'What\'s your name?', 'Where are you going?', 'Good morning'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'bikol-lesson-2',
    dialectId: 'bikol',
    title: 'Family Terms',
    content: 'Learn how to address family members in Bikol',
    lessonNumber: 2,
    audioUrl: '/api/audio/bikol/lesson2.mp3',
    vocabulary: [
      { word: 'Ama/Tatay', translation: 'Father', pronunciation: 'A-ma/ta-TAY' },
      { word: 'Ina/Nanay', translation: 'Mother', pronunciation: 'I-na/na-NAY' },
      { word: 'Tugang na lalaki', translation: 'Brother', pronunciation: 'tu-GANG na la-LA-ki' },
      { word: 'Tugang na babae', translation: 'Sister', pronunciation: 'tu-GANG na ba-BA-e' },
      { word: 'Lolo', translation: 'Grandfather', pronunciation: 'LO-lo' },
      { word: 'Lola', translation: 'Grandmother', pronunciation: 'LO-la' }
    ],
    quiz: [
      {
        question: 'What does "Ina" mean in Bikol?',
        options: ['Sister', 'Mother', 'Grandmother', 'Aunt'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'bikol-lesson-3',
    dialectId: 'bikol',
    title: 'Numbers 1-10',
    content: 'Count from one to ten in Bikol',
    lessonNumber: 3,
    audioUrl: '/api/audio/bikol/lesson3.mp3',
    vocabulary: [
      { word: 'Saro', translation: 'One', pronunciation: 'SA-ro' },
      { word: 'Duwa', translation: 'Two', pronunciation: 'DOO-wa' },
      { word: 'Tulo', translation: 'Three', pronunciation: 'TOO-lo' },
      { word: 'Apat', translation: 'Four', pronunciation: 'A-pat' },
      { word: 'Lima', translation: 'Five', pronunciation: 'LI-ma' },
      { word: 'Anom', translation: 'Six', pronunciation: 'A-nom' },
      { word: 'Pito', translation: 'Seven', pronunciation: 'PI-to' },
      { word: 'Walo', translation: 'Eight', pronunciation: 'WA-lo' },
      { word: 'Siyam', translation: 'Nine', pronunciation: 'SI-yam' },
      { word: 'Sampoló', translation: 'Ten', pronunciation: 'sam-po-LO' }
    ],
    quiz: [
      {
        question: 'What number is "Duwa" in Bikol?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'bikol-lesson-4',
    dialectId: 'bikol',
    title: 'Common Phrases',
    content: 'Essential phrases for daily conversation in Bikol',
    lessonNumber: 4,
    audioUrl: '/api/audio/bikol/lesson4.mp3',
    vocabulary: [
      { word: 'Namomotan taka', translation: 'I love you', pronunciation: 'na-mo-MO-tan TA-ka' },
      { word: 'Pasensya na', translation: 'Sorry/Excuse me', pronunciation: 'pa-SEN-sya na' },
      { word: 'Pwede?', translation: 'May I?/Is it okay?', pronunciation: 'PWE-de' },
      { word: 'Mag-ingat', translation: 'Take care', pronunciation: 'mag-I-ngat' },
      { word: 'Sige', translation: 'Okay/Alright', pronunciation: 'SI-ge' },
      { word: 'Iyo', translation: 'Yes', pronunciation: 'I-yo' },
      { word: 'Dai', translation: 'No', pronunciation: 'DA-i' }
    ],
    quiz: [
      {
        question: 'How do you say "Thank you" in Bikol?',
        options: ['Salamat', 'Kumusta', 'Iyo', 'Dai'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'bikol-lesson-5',
    dialectId: 'bikol',
    title: 'Food & Eating',
    content: 'Learn about Filipino food culture and dining in Bikol',
    lessonNumber: 5,
    audioUrl: '/api/audio/bikol/lesson5.mp3',
    vocabulary: [
      { word: 'Kakan', translation: 'Eat/Food', pronunciation: 'KA-kan' },
      { word: 'Tubig', translation: 'Water', pronunciation: 'TOO-big' },
      { word: 'Busog', translation: 'Full (satisfied)', pronunciation: 'BOO-sog' },
      { word: 'Gutom', translation: 'Hungry', pronunciation: 'GOO-tom' },
      { word: 'Marhay', translation: 'Delicious', pronunciation: 'mar-HAY' }
    ],
    quiz: [
      {
        question: 'What does "Kakan" mean in Bikol?',
        options: ['Sleep', 'Eat', 'Drink', 'Walk'],
        correctAnswer: 1
      }
    ]
  }
];

// Function to seed lessons
export async function seedLessons() {
  try {
    console.log('Seeding lessons...');
    
    for (const lesson of sampleLessons) {
      await setDoc(doc(db, 'lessons', lesson.id), lesson);
      console.log(`Added lesson: ${lesson.title}`);
    }
    
    console.log('Lessons seeded successfully!');
  } catch (error) {
    console.error('Error seeding lessons:', error);
  }
}

// Function to seed all sample data including lessons
export async function seedAllDataWithLessons(userId?: string) {
  // Import the existing seed functions
  const { seedDialects, seedUserProgress, seedUserAchievements } = await import('./firestore-seed');
  
  await seedDialects();
  await seedLessons();
  
  if (userId) {
    await seedUserProgress(userId);
    await seedUserAchievements(userId);
  }
}
