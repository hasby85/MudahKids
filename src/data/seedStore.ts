import { UserAccount, ChildProfile, Mission, SolatProgress, QuranIqraProgress, SolatLogEntry, QadhaHistoryEntry } from "../types";

// Helper to generate dynamic recent dates for realistic activity logs
function getRecentDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function getRecentIsoStr(daysAgo: number, hoursAgo = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

// Generate realistic Solat history for Irfan (Child 1 - Age 13)
function generateIrfanSolatHistory(): SolatLogEntry[] {
  const entries: SolatLogEntry[] = [];
  for (let i = 0; i < 14; i++) {
    const dateStr = getRecentDateStr(i);
    entries.push({
      id: `solat-irfan-${dateStr}`,
      date: dateStr,
      fardhu: {
        subuh: { completed: true, berjemaah: i % 2 === 0, status: "completed" },
        zohor: { completed: true, berjemaah: false, status: "completed" },
        asar: { completed: true, berjemaah: false, status: "completed" },
        maghrib: { completed: true, berjemaah: true, status: "completed" },
        isyak: { completed: true, berjemaah: true, status: "completed" }
      },
      sunat: {
        dhuha: i % 2 === 0,
        tahajjud: false,
        witir: i % 3 === 0,
        rawatib: true,
        tarawih: false,
        hajat: false,
        taubat: false
      },
      note: i === 0 ? "Alhamdulillah solat awal waktu dan berjemaah di masjid bersama ayah" : "",
      updatedAt: getRecentIsoStr(i, 2)
    });
  }
  return entries;
}

// Generate realistic Solat history for Afiq (Child 2 - Age 10)
function generateAfiqSolatHistory(): SolatLogEntry[] {
  const entries: SolatLogEntry[] = [];
  for (let i = 0; i < 10; i++) {
    const dateStr = getRecentDateStr(i);
    entries.push({
      id: `solat-afiq-${dateStr}`,
      date: dateStr,
      fardhu: {
        subuh: { completed: true, berjemaah: true, status: "completed" },
        zohor: { completed: true, berjemaah: false, status: "completed" },
        asar: { completed: true, berjemaah: false, status: "completed" },
        maghrib: { completed: true, berjemaah: true, status: "completed" },
        isyak: { completed: true, berjemaah: true, status: "completed" }
      },
      sunat: {
        dhuha: i % 3 === 0,
        tahajjud: false,
        witir: false,
        rawatib: i % 2 === 0,
        tarawih: false,
        hajat: false,
        taubat: false
      },
      note: i === 0 ? "Solat 5 waktu lengkap dengan khusyuk" : "",
      updatedAt: getRecentIsoStr(i, 3)
    });
  }
  return entries;
}

// Generate realistic Solat history for Ulfah (Child 3 - Age 7)
function generateUlfahSolatHistory(): SolatLogEntry[] {
  const entries: SolatLogEntry[] = [];
  for (let i = 0; i < 8; i++) {
    const dateStr = getRecentDateStr(i);
    entries.push({
      id: `solat-ulfah-${dateStr}`,
      date: dateStr,
      fardhu: {
        subuh: { completed: true, berjemaah: true, status: "completed" },
        zohor: { completed: true, berjemaah: false, status: "completed" },
        asar: { completed: true, berjemaah: false, status: "completed" },
        maghrib: { completed: true, berjemaah: true, status: "completed" },
        isyak: { completed: i % 3 !== 0, berjemaah: true, status: i % 3 !== 0 ? "completed" : "none" }
      },
      sunat: {
        dhuha: i % 2 === 0,
        tahajjud: false,
        witir: false,
        rawatib: false,
        tarawih: false,
        hajat: false,
        taubat: false
      },
      note: i === 0 ? "Belajar solat dan doa bersama ibu" : "",
      updatedAt: getRecentIsoStr(i, 4)
    });
  }
  return entries;
}

export const SEED_ACCOUNTS: UserAccount[] = [
  {
    id: "u-101",
    name: "Encik Hafiz & Puan Sarah",
    email: "hafiz.family@example.com",
    phone: "012-3456789",
    role: "parent",
    plan: "PREMIUM",
    accessCode: "MudahKids2026",
    password: "Password123",
    createdAt: "2026-08-10T12:42:58.800Z"
  },
  {
    id: "u-1786365979575",
    name: "hasby",
    email: "hasby85@gmail.com",
    phone: "0172352651",
    role: "parent",
    plan: "PREMIUM",
    accessCode: "MudahKids2026",
    password: "hasby123",
    createdAt: "2026-08-10T12:46:19.575Z"
  },
  {
    id: "u-1786367110215",
    name: "Shira",
    email: "shahirah_mahfuzah@yahoo.com",
    phone: "0123179556",
    role: "parent",
    plan: "PREMIUM",
    accessCode: "MudahKids2026",
    password: "shira123",
    createdAt: "2026-08-10T13:05:10.215Z"
  },
  {
    id: "u-1786368888888",
    name: "Asbie",
    email: "asbie85@gmail.com",
    phone: "0198765432",
    role: "parent",
    plan: "PREMIUM",
    accessCode: "MudahKids2026",
    password: "asbie123",
    createdAt: "2026-08-10T13:10:00.000Z"
  }
];

export function buildSeedSyncedData(): Record<string, any> {
  const irfanSolatHistory = generateIrfanSolatHistory();
  const afiqSolatHistory = generateAfiqSolatHistory();
  const ulfahSolatHistory = generateUlfahSolatHistory();

  const irfanQadhaHistory: QadhaHistoryEntry[] = [
    {
      id: "q-irfan-1",
      prayerKey: "zohor",
      prayerName: "Zohor",
      originalMissedDate: getRecentDateStr(5),
      dateReplaced: getRecentDateStr(4),
      timestamp: getRecentIsoStr(4, 1),
      note: "Ganti zohor (tertidur kepenatan selepas sekolah)",
      rewardEarned: { xp: 15, coins: 5 }
    }
  ];

  const irfanSolatProgress: SolatProgress = {
    history: irfanSolatHistory,
    totalFardhuCount: 70,
    totalSunatCount: 18,
    currentStreak: 14,
    qadhaPending: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
    qadhaCompleted: { subuh: 0, zohor: 1, asar: 0, maghrib: 0, isyak: 0 },
    qadhaHistory: irfanQadhaHistory
  };

  const afiqSolatProgress: SolatProgress = {
    history: afiqSolatHistory,
    totalFardhuCount: 48,
    totalSunatCount: 6,
    currentStreak: 10,
    qadhaPending: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
    qadhaCompleted: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
    qadhaHistory: []
  };

  const ulfahSolatProgress: SolatProgress = {
    history: ulfahSolatHistory,
    totalFardhuCount: 38,
    totalSunatCount: 4,
    currentStreak: 8,
    qadhaPending: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
    qadhaCompleted: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
    qadhaHistory: []
  };

  const irfanQuranProgress: QuranIqraProgress = {
    currentType: "quran",
    currentIqraLevel: 6,
    currentIqraPage: 30,
    currentQuranJuzuk: 2,
    currentQuranSurahName: "Al-Baqarah",
    currentQuranPage: 25,
    currentQuranAyat: 160,
    lastUpdated: getRecentIsoStr(0, 1),
    history: [
      {
        id: "log-irfan-1",
        type: "quran",
        title: "Al-Quran - Surah Al-Baqarah (Ayat 142 - 152)",
        quranSurahName: "Al-Baqarah",
        quranAyat: 152,
        quranJuzuk: 2,
        completedAt: getRecentIsoStr(3, 4),
        parentNote: "Lancar membaca hukum mad dan tajwid makhraj sangat baik!"
      },
      {
        id: "log-irfan-2",
        type: "quran",
        title: "Al-Quran - Surah Al-Baqarah (Ayat 153 - 160)",
        quranSurahName: "Al-Baqarah",
        quranAyat: 160,
        quranJuzuk: 2,
        completedAt: getRecentIsoStr(1, 3),
        parentNote: "Alhamdulillah sangat tekun. Teruskan hafazan surah pilihan."
      },
      {
        id: "log-irfan-3",
        type: "iqra",
        title: "Iqra 6 - Penamat & Ujian Tajwid",
        iqraLevel: 6,
        iqraPage: 30,
        completedAt: getRecentIsoStr(14, 2),
        parentNote: "Syabas Irfan khatam Iqra 6 dengan cemerlang!"
      }
    ]
  };

  const afiqQuranProgress: QuranIqraProgress = {
    currentType: "iqra",
    currentIqraLevel: 4,
    currentIqraPage: 18,
    currentQuranJuzuk: 1,
    currentQuranSurahName: "Al-Fatihah",
    currentQuranPage: 1,
    currentQuranAyat: 1,
    lastUpdated: getRecentIsoStr(0, 2),
    history: [
      {
        id: "log-afiq-1",
        type: "iqra",
        title: "Iqra 4 - Muka Surat 16",
        iqraLevel: 4,
        iqraPage: 16,
        completedAt: getRecentIsoStr(3, 3),
        parentNote: "Mengenal tanda sukun dan tanwin dengan tepat."
      },
      {
        id: "log-afiq-2",
        type: "iqra",
        title: "Iqra 4 - Muka Surat 17",
        iqraLevel: 4,
        iqraPage: 17,
        completedAt: getRecentIsoStr(1, 4),
        parentNote: "Bagus Afiq, sebutan huruf makin jelas."
      },
      {
        id: "log-afiq-3",
        type: "iqra",
        title: "Iqra 4 - Muka Surat 18",
        iqraLevel: 4,
        iqraPage: 18,
        completedAt: getRecentIsoStr(0, 2),
        parentNote: "Alhamdulillah siap tugasan Iqra hari ini."
      }
    ]
  };

  const ulfahQuranProgress: QuranIqraProgress = {
    currentType: "iqra",
    currentIqraLevel: 2,
    currentIqraPage: 10,
    currentQuranJuzuk: 1,
    currentQuranSurahName: "Al-Fatihah",
    currentQuranPage: 1,
    currentQuranAyat: 1,
    lastUpdated: getRecentIsoStr(0, 3),
    history: [
      {
        id: "log-ulfah-1",
        type: "iqra",
        title: "Iqra 2 - Muka Surat 8",
        iqraLevel: 2,
        iqraPage: 8,
        completedAt: getRecentIsoStr(3, 5),
        parentNote: "Mengenal huruf bersambung dengan betul."
      },
      {
        id: "log-ulfah-2",
        type: "iqra",
        title: "Iqra 2 - Muka Surat 9",
        iqraLevel: 2,
        iqraPage: 9,
        completedAt: getRecentIsoStr(2, 4),
        parentNote: "Rajin mengulang baris kasrah bersama ibu."
      },
      {
        id: "log-ulfah-3",
        type: "iqra",
        title: "Iqra 2 - Muka Surat 10",
        iqraLevel: 2,
        iqraPage: 10,
        completedAt: getRecentIsoStr(0, 3),
        parentNote: "Pandai Ulfah! Teruskan belajar ya sayang."
      }
    ]
  };

  // Build the 3 children profiles
  const createFamilyChildren = (parentId: string): ChildProfile[] => [
    {
      id: "child-hasby-irfan",
      parentId,
      name: "Irfan",
      age: 13,
      gender: "boy",
      avatar: {
        clothing: "Baju Melayu",
        headwear: "Songkok",
        accessory: "None",
        color: "#059669"
      },
      pet: {
        id: "pet-irfan-1",
        type: "cat",
        name: "Bella",
        level: 8,
        xp: 350,
        hunger: 85,
        happiness: 90,
        sleep: 95,
        evolutionStage: 3
      },
      level: 4,
      xp: 420,
      coins: 350,
      diamonds: 15,
      energy: 100,
      streak: 14,
      unlockedWorlds: ["kampung", "masjid", "sekolah", "perpustakaan"],
      builtStructures: [
        { id: "b1", type: "Mosque", name: "Masjid Al-Irfan", x: 2, y: 2 }
      ],
      inventory: ["s1", "s4"],
      solatProgress: irfanSolatProgress,
      quranIqraProgress: irfanQuranProgress,
      jawiProgress: {
        unlockedLevel: 4,
        completedLevels: [1, 2, 3],
        levelActivities: {
          1: { tracing: true, test: true, builder: true },
          2: { tracing: true, test: true, builder: true },
          3: { tracing: true, test: true, builder: true }
        }
      },
      hafazanProgress: {
        completedSurahIds: ["1", "112", "113", "114", "78", "67"]
      }
    },
    {
      id: "child-hasby-afiq",
      parentId,
      name: "Afiq",
      age: 10,
      gender: "boy",
      avatar: {
        clothing: "Baju Melayu",
        headwear: "Songkok",
        accessory: "Cap",
        color: "#2563eb"
      },
      pet: {
        id: "pet-afiq-1",
        type: "cat",
        name: "Oyen",
        level: 3,
        xp: 180,
        hunger: 80,
        happiness: 85,
        sleep: 90,
        evolutionStage: 2
      },
      level: 3,
      xp: 260,
      coins: 280,
      diamonds: 12,
      energy: 100,
      streak: 10,
      unlockedWorlds: ["kampung", "masjid", "sekolah"],
      builtStructures: [
        { id: "b2", type: "House", name: "Rumah Afiq", x: 1, y: 2 }
      ],
      inventory: ["s2"],
      solatProgress: afiqSolatProgress,
      quranIqraProgress: afiqQuranProgress,
      jawiProgress: {
        unlockedLevel: 3,
        completedLevels: [1, 2],
        levelActivities: {
          1: { tracing: true, test: true, builder: true },
          2: { tracing: true, test: true, builder: true }
        }
      },
      hafazanProgress: {
        completedSurahIds: ["1", "112", "113", "114", "93", "94"]
      }
    },
    {
      id: "child-hasby-ulfah",
      parentId,
      name: "Ulfah",
      age: 7,
      gender: "girl",
      avatar: {
        clothing: "Baju Kurung",
        headwear: "Hijab",
        accessory: "Ribbon",
        color: "#ec4899"
      },
      pet: {
        id: "pet-ulfah-1",
        type: "rabbit",
        name: "Comel Bunny",
        level: 2,
        xp: 120,
        hunger: 75,
        happiness: 90,
        sleep: 85,
        evolutionStage: 1
      },
      level: 2,
      xp: 190,
      coins: 240,
      diamonds: 10,
      energy: 100,
      streak: 8,
      unlockedWorlds: ["kampung", "masjid"],
      builtStructures: [
        { id: "b3", type: "Garden", name: "Taman Bunga Ulfah", x: 3, y: 1 }
      ],
      inventory: ["s5"],
      solatProgress: ulfahSolatProgress,
      quranIqraProgress: ulfahQuranProgress,
      jawiProgress: {
        unlockedLevel: 2,
        completedLevels: [1],
        levelActivities: {
          1: { tracing: true, test: true, builder: true }
        }
      },
      hafazanProgress: {
        completedSurahIds: ["1", "112", "113", "114"]
      }
    }
  ];

  const familyMissions: Mission[] = [
    // Irfan's Missions
    {
      id: "m-irfan-1",
      childId: "child-hasby-irfan",
      title: "Solat Subuh Berjemaah di Masjid bersama Ayah",
      description: "Tunaikan solat Subuh berjemaah di masjid untuk membina sahsiah diri",
      category: "Islamic",
      xpReward: 50,
      coinReward: 20,
      status: "approved",
      difficulty: "Sederhana",
      parentComment: "Alhamdulillah sangat berdisiplin Irfan!",
      completedAt: getRecentIsoStr(1, 4),
      approvedAt: getRecentIsoStr(1, 2)
    },
    {
      id: "m-irfan-2",
      childId: "child-hasby-irfan",
      title: "Bantu Kemas Ruang Tamu & Susun Buku",
      description: "Susun buku-buku sekolah dan bantu kemaskan ruang keluarga",
      category: "Chores",
      xpReward: 30,
      coinReward: 10,
      status: "approved",
      difficulty: "Mudah",
      parentComment: "Rumah nampak kemas dan teratur. Syabas abang Irfan!",
      completedAt: getRecentIsoStr(0, 6),
      approvedAt: getRecentIsoStr(0, 4)
    },
    {
      id: "m-irfan-3",
      childId: "child-hasby-irfan",
      title: "Ulang Kaji Hafazan Surah An-Naba'",
      description: "Hafaz dan ulang 10 ayat Surah An-Naba' bersama bacaan tajwid",
      category: "Islamic",
      xpReward: 40,
      coinReward: 15,
      status: "todo",
      difficulty: "Cabar"
    },
    // Afiq's Missions
    {
      id: "m-afiq-1",
      childId: "child-hasby-afiq",
      title: "Solat Asar Tepat Pada Waktu",
      description: "Ambil wuduk dan solat sebaik sahaja azan Asar berkumandang",
      category: "Islamic",
      xpReward: 40,
      coinReward: 15,
      status: "approved",
      difficulty: "Mudah",
      parentComment: "Bagus Afiq, solat tepat pada waktunya!",
      completedAt: getRecentIsoStr(1, 3),
      approvedAt: getRecentIsoStr(1, 1)
    },
    {
      id: "m-afiq-2",
      childId: "child-hasby-afiq",
      title: "Baca Iqra 4 Sebanyak 2 Muka Surat",
      description: "Membaca Iqra 4 dengan bimbingan dan semakan ibu bapa",
      category: "Islamic",
      xpReward: 35,
      coinReward: 12,
      status: "approved",
      difficulty: "Sederhana",
      parentComment: "Hebat Afiq! Teruskan usaha hingga khatam.",
      completedAt: getRecentIsoStr(0, 5),
      approvedAt: getRecentIsoStr(0, 3)
    },
    {
      id: "m-afiq-3",
      childId: "child-hasby-afiq",
      title: "Kemas Tempat Tidur & Bilik Sendiri",
      description: "Lipat selimut dan susun bantal setiap pagi selepas bangun",
      category: "Chores",
      xpReward: 25,
      coinReward: 10,
      status: "todo",
      difficulty: "Mudah"
    },
    // Ulfah's Missions
    {
      id: "m-ulfah-1",
      childId: "child-hasby-ulfah",
      title: "Belajar Praktikal Wuduk Sempurna bersama Ibu",
      description: "Lakukan rukun wuduk mengikut tertib yang betul dari niat hingga doa",
      category: "Islamic",
      xpReward: 40,
      coinReward: 15,
      status: "approved",
      difficulty: "Mudah",
      parentComment: "Alhamdulillah Ulfah pandai ambil wuduk sendiri!",
      completedAt: getRecentIsoStr(1, 2),
      approvedAt: getRecentIsoStr(1, 1)
    },
    {
      id: "m-ulfah-2",
      childId: "child-hasby-ulfah",
      title: "Hafaz Surah Al-Ikhlas dengan Tajwid Jelas",
      description: "Perdengarkan bacaan Surah Al-Ikhlas di hadapan ibu atau ayah",
      category: "Islamic",
      xpReward: 35,
      coinReward: 12,
      status: "approved",
      difficulty: "Mudah",
      parentComment: "Sedap bacaan Ulfah! Comel sangat.",
      completedAt: getRecentIsoStr(0, 4),
      approvedAt: getRecentIsoStr(0, 2)
    },
    {
      id: "m-ulfah-3",
      childId: "child-hasby-ulfah",
      title: "Bantu Lipat Pakaian & Susun Kasut",
      description: "Bantu ibu lipat pakaian sendiri dan susun kasut di rak",
      category: "Chores",
      xpReward: 25,
      coinReward: 10,
      status: "todo",
      difficulty: "Mudah"
    }
  ];

  return {
    "hafiz.family@example.com": {
      user: SEED_ACCOUNTS[0],
      childrenProfiles: createFamilyChildren("u-101"),
      activeChildId: "child-irfan",
      missions: familyMissions,
      language: "bm",
      lastSyncedAt: getRecentIsoStr(0, 0)
    }
  };
}

// Find an account matching email, phone, or name
export function findSeedAccount(input: string): UserAccount | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();
  for (const acc of SEED_ACCOUNTS) {
    if (
      acc.email.trim().toLowerCase() === clean ||
      (acc.phone && acc.phone.replace(/[^0-9]/g, "") === clean.replace(/[^0-9]/g, "")) ||
      acc.name.trim().toLowerCase() === clean
    ) {
      return acc;
    }
  }
  return null;
}
