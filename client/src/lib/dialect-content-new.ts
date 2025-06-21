// This file contains data for dialect-specific lessons
// Updated with authentic information from reliable linguistic sources
// Sources: Omniglot, Kiddle, Wikivoyage, Traveloka

export type DialectData = {
  id: number;
  name: string;
  description: string;
  region: string;
  color: string;
  culturalNotes: string;
  greetings: { [key: string]: string };
  commonPhrases: { [key: string]: string };
  speakers: string;
  characteristics: string;
};

// Authentic dialect-specific data
export const dialectData: DialectData[] = [
  // Dialect 1: Hiligaynon (based on Omniglot)
  {
    id: 1,
    name: "Hiligaynon (Ilonggo)",
    description: "A major Visayan language spoken in Western Visayas",
    region: "Western Visayas (Iloilo, Negros Occidental, parts of Mindanao)",
    color: "filipino-green",
    speakers: "Approximately 9 million speakers",
    characteristics: "Known for its melodious tone and gentle sound. Often considered one of the 'sweetest' sounding Philippine languages.",
    culturalNotes: "Hiligaynon speakers are known for their hospitality and gentle demeanor. The region is famous for MassKara Festival in Bacolod, Dinagyang Festival in Iloilo, and culinary specialties like La Paz Batchoy and Chicken Inasal. The language reflects the warm, hospitable culture of Western Visayas.",
    greetings: {
      "Hello/How are you?": "Kamusta",
      "Good morning": "Maayong aga",
      "Good afternoon": "Maayong kulop", 
      "Good evening": "Maayong gab-i",
      "Goodbye": "Paalam",
      "Thank you": "Salamat",
      "Excuse me/Sorry": "Pasaylo",
      "I'm fine": "Maayo man"
    },
    commonPhrases: {
      "How much is this?": "Pila ini?",
      "Where are you from?": "Diin ka ghalin?",
      "What is your name?": "Ano ang ngalan mo?",
      "I am hungry": "Gutom ako",
      "I am thirsty": "Uhaw ako", 
      "I am tired": "Kapoy ako",
      "None/Nothing": "Wala",
      "There is/are": "May ara"
    }
  },

  // Dialect 2: Waray (based on Kiddle)
  {
    id: 2,
    name: "Waray-Waray",
    description: "A major Visayan language spoken in Eastern Visayas",
    region: "Eastern Visayas (Samar, Leyte, parts of Mindanao)",
    color: "filipino-red", 
    speakers: "Approximately 3.5 million speakers",
    characteristics: "Distinct pronunciation with strong 'r' sounds. Has unique vocabulary different from other Visayan languages.",
    culturalNotes: "Waray speakers have a strong warrior tradition and are known for their resilience in facing natural disasters. The region celebrates Pintados-Kasadyaan Festival, highlighting the tattooed warriors of pre-colonial times. The culture emphasizes bravery, hospitality, and rich oral traditions.",
    greetings: {
      "Hello/How are you?": "Kumusta",
      "Good morning": "Maupay nga aga",
      "Good afternoon": "Maupay nga kulop",
      "Good evening": "Maupay nga gabi", 
      "Goodbye": "Paalam",
      "Thank you": "Salamat",
      "Excuse me/Sorry": "Pasaylo",
      "I'm fine": "Maupay la"
    },
    commonPhrases: {
      "How much is this?": "Pira ini?",
      "Where are you from?": "Hain ka naggikan?", 
      "What is your name?": "Ano an imo ngaran?",
      "I am hungry": "Gutom ako",
      "I am thirsty": "Uhaw ako",
      "I am tired": "Kapoy ako", 
      "None/Nothing": "Waray",
      "There is/are": "May ara"
    }
  },

  // Dialect 3: Bikol (based on Wikivoyage Bikol phrasebook)
  {
    id: 3,
    name: "Bikol/Bicol",
    description: "A major language spoken in the Bicol Region of southern Luzon",
    region: "Bicol Region (Albay, Camarines Sur, Sorsogon, parts of Quezon)",
    color: "filipino-blue",
    speakers: "Approximately 3.5 million speakers", 
    characteristics: "Several dialects within the region. Known for descriptive expressions and poetic language.",
    culturalNotes: "Bikol culture is famous for spicy cuisine (especially Bicol Express), the perfect cone of Mayon Volcano, and strong religious traditions. The region celebrates festivals like Ibalong and Peñafrancia. Known for hospitality and artistic traditions including crafts and folk songs.",
    greetings: {
      "Hello/How are you?": "Kumusta",
      "Good morning": "Marayong aga",
      "Good afternoon": "Marayong kulop",
      "Good evening": "Marayong gabi",
      "Goodbye": "Paaram", 
      "Thank you": "Salamat",
      "Excuse me/Sorry": "Pasensya na",
      "I'm fine": "Maray man"
    },
    commonPhrases: {
      "How much is this?": "Pirma ini?",
      "Where are you from?": "Sain ka naggikan?",
      "What is your name?": "Ano an pangaran mo?",
      "I am hungry": "Gigutom ako",
      "I am thirsty": "Giuhaw ako",
      "I am tired": "Pagod ako",
      "None/Nothing": "Mayo", 
      "There is/are": "May"
    }
  },

  // Dialect 4: Ilocano (based on Wikivoyage and Traveloka)
  {
    id: 4,
    name: "Ilocano",
    description: "A major language spoken in Northern Luzon and beyond",
    region: "Northern Luzon (Ilocos Region, parts of Cagayan Valley, and other areas)",
    color: "filipino-yellow",
    speakers: "Approximately 10 million speakers",
    characteristics: "Practical and straightforward expressions. Has Spanish and Chinese loanwords due to historical trade.",
    culturalNotes: "Ilocano culture is known for thriftiness (kuripot), hard work, and resilience. The region features Spanish colonial architecture, beautiful coastlines, and traditions like abel weaving. Celebrations include Longganisa Festival and Guling Festival. Known for empanada, bagnet, and pinakbet cuisine.",
    greetings: {
      "Hello/How are you?": "Kumusta", 
      "Good morning": "Naimbag a bigat",
      "Good afternoon": "Naimbag a malem",
      "Good evening": "Naimbag a rabii",
      "Goodbye": "Agpakadan",
      "Thank you": "Agyaman", 
      "Excuse me/Sorry": "Dispensar",
      "I'm fine": "Nasayaat"
    },
    commonPhrases: {
      "How much is this?": "Mano ti gatad?",
      "Where are you from?": "Sadino ti naggapuam?",
      "What is your name?": "Ania ti naganmo?", 
      "I am hungry": "Bisinko",
      "I am thirsty": "Mawaw ak",
      "I am tired": "Nabannogak",
      "None/Nothing": "Awan",
      "There is/are": "Adda"
    }
  }
];

// Helper functions for dialect data
export const getDialectById = (id: number): DialectData | undefined => {
  return dialectData.find(dialect => dialect.id === id);
};

export const getAllDialects = (): DialectData[] => {
  return dialectData;
};

export const getDialectsByRegion = (region: string): DialectData[] => {
  return dialectData.filter(dialect => 
    dialect.region.toLowerCase().includes(region.toLowerCase())
  );
};

// Cultural and linguistic information
export const dialectFacts = {
  total_speakers: "Over 25 million speakers combined",
  regions_covered: "Luzon, Visayas, and Mindanao",
  language_family: "Austronesian > Malayo-Polynesian > Philippine",
  writing_system: "Latin script", 
  unesco_status: "Most are stable, but preservation efforts ongoing",
  learning_difficulty: "Moderate for English speakers",
  cultural_significance: "Each represents unique regional identity and traditions"
};

export default dialectData;
