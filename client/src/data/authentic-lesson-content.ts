// Authentic lesson content based on reliable sources
// Sources: Omniglot, Kiddle, Wikivoyage, Traveloka
// Dialects: Hiligaynon, Waray, Bikol, Ilocano

export interface LessonWord {
  word: string;
  translation: string;
  pronunciation?: string;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

export interface LessonContent {
  title: string;
  description: string;
  content: string;
  vocabulary: LessonWord[];
  quizQuestions: LessonQuizQuestion[];
}

// Authentic content based on linguistic sources
export const authenticLessonContent: Record<number, Record<number, LessonContent>> = {
  
  // DIALECT 1: HILIGAYNON (Ilonggo) - Based on Omniglot source
  1: {
    // Lesson 1: Basic Greetings and Politeness
    1: {
      title: "Basic Greetings and Politeness",
      description: "Learn essential Hiligaynon greetings used in Western Visayas",
      content: "Hiligaynon, also called Ilonggo, is spoken in Western Visayas, particularly in Iloilo, Negros Occidental, and parts of Mindanao. Known for its melodious tone, Hiligaynon places great emphasis on respectful greetings and polite expressions. The language uses 'po' and 'ho' as markers of respect, similar to other Philippine languages.",
      vocabulary: [
        { word: "Kamusta", translation: "Hello/How are you?", pronunciation: "ka-MUS-ta" },
        { word: "Maayong aga", translation: "Good morning", pronunciation: "ma-A-yong A-ga" },
        { word: "Maayong kulop", translation: "Good afternoon", pronunciation: "ma-A-yong KU-lop" },
        { word: "Maayong gab-i", translation: "Good evening", pronunciation: "ma-A-yong ga-BI" },
        { word: "Salamat", translation: "Thank you", pronunciation: "sa-LA-mat" },
        { word: "Paalam", translation: "Goodbye", pronunciation: "pa-A-lam" },
        { word: "Pasaylo", translation: "Excuse me/Sorry", pronunciation: "pa-SAY-lo" },
        { word: "Maayo man", translation: "I'm fine", pronunciation: "ma-A-yo man" }
      ],
      quizQuestions: [
        {
          question: "What is the correct Hiligaynon greeting for 'Good morning'?",
          options: ["Maayong gab-i", "Maayong aga", "Maayong kulop", "Kamusta"],
          correctAnswer: 1,
          points: 10,
          explanation: "Maayong aga means 'Good morning' in Hiligaynon."
        },
        {
          question: "How do you say 'Thank you' in Hiligaynon?",
          options: ["Paalam", "Pasaylo", "Salamat", "Kamusta"],
          correctAnswer: 2,
          points: 10,
          explanation: "Salamat is the universal way to say 'Thank you' across Philippine languages."
        }
      ]
    },

    // Lesson 2: Basic Phrases and Expressions
    2: {
      title: "Basic Phrases and Expressions",
      description: "Common Hiligaynon phrases for daily conversations",
      content: "Hiligaynon conversation often includes expressions of concern and care. The language has unique ways to express emotions and states of being that reflect the warm, hospitable culture of Western Visayas.",
      vocabulary: [
        { word: "Pila ini?", translation: "How much is this?", pronunciation: "PI-la i-ni" },
        { word: "Diin ka ghalin?", translation: "Where are you from?", pronunciation: "di-IN ka ga-LIN" },
        { word: "Ano ang ngalan mo?", translation: "What is your name?", pronunciation: "A-no ang nga-LAN mo" },
        { word: "Gutom ako", translation: "I am hungry", pronunciation: "GU-tom a-ko" },
        { word: "Uhaw ako", translation: "I am thirsty", pronunciation: "U-haw a-ko" },
        { word: "Kapoy ako", translation: "I am tired", pronunciation: "ka-POY a-ko" },
        { word: "Wala", translation: "None/Nothing", pronunciation: "wa-LA" },
        { word: "May ara", translation: "There is/are", pronunciation: "may a-RA" }
      ],
      quizQuestions: [
        {
          question: "How do you ask 'How much is this?' in Hiligaynon?",
          options: ["Pila ini?", "Diin ka ghalin?", "Ano ang ngalan mo?", "Gutom ako"],
          correctAnswer: 0,
          points: 15,
          explanation: "Pila ini? is used to ask about the price of something."
        },
        {
          question: "What does 'Kapoy ako' mean?",
          options: ["I am hungry", "I am thirsty", "I am tired", "I am happy"],
          correctAnswer: 2,
          points: 15,
          explanation: "Kapoy means tired, so 'Kapoy ako' means 'I am tired'."
        }
      ]
    },

    // Lesson 3: Numbers and Time
    3: {
      title: "Numbers and Time",
      description: "Learn Hiligaynon numbers and time expressions",
      content: "Numbers in Hiligaynon follow a pattern similar to other Visayan languages. Understanding numbers is essential for shopping, telling time, and daily transactions in Western Visayas.",
      vocabulary: [
        { word: "Isa", translation: "One", pronunciation: "i-SA" },
        { word: "Duha", translation: "Two", pronunciation: "du-HA" },
        { word: "Tatlo", translation: "Three", pronunciation: "tat-LO" },
        { word: "Apat", translation: "Four", pronunciation: "a-PAT" },
        { word: "Lima", translation: "Five", pronunciation: "li-MA" },
        { word: "Unom", translation: "Six", pronunciation: "u-NOM" },
        { word: "Pito", translation: "Seven", pronunciation: "pi-TO" },
        { word: "Walo", translation: "Eight", pronunciation: "wa-LO" },
        { word: "Siyam", translation: "Nine", pronunciation: "si-YAM" },
        { word: "Napulo", translation: "Ten", pronunciation: "na-PU-lo" }
      ],
      quizQuestions: [
        {
          question: "What is 'Five' in Hiligaynon?",
          options: ["Apat", "Lima", "Unom", "Pito"],
          correctAnswer: 1,
          points: 10,
          explanation: "Lima means five in Hiligaynon."
        },
        {
          question: "What number is 'Napulo'?",
          options: ["Eight", "Nine", "Ten", "Eleven"],
          correctAnswer: 2,
          points: 10,
          explanation: "Napulo means ten in Hiligaynon."
        }
      ]
    },

    // Lesson 4: Family and Relationships
    4: {
      title: "Family and Relationships",
      description: "Learn Hiligaynon words for family members and relationships",
      content: "Family is central to Hiligaynon culture. Understanding family terms helps visitors connect with the strong family-oriented society of Western Visayas. These terms are used daily and show respect for relationships.",
      vocabulary: [
        { word: "Pamilya", translation: "Family", pronunciation: "pa-MIL-ya" },
        { word: "Tatay", translation: "Father", pronunciation: "ta-TAY" },
        { word: "Nanay", translation: "Mother", pronunciation: "na-NAY" },
        { word: "Manghud", translation: "Younger sibling", pronunciation: "mang-HUD" },
        { word: "Manong", translation: "Older brother", pronunciation: "ma-NONG" },
        { word: "Manang", translation: "Older sister", pronunciation: "ma-NANG" },
        { word: "Lolo", translation: "Grandfather", pronunciation: "lo-LO" },
        { word: "Lola", translation: "Grandmother", pronunciation: "lo-LA" },
        { word: "Bata", translation: "Child", pronunciation: "ba-TA" },
        { word: "Higala", translation: "Friend", pronunciation: "hi-ga-LA" }
      ],
      quizQuestions: [
        {
          question: "What is 'younger sibling' in Hiligaynon?",
          options: ["Manong", "Manang", "Manghud", "Higala"],
          correctAnswer: 2,
          points: 15,
          explanation: "Manghud refers to a younger sibling in Hiligaynon."
        },
        {
          question: "How do you say 'friend' in Hiligaynon?",
          options: ["Pamilya", "Bata", "Higala", "Lola"],
          correctAnswer: 2,
          points: 15,
          explanation: "Higala means friend in Hiligaynon."
        }
      ]
    },

    // Lesson 5: Food and Dining
    5: {
      title: "Food and Dining",
      description: "Essential Hiligaynon food vocabulary and dining expressions",
      content: "Western Visayas is famous for its delicious cuisine including La Paz Batchoy, KBL (Kadyos, Baboy, Langka), and fresh seafood. Learning food vocabulary helps visitors enjoy the rich culinary culture.",
      vocabulary: [
        { word: "Pagkaon", translation: "Food", pronunciation: "pag-ka-ON" },
        { word: "Tubig", translation: "Water", pronunciation: "tu-BIG" },
        { word: "Kanon", translation: "Rice", pronunciation: "ka-NON" },
        { word: "Karne", translation: "Meat", pronunciation: "kar-NE" },
        { word: "Isda", translation: "Fish", pronunciation: "is-DA" },
        { word: "Utanon", translation: "Vegetables", pronunciation: "u-ta-NON" },
        { word: "Tam-is", translation: "Sweet", pronunciation: "tam-IS" },
        { word: "Aslom", translation: "Salty", pronunciation: "as-LOM" },
        { word: "Kaon kita", translation: "Let's eat", pronunciation: "ka-ON ki-ta" },
        { word: "Busog na ako", translation: "I'm full", pronunciation: "bu-SOG na a-ko" }
      ],
      quizQuestions: [
        {
          question: "What does 'Kaon kita' mean?",
          options: ["I'm hungry", "Let's eat", "It's delicious", "I'm full"],
          correctAnswer: 1,
          points: 15,
          explanation: "Kaon kita is an invitation meaning 'Let's eat' in Hiligaynon."
        },
        {
          question: "How do you say 'vegetables' in Hiligaynon?",
          options: ["Isda", "Karne", "Utanon", "Kanon"],
          correctAnswer: 2,
          points: 15,
          explanation: "Utanon means vegetables in Hiligaynon."
        }
      ]
    }
  },

  // DIALECT 2: WARAY - Based on Kiddle source
  2: {
    // Lesson 1: Basic Greetings
    1: {
      title: "Basic Greetings and Introduction",
      description: "Essential Waray greetings from Eastern Visayas",
      content: "Waray is primarily spoken in Eastern Visayas, including Samar, Leyte, and parts of Mindanao. The language is known for its distinct pronunciation and unique vocabulary that sets it apart from other Visayan languages. Waray speakers are known for their strong cultural identity and hospitality.",
      vocabulary: [
        { word: "Kumusta", translation: "Hello/How are you?", pronunciation: "ku-MUS-ta" },
        { word: "Maupay nga aga", translation: "Good morning", pronunciation: "ma-U-pay nga a-GA" },
        { word: "Maupay nga kulop", translation: "Good afternoon", pronunciation: "ma-U-pay nga ku-LOP" },
        { word: "Maupay nga gabi", translation: "Good evening", pronunciation: "ma-U-pay nga ga-BI" },
        { word: "Salamat", translation: "Thank you", pronunciation: "sa-LA-mat" },
        { word: "Paalam", translation: "Goodbye", pronunciation: "pa-A-lam" },
        { word: "Pasaylo", translation: "Excuse me/Sorry", pronunciation: "pa-SAY-lo" },
        { word: "Maupay la", translation: "I'm fine", pronunciation: "ma-U-pay la" }
      ],
      quizQuestions: [
        {
          question: "How do you say 'Good morning' in Waray?",
          options: ["Maupay nga gabi", "Maupay nga aga", "Maupay nga kulop", "Kumusta"],
          correctAnswer: 1,
          points: 10,
          explanation: "Maupay nga aga is the Waray greeting for 'Good morning'."
        },
        {
          question: "What does 'Maupay la' mean?",
          options: ["Good morning", "Thank you", "I'm fine", "Goodbye"],
          correctAnswer: 2,
          points: 10,
          explanation: "Maupay la is a common response meaning 'I'm fine' in Waray."
        }
      ]
    },

    // Lesson 2: Common Expressions
    2: {
      title: "Common Expressions and Questions",
      description: "Useful Waray phrases for daily conversation",
      content: "Waray conversation includes many unique expressions that reflect the culture of Eastern Visayas. The language has specific ways to ask questions and express common needs that are essential for visitors and learners.",
      vocabulary: [
        { word: "Pira ini?", translation: "How much is this?", pronunciation: "PI-ra i-ni" },
        { word: "Hain ka naggikan?", translation: "Where are you from?", pronunciation: "ha-IN ka nag-gi-KAN" },
        { word: "Ano an imo ngaran?", translation: "What is your name?", pronunciation: "A-no an i-mo nga-RAN" },
        { word: "Gutom ako", translation: "I am hungry", pronunciation: "GU-tom a-ko" },
        { word: "Uhaw ako", translation: "I am thirsty", pronunciation: "U-haw a-ko" },
        { word: "Kapoy ako", translation: "I am tired", pronunciation: "ka-POY a-ko" },
        { word: "Waray", translation: "None/Nothing", pronunciation: "wa-RAY" },
        { word: "May ara", translation: "There is/are", pronunciation: "may a-RA" }
      ],
      quizQuestions: [
        {
          question: "How do you ask 'What is your name?' in Waray?",
          options: ["Pira ini?", "Hain ka naggikan?", "Ano an imo ngaran?", "Gutom ako"],
          correctAnswer: 2,
          points: 15,
          explanation: "Ano an imo ngaran? is how you ask someone's name in Waray."
        },
        {
          question: "What does 'Waray' mean in Waray language?",
          options: ["Yes", "No", "None/Nothing", "Maybe"],
          correctAnswer: 2,
          points: 15,
          explanation: "Waray means 'none' or 'nothing' - it's also the name of the language itself."
        }
      ]
    },

    // Lesson 3: Family Terms
    3: {
      title: "Family Terms and Relationships",
      description: "Important Waray words for family members",
      content: "Family bonds are very strong in Eastern Visayas culture. These Waray family terms are essential for building relationships and showing respect in Waray-speaking communities.",
      vocabulary: [
        { word: "Pamilya", translation: "Family", pronunciation: "pa-MIL-ya" },
        { word: "Tatay", translation: "Father", pronunciation: "ta-TAY" },
        { word: "Nanay", translation: "Mother", pronunciation: "na-NAY" },
        { word: "Utod", translation: "Sibling", pronunciation: "u-TOD" },
        { word: "Kuya", translation: "Older brother", pronunciation: "ku-YA" },
        { word: "Ate", translation: "Older sister", pronunciation: "a-TE" },
        { word: "Lolo", translation: "Grandfather", pronunciation: "lo-LO" },
        { word: "Lola", translation: "Grandmother", pronunciation: "lo-LA" },
        { word: "Bata", translation: "Child", pronunciation: "ba-TA" },
        { word: "Higala", translation: "Friend", pronunciation: "hi-ga-LA" }
      ],
      quizQuestions: [
        {
          question: "What is 'sibling' in Waray?",
          options: ["Utod", "Kuya", "Ate", "Bata"],
          correctAnswer: 0,
          points: 15,
          explanation: "Utod means sibling in Waray."
        },
        {
          question: "How do you say 'child' in Waray?",
          options: ["Lolo", "Lola", "Bata", "Higala"],
          correctAnswer: 2,
          points: 15,
          explanation: "Bata means child in Waray."
        }
      ]
    },

    // Lesson 4: Food and Meals
    4: {
      title: "Food and Meals",
      description: "Waray vocabulary for food and dining",
      content: "Eastern Visayas cuisine includes unique dishes like binagol, moron, and fresh seafood. Learning food vocabulary helps visitors appreciate the local culinary traditions.",
      vocabulary: [
        { word: "Pagkaon", translation: "Food", pronunciation: "pag-ka-ON" },
        { word: "Tubig", translation: "Water", pronunciation: "tu-BIG" },
        { word: "Bugas", translation: "Rice", pronunciation: "bu-GAS" },
        { word: "Karne", translation: "Meat", pronunciation: "kar-NE" },
        { word: "Isda", translation: "Fish", pronunciation: "is-DA" },
        { word: "Utan", translation: "Vegetables", pronunciation: "u-TAN" },
        { word: "Tam-is", translation: "Sweet", pronunciation: "tam-IS" },
        { word: "Aslom", translation: "Salty", pronunciation: "as-LOM" },
        { word: "Kaon kita", translation: "Let's eat", pronunciation: "ka-ON ki-ta" },
        { word: "Busog na ako", translation: "I'm full", pronunciation: "bu-SOG na a-ko" }
      ],
      quizQuestions: [
        {
          question: "What is 'rice' in Waray?",
          options: ["Tubig", "Bugas", "Karne", "Isda"],
          correctAnswer: 1,
          points: 15,
          explanation: "Bugas means rice in Waray."
        },
        {
          question: "What does 'Busog na ako' mean?",
          options: ["I'm hungry", "Let's eat", "I'm thirsty", "I'm full"],
          correctAnswer: 3,
          points: 15,
          explanation: "Busog na ako means 'I'm full' in Waray."
        }
      ]
    }
  },

  // DIALECT 3: BIKOL - Based on Wikivoyage Bikol phrasebook
  3: {
    // Lesson 1: Essential Greetings
    1: {
      title: "Essential Greetings and Courtesy",
      description: "Basic Bikol greetings from the Bicol Region",
      content: "Bikol (also spelled Bicol) is spoken in the Bicol Region of southern Luzon, including provinces like Albay, Camarines Sur, and Sorsogon. The language has several dialects but shares common greeting patterns. Bikol culture emphasizes respect and hospitality, reflected in their polite expressions.",
      vocabulary: [
        { word: "Kumusta", translation: "Hello/How are you?", pronunciation: "ku-MUS-ta" },
        { word: "Marayong aga", translation: "Good morning", pronunciation: "ma-RA-yong a-GA" },
        { word: "Marayong kulop", translation: "Good afternoon", pronunciation: "ma-RA-yong ku-LOP" },
        { word: "Marayong gabi", translation: "Good evening", pronunciation: "ma-RA-yong ga-BI" },
        { word: "Salamat", translation: "Thank you", pronunciation: "sa-LA-mat" },
        { word: "Paaram", translation: "Goodbye", pronunciation: "pa-A-ram" },
        { word: "Pasensya na", translation: "Excuse me/Sorry", pronunciation: "pa-SEN-sya na" },
        { word: "Maray man", translation: "I'm fine", pronunciation: "ma-RAY man" }
      ],
      quizQuestions: [
        {
          question: "What is the Bikol greeting for 'Good afternoon'?",
          options: ["Marayong aga", "Marayong kulop", "Marayong gabi", "Kumusta"],
          correctAnswer: 1,
          points: 10,
          explanation: "Marayong kulop is 'Good afternoon' in Bikol."
        },
        {
          question: "How do you say 'Goodbye' in Bikol?",
          options: ["Salamat", "Paaram", "Pasensya na", "Maray man"],
          correctAnswer: 1,
          points: 10,
          explanation: "Paaram is the Bikol way to say goodbye."
        }
      ]
    },

    // Lesson 2: Basic Communication
    2: {
      title: "Basic Communication Phrases",
      description: "Essential Bikol phrases for travelers",
      content: "Bikol phrases for basic communication include asking directions, prices, and expressing basic needs. The Bicol Region is known for its spicy cuisine and beautiful landscapes, making these phrases useful for tourists.",
      vocabulary: [
        { word: "Pirma ini?", translation: "How much is this?", pronunciation: "PIR-ma i-ni" },
        { word: "Sain ka naggikan?", translation: "Where are you from?", pronunciation: "sa-IN ka nag-gi-KAN" },
        { word: "Ano an pangaran mo?", translation: "What is your name?", pronunciation: "A-no an pa-nga-RAN mo" },
        { word: "Gigutom ako", translation: "I am hungry", pronunciation: "gi-GU-tom a-ko" },
        { word: "Giuhaw ako", translation: "I am thirsty", pronunciation: "gi-U-haw a-ko" },
        { word: "Pagod ako", translation: "I am tired", pronunciation: "pa-GOD a-ko" },
        { word: "Mayo", translation: "None/Nothing", pronunciation: "ma-YO" },
        { word: "May", translation: "There is/are", pronunciation: "may" }
      ],
      quizQuestions: [
        {
          question: "How do you say 'I am hungry' in Bikol?",
          options: ["Giuhaw ako", "Gigutom ako", "Pagod ako", "Mayo"],
          correctAnswer: 1,
          points: 15,
          explanation: "Gigutom ako means 'I am hungry' in Bikol."
        },
        {
          question: "What does 'Mayo' mean in Bikol?",
          options: ["Yes", "None/Nothing", "Maybe", "Always"],
          correctAnswer: 1,
          points: 15,
          explanation: "Mayo means 'none' or 'nothing' in Bikol."
        }
      ]
    },

    // Lesson 3: Family and Social Terms
    3: {
      title: "Family and Social Terms",
      description: "Bikol words for family and social relationships",
      content: "Family structure is important in Bicol culture. These terms help visitors understand and participate in the family-centered social interactions common in the region.",
      vocabulary: [
        { word: "Pamilya", translation: "Family", pronunciation: "pa-MIL-ya" },
        { word: "Tatay", translation: "Father", pronunciation: "ta-TAY" },
        { word: "Nanay", translation: "Mother", pronunciation: "na-NAY" },
        { word: "Tugang", translation: "Sibling", pronunciation: "tu-GANG" },
        { word: "Kuya", translation: "Older brother", pronunciation: "ku-YA" },
        { word: "Ate", translation: "Older sister", pronunciation: "a-TE" },
        { word: "Lolo", translation: "Grandfather", pronunciation: "lo-LO" },
        { word: "Lola", translation: "Grandmother", pronunciation: "lo-LA" },
        { word: "Aki", translation: "Child", pronunciation: "a-KI" },
        { word: "Kaibatudan", translation: "Friend", pronunciation: "ka-i-ba-tu-DAN" }
      ],
      quizQuestions: [
        {
          question: "What is 'sibling' in Bikol?",
          options: ["Tugang", "Kuya", "Ate", "Aki"],
          correctAnswer: 0,
          points: 15,
          explanation: "Tugang means sibling in Bikol."
        },
        {
          question: "How do you say 'friend' in Bikol?",
          options: ["Pamilya", "Aki", "Lolo", "Kaibatudan"],
          correctAnswer: 3,
          points: 15,
          explanation: "Kaibatudan means friend in Bikol."
        }
      ]
    },

    // Lesson 4: Food and Local Cuisine
    4: {
      title: "Food and Local Cuisine",
      description: "Essential Bikol food vocabulary",
      content: "The Bicol region is famous for its spicy cuisine, especially dishes with coconut milk and chili peppers. Learning food terms helps visitors navigate local markets and restaurants.",
      vocabulary: [
        { word: "Pagkakan", translation: "Food", pronunciation: "pag-ka-KAN" },
        { word: "Tubig", translation: "Water", pronunciation: "tu-BIG" },
        { word: "Bagasbas", translation: "Rice", pronunciation: "ba-gas-BAS" },
        { word: "Karne", translation: "Meat", pronunciation: "kar-NE" },
        { word: "Sira", translation: "Fish", pronunciation: "si-RA" },
        { word: "Gulay", translation: "Vegetables", pronunciation: "gu-LAY" },
        { word: "Mahamis", translation: "Sweet", pronunciation: "ma-ha-MIS" },
        { word: "Maaslom", translation: "Salty", pronunciation: "ma-as-LOM" },
        { word: "Maanghang", translation: "Spicy", pronunciation: "ma-ang-HANG" },
        { word: "Kakan kita", translation: "Let's eat", pronunciation: "ka-KAN ki-ta" }
      ],
      quizQuestions: [
        {
          question: "What does 'Maanghang' mean?",
          options: ["Sweet", "Salty", "Spicy", "Bitter"],
          correctAnswer: 2,
          points: 15,
          explanation: "Maanghang means spicy in Bikol - very appropriate for Bicol cuisine!"
        },
        {
          question: "How do you say 'fish' in Bikol?",
          options: ["Sira", "Karne", "Gulay", "Tubig"],
          correctAnswer: 0,
          points: 15,
          explanation: "Sira means fish in Bikol."
        }
      ]
    }
  },

  // DIALECT 4: ILOCANO - Based on Wikivoyage and Traveloka sources
  4: {
    // Lesson 1: Greetings and Basic Courtesy
    1: {
      title: "Greetings and Basic Courtesy",
      description: "Essential Ilocano greetings from Northern Luzon",
      content: "Ilocano is primarily spoken in Northern Luzon, including the Ilocos Region, parts of Cagayan Valley, and other areas. Known for its practical and straightforward expressions, Ilocano reflects the hardworking and resilient culture of the north. The language has unique pronunciation patterns and vocabulary.",
      vocabulary: [
        { word: "Kumusta", translation: "Hello/How are you?", pronunciation: "ku-MUS-ta" },
        { word: "Naimbag a bigat", translation: "Good morning", pronunciation: "na-IM-bag a bi-GAT" },
        { word: "Naimbag a malem", translation: "Good afternoon", pronunciation: "na-IM-bag a ma-LEM" },
        { word: "Naimbag a rabii", translation: "Good evening", pronunciation: "na-IM-bag a ra-BI-i" },
        { word: "Agyaman", translation: "Thank you", pronunciation: "ag-ya-MAN" },
        { word: "Agpakadan", translation: "Goodbye", pronunciation: "ag-pa-ka-DAN" },
        { word: "Dispensar", translation: "Excuse me/Sorry", pronunciation: "dis-pen-SAR" },
        { word: "Nasayaat", translation: "I'm fine", pronunciation: "na-sa-ya-AT" }
      ],
      quizQuestions: [
        {
          question: "How do you say 'Good morning' in Ilocano?",
          options: ["Naimbag a rabii", "Naimbag a bigat", "Naimbag a malem", "Kumusta"],
          correctAnswer: 1,
          points: 10,
          explanation: "Naimbag a bigat is the Ilocano greeting for 'Good morning'."
        },
        {
          question: "What is the Ilocano word for 'Thank you'?",
          options: ["Agyaman", "Agpakadan", "Dispensar", "Nasayaat"],
          correctAnswer: 0,
          points: 10,
          explanation: "Agyaman is the Ilocano way to say 'Thank you'."
        }
      ]
    },

    // Lesson 2: Essential Phrases
    2: {
      title: "Essential Phrases for Travelers",
      description: "Practical Ilocano phrases for daily use",
      content: "These Ilocano phrases are particularly useful for travelers to Northern Luzon. The region is known for its historic sites, beautiful beaches, and distinctive cuisine. Understanding these basic phrases will help visitors connect with the warm and hospitable Ilocano people.",
      vocabulary: [
        { word: "Mano ti gatad?", translation: "How much is this?", pronunciation: "ma-NO ti ga-TAD" },
        { word: "Sadino ti naggapuam?", translation: "Where are you from?", pronunciation: "sa-DI-no ti nag-ga-pu-AM" },
        { word: "Ania ti naganmo?", translation: "What is your name?", pronunciation: "a-NI-a ti na-gan-MO" },
        { word: "Bisinko", translation: "I am hungry", pronunciation: "bi-SIN-ko" },
        { word: "Mawaw ak", translation: "I am thirsty", pronunciation: "ma-WAW ak" },
        { word: "Nabannogak", translation: "I am tired", pronunciation: "na-ban-NO-gak" },
        { word: "Awan", translation: "None/Nothing", pronunciation: "a-WAN" },
        { word: "Adda", translation: "There is/are", pronunciation: "ad-DA" }
      ],
      quizQuestions: [
        {
          question: "How do you ask 'Where are you from?' in Ilocano?",
          options: ["Mano ti gatad?", "Sadino ti naggapuam?", "Ania ti naganmo?", "Bisinko"],
          correctAnswer: 1,
          points: 15,
          explanation: "Sadino ti naggapuam? is how you ask where someone is from in Ilocano."
        },
        {
          question: "What does 'Awan' mean in Ilocano?",
          options: ["Yes", "None/Nothing", "Maybe", "Always"],
          correctAnswer: 1,
          points: 15,
          explanation: "Awan means 'none' or 'nothing' in Ilocano."
        }
      ]
    },

    // Lesson 3: Numbers and Basic Conversation
    3: {
      title: "Numbers and Basic Conversation",
      description: "Ilocano numbers and conversational phrases",
      content: "Learning numbers in Ilocano is essential for shopping, telling time, and basic transactions. Northern Luzon markets and businesses often appreciate when visitors attempt to use the local language.",
      vocabulary: [
        { word: "Maysa", translation: "One", pronunciation: "may-SA" },
        { word: "Dua", translation: "Two", pronunciation: "du-A" },
        { word: "Tallo", translation: "Three", pronunciation: "tal-LO" },
        { word: "Uppat", translation: "Four", pronunciation: "up-PAT" },
        { word: "Lima", translation: "Five", pronunciation: "li-MA" },
        { word: "Innem", translation: "Six", pronunciation: "in-NEM" },
        { word: "Pito", translation: "Seven", pronunciation: "pi-TO" },
        { word: "Walo", translation: "Eight", pronunciation: "wa-LO" },
        { word: "Siam", translation: "Nine", pronunciation: "si-AM" },
        { word: "Sangapulo", translation: "Ten", pronunciation: "sa-nga-PU-lo" }
      ],
      quizQuestions: [
        {
          question: "What is 'Three' in Ilocano?",
          options: ["Dua", "Tallo", "Uppat", "Lima"],
          correctAnswer: 1,
          points: 10,
          explanation: "Tallo means three in Ilocano."
        },
        {
          question: "What number is 'Sangapulo'?",
          options: ["Eight", "Nine", "Ten", "Eleven"],
          correctAnswer: 2,
          points: 10,
          explanation: "Sangapulo means ten in Ilocano."
        }
      ]
    },

    // Lesson 4: Family Terms
    4: {
      title: "Family Terms and Relationships",
      description: "Important Ilocano family vocabulary",
      content: "Family relationships are highly valued in Ilocano culture. These terms help visitors show proper respect and understanding of family structures in Northern Luzon communities.",
      vocabulary: [
        { word: "Pamilia", translation: "Family", pronunciation: "pa-mi-LI-a" },
        { word: "Tatang", translation: "Father", pronunciation: "ta-TANG" },
        { word: "Nanang", translation: "Mother", pronunciation: "na-NANG" },
        { word: "Kabsat", translation: "Sibling", pronunciation: "kab-SAT" },
        { word: "Manong", translation: "Older brother", pronunciation: "ma-NONG" },
        { word: "Manang", translation: "Older sister", pronunciation: "ma-NANG" },
        { word: "Lolo", translation: "Grandfather", pronunciation: "lo-LO" },
        { word: "Lola", translation: "Grandmother", pronunciation: "lo-LA" },
        { word: "Ubing", translation: "Child", pronunciation: "u-BING" },
        { word: "Gayyem", translation: "Friend", pronunciation: "gay-YEM" }
      ],
      quizQuestions: [
        {
          question: "What is 'sibling' in Ilocano?",
          options: ["Kabsat", "Manong", "Manang", "Ubing"],
          correctAnswer: 0,
          points: 15,
          explanation: "Kabsat means sibling in Ilocano."
        },
        {
          question: "How do you say 'friend' in Ilocano?",
          options: ["Pamilia", "Ubing", "Gayyem", "Lola"],
          correctAnswer: 2,
          points: 15,
          explanation: "Gayyem means friend in Ilocano."
        }
      ]
    },

    // Lesson 5: Food and Market Terms
    5: {
      title: "Food and Market Terms",
      description: "Essential Ilocano vocabulary for food and shopping",
      content: "Northern Luzon markets offer fresh produce, local delicacies like longganisa, and traditional crafts. These terms help visitors navigate markets and enjoy local cuisine.",
      vocabulary: [
        { word: "Taraon", translation: "Food", pronunciation: "ta-ra-ON" },
        { word: "Danum", translation: "Water", pronunciation: "da-NUM" },
        { word: "Pagay", translation: "Rice", pronunciation: "pa-GAY" },
        { word: "Karne", translation: "Meat", pronunciation: "kar-NE" },
        { word: "Lames", translation: "Fish", pronunciation: "la-MES" },
        { word: "Nateng", translation: "Vegetables", pronunciation: "na-TENG" },
        { word: "Nasam-it", translation: "Sweet", pronunciation: "na-sam-IT" },
        { word: "Naapgad", translation: "Salty", pronunciation: "na-ap-GAD" },
        { word: "Mangankayo", translation: "Let's eat", pronunciation: "ma-ngan-ka-YO" },
        { word: "Nabusto", translation: "I'm full", pronunciation: "na-bus-TO" }
      ],
      quizQuestions: [
        {
          question: "What is 'water' in Ilocano?",
          options: ["Taraon", "Danum", "Pagay", "Lames"],
          correctAnswer: 1,
          points: 15,
          explanation: "Danum means water in Ilocano."
        },
        {
          question: "What does 'Mangankayo' mean?",
          options: ["I'm hungry", "Let's eat", "It's delicious", "I'm full"],
          correctAnswer: 1,
          points: 15,
          explanation: "Mangankayo is an invitation meaning 'Let's eat' in Ilocano."
        }
      ]
    }
  }
};

// Additional cultural notes for each dialect
export const culturalNotes = {
  1: { // Hiligaynon
    name: "Hiligaynon (Ilonggo)",
    region: "Western Visayas (Iloilo, Negros Occidental)",
    speakers: "Approximately 9 million",
    characteristics: "Known for its melodious tone and gentle sound. Often considered one of the 'sweetest' sounding Philippine languages.",
    culture: "Known for hospitality, MassKara Festival, and rich culinary traditions including La Paz Batchoy."
  },
  2: { // Waray
    name: "Waray-Waray",
    region: "Eastern Visayas (Samar, Leyte)",
    speakers: "Approximately 3.5 million", 
    characteristics: "Distinct pronunciation with strong 'r' sounds. Has unique vocabulary different from other Visayan languages.",
    culture: "Strong warrior tradition, resilient people known for surviving natural disasters, rich oral traditions."
  },
  3: { // Bikol
    name: "Bikol/Bicol",
    region: "Bicol Region (Albay, Camarines Sur, Sorsogon)",
    speakers: "Approximately 3.5 million",
    characteristics: "Several dialects within the region. Known for descriptive expressions and poetic language.",
    culture: "Famous for spicy cuisine (Bicol Express), beautiful landscapes including Mayon Volcano, and strong religious traditions."
  },
  4: { // Ilocano
    name: "Ilocano",
    region: "Northern Luzon (Ilocos Region, parts of Cagayan Valley)",
    speakers: "Approximately 10 million",
    characteristics: "Practical and straightforward expressions. Has Spanish and Chinese loanwords due to historical trade.",
    culture: "Known for thriftiness, hard work, historic Spanish colonial architecture, and traditions like weaving."
  }
};
