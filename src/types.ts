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
  quranIqraProgress?: QuranIqraProgress;
  solatProgress?: SolatProgress;
  gamesProgress?: ChildGamesProgress;
  activeTitle?: string;
  customReward?: {
    title: string;
    targetXp: number;
    unlocked?: boolean;
  };
  lastDailyRewardDate?: string; // Date string "YYYY-MM-DD" when daily reward was last claimed
  scheduleActivities?: ScheduleActivity[]; // Per-child customizable routine schedule activities
}

export type GameId =
  | "find-match"
  | "memory-card"
  | "picture-quiz"
  | "word-search"
  | "spot-difference"
  | "coding-puzzle"
  | "kids-sudoku"
  | "crossword";

export interface GameRecord {
  stars: number; // 1 to 3
  highScore: number;
  timesCompleted: number;
  lastPlayed: string;
}

export interface ChildGamesProgress {
  totalStars: number;
  unlockedLevel: number;
  gamesPlayedCount: number;
  gameStats: Partial<Record<GameId, GameRecord>>;
  dailyStreak: number;
  lastPlayedDate?: string;
  isModuleUnlocked?: boolean; // if true, whole games arcade is unlocked
  unlockedGameIds?: GameId[]; // individual games bought with coins
}

export type RecurrenceType = "daily" | "date_range" | "custom_days" | "once";

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
  timeStart?: string;
  timeEnd?: string;
  hourSlot?: number;
  days?: DayOfWeek[];
  linkedModule?: ScheduleModuleLink;
  recurrenceType?: RecurrenceType;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  completedDates?: string[]; // Date strings "YYYY-MM-DD" when approved/completed
  pendingDate?: string;      // Date string "YYYY-MM-DD" when submitted
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

export interface ReadingLogEntry {
  id: string;
  type: "iqra" | "quran";
  title: string; // e.g. "Iqra 5 - Muka Surat 3" or "Al-Quran: Surah Al-Baqarah (Juzuk 1), Muka Surat 15"
  iqraLevel?: number; // 1 to 6
  iqraPage?: number; // 1 to 30
  quranJuzuk?: number; // 1 to 30
  quranSurahName?: string;
  quranPage?: number; // 1 to 604
  quranAyat?: number;
  completedAt: string;
  parentNote?: string;
}

export interface QuranIqraProgress {
  currentType: "iqra" | "quran";
  currentIqraLevel: number; // 1 to 6
  currentIqraPage: number; // 1 to 30
  currentQuranJuzuk: number; // 1 to 30
  currentQuranSurahName: string;
  currentQuranPage: number; // 1 to 604
  currentQuranAyat: number;
  lastUpdated: string;
  history: ReadingLogEntry[];
}

export type FardhuPrayerKey = "subuh" | "zohor" | "asar" | "maghrib" | "isyak";
export type FardhuPrayerStatus = "completed" | "missed" | "dimaafkan" | "none";

export interface FardhuPrayerItem {
  completed: boolean;
  berjemaah?: boolean;
  status?: FardhuPrayerStatus; // "completed" = Selesai, "missed" = Ditinggalkan/Perlu Ganti, "dimaafkan" = Di Maafkan (Haid/Uzur), "none" = Belum ditanda
  qadhaDone?: boolean; // Sama ada solat yang tertinggal ini telah digantikan
  qadhaDate?: string; // Tarikh penggantian solat qadha dilakukan
}

export interface QadhaPrayerCount {
  subuh: number;
  zohor: number;
  asar: number;
  maghrib: number;
  isyak: number;
}

export interface QadhaHistoryEntry {
  id: string;
  prayerKey: FardhuPrayerKey;
  prayerName: string;
  originalMissedDate?: string; // Tarikh asal solat ditinggalkan (YYYY-MM-DD atau 'Anggaran Silam')
  dateReplaced: string; // YYYY-MM-DD
  timestamp: string;
  note?: string;
  rewardEarned?: {
    xp: number;
    coins: number;
  };
}

export interface SolatLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  fardhu: {
    subuh: FardhuPrayerItem;
    zohor: FardhuPrayerItem;
    asar: FardhuPrayerItem;
    maghrib: FardhuPrayerItem;
    isyak: FardhuPrayerItem;
  };
  isDayExcused?: boolean; // Tanda keseluruhan hari dimaafkan (Uzur Syarie / Haid - Cuti Solat)
  excuseReason?: string; // e.g. "Haid / Uzur Syarie"
  sunat: {
    dhuha?: boolean;
    tahajjud?: boolean;
    witir?: boolean;
    rawatib?: boolean;
    tarawih?: boolean;
    hajat?: boolean;
    taubat?: boolean;
  };
  note?: string;
  updatedAt: string;
}

export interface SolatProgress {
  history: SolatLogEntry[]; // Record for each date
  totalFardhuCount: number;
  totalSunatCount: number;
  currentStreak: number;
  qadhaPending?: QadhaPrayerCount; // Bilangan solat fardhu yang perlu diganti mengikut waktu
  qadhaCompleted?: QadhaPrayerCount; // Bilangan solat yang telah selesai diganti
  qadhaHistory?: QadhaHistoryEntry[]; // Log rekod solat yang telah digantikan
}

export type DayOfWeek = "isnin" | "selasa" | "rabu" | "khamis" | "jumaat" | "sabtu" | "ahad";

export type ScheduleModuleLink =
  | "solat"
  | "jawi"
  | "hafazan"
  | "diari"
  | "permainan"
  | "world"
  | "none";

export interface ScheduleActivity {
  id: string;
  childId?: string; // optional: if set, specific to this child; if not set, applies to all
  days: DayOfWeek[]; // Days this activity runs on, e.g. ["isnin", "selasa"] or ["sabtu"]
  timeStart: string; // e.g. "06:00"
  timeEnd: string; // e.g. "07:00"
  hourSlot: number; // 6, 7, 8... 22 (for sorting)
  title: string;
  description: string;
  linkedModule: ScheduleModuleLink;
  coinsReward: number;
  xpReward: number;
  categoryIcon: string;
  completedDates?: string[]; // Date strings "YYYY-MM-DD" when completed
  createdAt?: string;
  recurrenceType?: RecurrenceType;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}


