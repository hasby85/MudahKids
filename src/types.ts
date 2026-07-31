export type Language = "bm" | "en";

export type Role = "parent" | "child" | "admin";

export type MembershipPlan = "PREMIUM";

export type MissionCategory = "Islamic" | "Jawi" | "Chores";

export type MissionDifficulty = "Mudah" | "Sederhana" | "Cabar";

export type MissionStatus = "todo" | "pending_approval" | "approved" | "rejected";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  plan: MembershipPlan;
  accessCode: string;
  password?: string;
  createdAt: string;
}

export interface HafazanVerse {
  ayatNumber: number;
  arabicText: string;
  latinText: string;
  translation: string;
}

export interface SurahHafazan {
  id: string;
  number: number;
  nameArabic: string;
  nameMalay: string;
  meaning: string;
  totalAyat: number;
  description: string;
  verses: HafazanVerse[];
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  age: number;
  gender: "boy" | "girl";
  avatar: {
    clothing: string; // "Baju Melayu", "Baju Kurung", "Jubah", "Modern Islamic"
    headwear: string; // "Songkok", "Hijab", "None"
    accessory: string; // "Glasses", "Bag", "Shoes", "Hat", "None"
    color: string;
  };
  pet: {
    id: string;
    type: "cat" | "rabbit" | "bird" | "camel" | "horse" | "goat" | "owl";
    name: string;
    level: number;
    xp: number;
    hunger: number; // 0-100
    happiness: number; // 0-100
    sleep: number; // 0-100
    evolutionStage: 1 | 2 | 3;
    accessory?: string;
  };
  level: number;
  xp: number;
  coins: number;
  diamonds: number;
  energy: number;
  streak: number;
  unlockedWorlds: string[];
  builtStructures: BuiltStructure[];
  inventory: string[];
  jawiProgress?: {
    unlockedLevel: number;
    completedLevels: number[];
    levelActivities?: Record<number, { tracing?: boolean; test?: boolean; builder?: boolean }>;
  };
  hafazanProgress?: {
    completedSurahIds: string[];
    verseProgress?: Record<string, number[]>; // surahId -> array of completed verse numbers
  };
  activeTitle?: string;
  customReward?: {
    title: string;
    targetXp: number;
    unlocked?: boolean;
  };
}

export interface Mission {
  id: string;
  childId: string;
  title: string;
  description: string;
  category: MissionCategory;
  xpReward: number;
  coinReward: number;
  status: MissionStatus;
  difficulty: MissionDifficulty;
  proofRequired?: "photo" | "voice" | "none";
  proofUrl?: string;
  proofNote?: string;
  parentComment?: string;
  rejectionReason?: string;
  createdByChild?: boolean;
  requestedXp?: number;
  requestedCoins?: number;
  completedAt?: string;
  approvedAt?: string;
}

export interface JakimNote {
  id: string;
  category: "solat_lelaki" | "solat_perempuan" | "bacaan_solat" | "wuduk" | "doa_harian" | "syarat_rukun" | "custom_parent";
  title: string;
  arabicText?: string;
  latinText?: string;
  translation: string;
  genderTarget?: "boy" | "girl" | "all";
  explanation: string;
  steps?: {
    stepNumber: number;
    title: string;
    detail: string;
    arabicText?: string;
    latinText?: string;
    translation?: string;
    illustrationEmoji?: string;
  }[];
  addedByParent?: boolean;
}

export interface BuiltStructure {
  id: string;
  type: string; // "House", "Mosque", "School", "Library", "Farm", "Garden", "Bridge", "Market", "Playground", "Trees", "Lamp", "Fountain"
  name: string;
  x: number;
  y: number;
}

export interface JawiLesson {
  id: string;
  letter: string;
  jawiName: string;
  soundHint: string; // e.g. "Bunyi 'B'" or "Sebutan 'Baju'"
  latinWord: string;
  jawiWord: string;
  translation: string;
  imageEmoji: string;
  audioPrompt: string;
}

export interface JawiQuizQuestion {
  id: string;
  questionText: string;
  questionTextEn?: string;
  jawiDisplay: string;
  audioPrompt: string;
  options: string[];
  correctAnswer: string;
}

export interface JawiLevel {
  levelNumber: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn?: string;
  difficulty: "Mudah" | "Sederhana" | "Cabar";
  icon: string;
  lessons: JawiLesson[];
  quizQuestions: JawiQuizQuestion[];
}

export interface ShopItem {
  id: string;
  name: string;
  nameEn: string;
  category: "pet" | "avatar" | "decoration" | "furniture" | "title";
  price: number;
  currency: "coins" | "diamonds";
  image: string;
  unlockedLevel: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarEmoji: string;
  xp: number;
  coins: number;
  streak: number;
  category: "family" | "friends" | "school";
}

export interface Achievement {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardCoins: number;
}
