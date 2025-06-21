// Enhanced lesson content for Filipino dialects
// Based on authentic dialect resources and structured for progressive learning

export interface LessonWord {
  word: string;
  translation: string;
  pronunciation?: string;
  category?: string;
}

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'translation' | 'listening';
}

export interface LessonContent {
  title: string;
  description: string;
  content: string;
  vocabulary: LessonWord[];
  quizQuestions: LessonQuizQuestion[];
  culturalNote?: string;
  lessonObjectives: string[];
}

// Enhanced lesson content for all dialects
export const enhancedLessonContent: Record<number, Record<number, LessonContent>> = {
  // HILIGAYNON (Dialect 1)
  1: {
    1: {
      title: "Basic Greetings and Introductions",
      description: "Learn essential Hiligaynon greetings and how to introduce yourself",
      content: "Hiligaynon, also known as Ilonggo, is spoken by over 9 million people in Western Visayas. Known for its melodious and gentle tone, it's one of the most beautiful dialects in the Philippines. Greetings are very important in Hiligaynon culture, showing respect and warmth.",
      lessonObjectives: [
        "Learn basic greetings for different times of day",
        "Master simple introductions",
        "Understand cultural context of greetings"
      ],
      vocabulary: [
        { word: "Kamusta", translation: "Hello", pronunciation: "ka-mus-ta", category: "greeting" },
        { word: "Maayong aga", translation: "Good morning", pronunciation: "ma-a-yong a-ga", category: "greeting" },
        { word: "Maayong hapon", translation: "Good afternoon", pronunciation: "ma-a-yong ha-pon", category: "greeting" },
        { word: "Maayong gabi", translation: "Good evening", pronunciation: "ma-a-yong ga-bi", category: "greeting" },
        { word: "Salamat", translation: "Thank you", pronunciation: "sa-la-mat", category: "courtesy" },
        { word: "Paalam", translation: "Goodbye", pronunciation: "pa-a-lam", category: "farewell" },
        { word: "Ngalan", translation: "Name", pronunciation: "nga-lan", category: "basic" },
        { word: "Ako", translation: "I/Me", pronunciation: "a-ko", category: "pronoun" }
      ],
      quizQuestions: [
        {
          id: "hil_1_1",
          question: "How do you say 'Good morning' in Hiligaynon?",
          options: ["Maayong gabi", "Maayong aga", "Maayong hapon", "Kamusta"],
          correctAnswer: 1,
          points: 10,
          explanation: "'Maayong aga' is used to greet someone in the morning in Hiligaynon.",
          difficulty: 'easy',
          type: 'multiple-choice'
        },
        {
          id: "hil_1_2",
          question: "What does 'Salamat' mean?",
          options: ["Hello", "Goodbye", "Thank you", "Good evening"],
          correctAnswer: 2,
          points: 10,
          explanation: "'Salamat' is the Hiligaynon word for 'Thank you'.",
          difficulty: 'easy',
          type: 'multiple-choice'
        },
        {
          id: "hil_1_3",
          question: "Which greeting would you use at 7 PM?",
          options: ["Maayong aga", "Maayong hapon", "Maayong gabi", "Paalam"],
          correctAnswer: 2,
          points: 15,
          explanation: "'Maayong gabi' (Good evening) is appropriate for evening hours.",
          difficulty: 'medium',
          type: 'multiple-choice'
        },
        {
          id: "hil_1_4",
          question: "Translate: 'My name is Maria'",
          options: ["Ako si Maria", "Ang akon ngalan kay Maria", "Kamusta Maria", "Salamat Maria"],
          correctAnswer: 1,
          points: 15,
          explanation: "'Ang akon ngalan kay...' is how you say 'My name is...' in Hiligaynon.",
          difficulty: 'medium',
          type: 'translation'
        },
        {
          id: "hil_1_5",
          question: "What's the appropriate response to 'Kamusta ka?'",
          options: ["Paalam", "Maayo man", "Salamat", "Ngalan"],
          correctAnswer: 1,
          points: 20,
          explanation: "'Maayo man' means 'I'm fine' and is the typical response to 'How are you?'",
          difficulty: 'hard',
          type: 'multiple-choice'
        }
      ],
      culturalNote: "In Hiligaynon culture, greetings often include asking about family and showing genuine concern for others' well-being."
    },
    2: {
      title: "Family and Relationships",
      description: "Learn words for family members and relationship terms",
      content: "Family is central to Hiligaynon culture. Extended families often live together or nearby, and showing respect to elders is paramount. Learning family terms helps you understand social hierarchies and relationships.",
      lessonObjectives: [
        "Master family member terms",
        "Understand age-based respect terms",
        "Learn relationship vocabulary"
      ],
      vocabulary: [
        { word: "Pamilya", translation: "Family", category: "family" },
        { word: "Tatay", translation: "Father", category: "family" },
        { word: "Nanay", translation: "Mother", category: "family" },
        { word: "Manghud", translation: "Younger sibling", category: "family" },
        { word: "Manong", translation: "Elder brother", category: "family" },
        { word: "Ate", translation: "Elder sister", category: "family" },
        { word: "Lolo", translation: "Grandfather", category: "family" },
        { word: "Lola", translation: "Grandmother", category: "family" }
      ],
      quizQuestions: [
        {
          id: "hil_2_1",
          question: "How do you say 'Mother' in Hiligaynon?",
          options: ["Tatay", "Nanay", "Ate", "Lola"],
          correctAnswer: 1,
          points: 10,
          explanation: "'Nanay' is the Hiligaynon word for mother.",
          difficulty: 'easy',
          type: 'multiple-choice'
        },
        {
          id: "hil_2_2",
          question: "What do you call your younger sibling?",
          options: ["Manong", "Ate", "Manghud", "Lolo"],
          correctAnswer: 2,
          points: 15,
          explanation: "'Manghud' refers to a younger sibling in Hiligaynon.",
          difficulty: 'medium',
          type: 'multiple-choice'
        }
      ]
    }
  },
  
  // WARAY (Dialect 2) 
  2: {
    1: {
      title: "Basic Greetings and Introductions",
      description: "Learn essential Waray greetings and introductions",
      content: "Waray, spoken in Eastern Visayas, is known for its strong consonants and rhythmic quality. The Waray people are known for their resilience and warmth, having endured many natural calamities while maintaining their vibrant culture.",
      lessonObjectives: [
        "Learn Waray greetings",
        "Master basic introductions",
        "Understand pronunciation patterns"
      ],
      vocabulary: [
        { word: "Kumusta", translation: "Hello", pronunciation: "ku-mus-ta", category: "greeting" },
        { word: "Maupay nga aga", translation: "Good morning", pronunciation: "ma-u-pay nga a-ga", category: "greeting" },
        { word: "Maupay nga kulop", translation: "Good afternoon", pronunciation: "ma-u-pay nga ku-lop", category: "greeting" },
        { word: "Maupay nga gab-i", translation: "Good evening", pronunciation: "ma-u-pay nga gab-i", category: "greeting" },
        { word: "Salamat", translation: "Thank you", pronunciation: "sa-la-mat", category: "courtesy" },
        { word: "Adios", translation: "Goodbye", pronunciation: "a-dios", category: "farewell" },
        { word: "Ngaran", translation: "Name", pronunciation: "nga-ran", category: "basic" },
        { word: "Ako", translation: "I/Me", pronunciation: "a-ko", category: "pronoun" }
      ],
      quizQuestions: [
        {
          id: "war_1_1",
          question: "How do you say 'Good morning' in Waray?",
          options: ["Maupay nga gab-i", "Maupay nga aga", "Maupay nga kulop", "Kumusta"],
          correctAnswer: 1,
          points: 10,
          explanation: "'Maupay nga aga' is the Waray greeting for good morning.",
          difficulty: 'easy',
          type: 'multiple-choice'
        },
        {
          id: "war_1_2",
          question: "What's different about 'Adios' in Waray?",
          options: ["It means hello", "It's borrowed from Spanish", "It's only for family", "It's formal only"],
          correctAnswer: 1,
          points: 15,
          explanation: "'Adios' is borrowed from Spanish and commonly used for goodbye in Waray.",
          difficulty: 'medium',
          type: 'multiple-choice'
        }
      ]
    }
  },

  // BIKOL (Dialect 3)
  3: {
    1: {
      title: "Basic Greetings and Introductions", 
      description: "Learn essential Bikol greetings and introductions",
      content: "Bikol is spoken in the Bicol region of Luzon, known for its spicy cuisine and the perfect cone of Mayon Volcano. The Bikol language has several varieties, but Central Bikol is the most widely spoken.",
      lessonObjectives: [
        "Learn Bikol greetings",
        "Understand regional variations",
        "Master polite expressions"
      ],
      vocabulary: [
        { word: "Kumusta", translation: "Hello", pronunciation: "ku-mus-ta", category: "greeting" },
        { word: "Maray na aga", translation: "Good morning", pronunciation: "ma-ray na a-ga", category: "greeting" },
        { word: "Maray na banggi", translation: "Good evening", pronunciation: "ma-ray na bang-gi", category: "greeting" },
        { word: "Salamat", translation: "Thank you", pronunciation: "sa-la-mat", category: "courtesy" },
        { word: "Paaram", translation: "Goodbye", pronunciation: "pa-a-ram", category: "farewell" },
        { word: "Ngaran", translation: "Name", pronunciation: "nga-ran", category: "basic" },
        { word: "Ako", translation: "I/Me", pronunciation: "a-ko", category: "pronoun" }
      ],
      quizQuestions: [
        {
          id: "bik_1_1",
          question: "How do you say 'Good morning' in Bikol?",
          options: ["Maray na banggi", "Maray na aga", "Kumusta", "Paaram"],
          correctAnswer: 1,
          points: 10,
          explanation: "'Maray na aga' is the Bikol greeting for good morning.",
          difficulty: 'easy',
          type: 'multiple-choice'
        }
      ]
    }
  },

  // ILOCANO (Dialect 4)
  4: {
    1: {
      title: "Basic Greetings and Introductions",
      description: "Learn essential Ilocano greetings and introductions", 
      content: "Ilocano is the third most-spoken language in the Philippines, primarily used in Northern Luzon. Known for the hardworking nature of its speakers, Ilocano culture emphasizes thriftiness and perseverance.",
      lessonObjectives: [
        "Learn Ilocano greetings",
        "Master formal and informal speech",
        "Understand cultural values in language"
      ],
      vocabulary: [
        { word: "Kumusta", translation: "Hello", pronunciation: "ku-mus-ta", category: "greeting" },
        { word: "Naimbag a bigat", translation: "Good morning", pronunciation: "na-im-bag a bi-gat", category: "greeting" },
        { word: "Naimbag a malem", translation: "Good afternoon", pronunciation: "na-im-bag a ma-lem", category: "greeting" },
        { word: "Naimbag a rabii", translation: "Good evening", pronunciation: "na-im-bag a ra-bi-i", category: "greeting" },
        { word: "Agyamanak", translation: "Thank you", pronunciation: "ag-ya-ma-nak", category: "courtesy" },
        { word: "Agpakadaakon", translation: "Goodbye", pronunciation: "ag-pa-ka-da-a-kon", category: "farewell" },
        { word: "Nagan", translation: "Name", pronunciation: "na-gan", category: "basic" },
        { word: "Siak", translation: "I/Me", pronunciation: "si-ak", category: "pronoun" }
      ],
      quizQuestions: [
        {
          id: "ilo_1_1", 
          question: "How do you say 'Good morning' in Ilocano?",
          options: ["Naimbag a rabii", "Naimbag a bigat", "Naimbag a malem", "Kumusta"],
          correctAnswer: 1,
          points: 10,
          explanation: "'Naimbag a bigat' is the Ilocano greeting for good morning.",
          difficulty: 'easy',
          type: 'multiple-choice'
        },
        {
          id: "ilo_1_2",
          question: "What makes Ilocano 'Thank you' unique?",
          options: ["It's longer than other dialects", "It starts with 'Ag'", "It's the same as Tagalog", "It's borrowed from Spanish"],
          correctAnswer: 1,
          points: 15,
          explanation: "'Agyamanak' is unique because it starts with 'Ag', a common Ilocano prefix.",
          difficulty: 'medium',
          type: 'multiple-choice'
        }
      ]
    }
  }
};

// Achievement definitions for different lesson completions
export const lessonAchievements = {
  firstLesson: {
    title: "First Steps",
    description: "Completed your first dialect lesson",
    icon: "🌟",
    points: 50
  },
  perfectScore: {
    title: "Perfect Scholar",
    description: "Scored 100% on a lesson quiz",
    icon: "🏆",
    points: 100
  },
  fastLearner: {
    title: "Speed Demon",
    description: "Completed a lesson in under 5 minutes",
    icon: "⚡",
    points: 75
  },
  dialectMaster: {
    title: "Dialect Master",
    description: "Completed all lessons in a dialect",
    icon: "👑",
    points: 500
  },
  polyglot: {
    title: "Polyglot",
    description: "Completed lessons in all 4 dialects",
    icon: "🌍",
    points: 1000
  }
};
