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

// Generate realistic Solat history for Umar (Child of hasby85@gmail.com)
function generateUmarSolatHistory(): SolatLogEntry[] {
  const entries: SolatLogEntry[] = [];
  for (let i = 0; i < 14; i++) {
    const dateStr = getRecentDateStr(i);
    entries.push({
      id: `solat-umar-${dateStr}`,
      date: dateStr,
      fardhu: {
        subuh: { completed: true, berjemaah: i % 2 === 0, status: "completed" },
        zohor: { completed: true, berjemaah: false, status: "completed" },
        asar: { completed: true, berjemaah: false, status: "completed" },
        maghrib: { completed: true, berjemaah: true, status: "completed" },
        isyak: { completed: true, berjemaah: true, status: "completed" }
      },
      sunat: {
        dhuha: i % 3 === 0,
        tahajjud: false,
        witir: i % 4 === 0,
        rawatib: i % 2 === 0,
        tarawih: false,
        hajat: false,
        taubat: false
      },
      note: i === 0 ? "Alhamdulillah solat awal waktu di masjid" : "",
      updatedAt: getRecentIsoStr(i, 2)
    });
  }
  return entries;
}

// Generate realistic Solat history for Aisyah (Child 2 of hasby85@gmail.com)
function generateAisyahSolatHistory(): SolatLogEntry[] {
  const entries: SolatLogEntry[] = [];
  for (let i = 0; i < 10; i++) {
    const dateStr = getRecentDateStr(i);
    entries.push({
      id: `solat-aisyah-${dateStr}`,
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
      note: i === 0 ? "Belajar solat bersama ibu" : "",
      updatedAt: getRecentIsoStr(i, 3)
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
  const umarSolatHistory = generateUmarSolatHistory();
  const aisyahSolatHistory = generateAisyahSolatHistory();

  const umarQadhaHistory: QadhaHistoryEntry[] = [
    {
      id: "q-umar-1",
      prayerKey: "zohor",
      prayerName: "Zohor",
      originalMissedDate: getRecentDateStr(5),
      dateReplaced: getRecentDateStr(4),
      timestamp: getRecentIsoStr(4, 1),
      note: "Ganti zohor (tertidur kepenatan)",
      rewardEarned: { xp: 15, coins: 5 }
    },
    {
      id: "q-umar-2",
      prayerKey: "subuh",
      prayerName: "Subuh",
      originalMissedDate: getRecentDateStr(8),
      dateReplaced: getRecentDateStr(7),
      timestamp: getRecentIsoStr(7, 2),
      note: "Ganti subuh bangun lewat",
      rewardEarned: { xp: 15, coins: 5 }
    }
  ];

  const umarSolatProgress: SolatProgress = {
    history: umarSolatHistory,
    totalFardhuCount: 68,
    totalSunatCount: 14,
    currentStreak: 12,
    qadhaPending: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
    qadhaCompleted: { subuh: 1, zohor: 1, asar: 0, maghrib: 0, isyak: 0 },
    qadhaHistory: umarQadhaHistory
  };

  const umarQuranProgress: QuranIqraProgress = {
    currentType: "iqra",
    currentIqraLevel: 5,
    currentIqraPage: 3,
    currentQuranJuzuk: 1,
    currentQuranSurahName: "Al-Fatihah",
    currentQuranPage: 1,
    currentQuranAyat: 1,
    lastUpdated: getRecentIsoStr(0, 1),
    history: [
      {
        id: "log-umar-1",
        type: "iqra",
        title: "Iqra 5 - Muka Surat 1",
        iqraLevel: 5,
        iqraPage: 1,
        completedAt: getRecentIsoStr(3, 4),
        parentNote: "Lancar membaca hukum mad dan waqaf."
      },
      {
        id: "log-umar-2",
        type: "iqra",
        title: "Iqra 5 - Muka Surat 2",
        iqraLevel: 5,
        iqraPage: 2,
        completedAt: getRecentIsoStr(2, 3),
        parentNote: "Sangat baik! Sebutan makhraj huruf jelas."
      },
      {
        id: "log-umar-3",
        type: "iqra",
        title: "Iqra 5 - Muka Surat 3",
        iqraLevel: 5,
        iqraPage: 3,
        completedAt: getRecentIsoStr(0, 2),
        parentNote: "Alhamdulillah siap tugasan Iqra hari ini."
      }
    ]
  };

  const aisyahSolatProgress: SolatProgress = {
    history: aisyahSolatHistory,
    totalFardhuCount: 46,
    totalSunatCount: 5,
    currentStreak: 9,
    qadhaPending: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
    qadhaCompleted: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
    qadhaHistory: []
  };

  const aisyahQuranProgress: QuranIqraProgress = {
    currentType: "iqra",
    currentIqraLevel: 2,
    currentIqraPage: 12,
    currentQuranJuzuk: 1,
    currentQuranSurahName: "Al-Fatihah",
    currentQuranPage: 1,
    currentQuranAyat: 1,
    lastUpdated: getRecentIsoStr(0, 3),
    history: [
      {
        id: "log-aisyah-1",
        type: "iqra",
        title: "Iqra 2 - Muka Surat 10",
        iqraLevel: 2,
        iqraPage: 10,
        completedAt: getRecentIsoStr(3, 5),
        parentNote: "Mengenal huruf bersambung dengan betul."
      },
      {
        id: "log-aisyah-2",
        type: "iqra",
        title: "Iqra 2 - Muka Surat 11",
        iqraLevel: 2,
        iqraPage: 11,
        completedAt: getRecentIsoStr(2, 4),
        parentNote: "Rajin mengulang baris kasrah."
      },
      {
        id: "log-aisyah-3",
        type: "iqra",
        title: "Iqra 2 - Muka Surat 12",
        iqraLevel: 2,
        iqraPage: 12,
        completedAt: getRecentIsoStr(0, 3),
        parentNote: "Pandai Aisyah! Teruskan belajar ya."
      }
    ]
  };

  const umarMissions: Mission[] = [
    {
      id: "m-umar-1",
      childId: "child-hasby-1",
      title: "Solat Subuh Berjemaah di Masjid",
      description: "Pergi ke masjid bersama ayah untuk solat Subuh berjemaah",
      category: "Islamic",
      xpReward: 50,
      coinReward: 20,
      status: "approved",
      difficulty: "Sederhana",
      parentComment: "Alhamdulillah sangat berdisiplin Umar!",
      completedAt: getRecentIsoStr(1, 4),
      approvedAt: getRecentIsoStr(1, 2)
    },
    {
      id: "m-umar-2",
      childId: "child-hasby-1",
      title: "Bantu Kemas Tempat Tidur & Bilik",
      description: "Kemas katil dan susun buku selepas bangun pagi",
      category: "Chores",
      xpReward: 30,
      coinReward: 10,
      status: "approved",
      difficulty: "Mudah",
      parentComment: "Bilik nampak bersih dan selesa.",
      completedAt: getRecentIsoStr(0, 6),
      approvedAt: getRecentIsoStr(0, 4)
    },
    {
      id: "m-umar-3",
      childId: "child-hasby-1",
      title: "Ulang Hafazan Surah An-Naba'",
      description: "Hafaz 5 ayat baharu surah An-Naba'",
      category: "Islamic",
      xpReward: 40,
      coinReward: 15,
      status: "todo",
      difficulty: "Cabar"
    }
  ];

  return {
    "hasby85@gmail.com": {
      user: SEED_ACCOUNTS[1],
      childrenProfiles: [
        {
          id: "child-hasby-1",
          parentId: "u-1786365979575",
          name: "Umar",
          age: 10,
          gender: "boy",
          avatar: {
            clothing: "Baju Melayu",
            headwear: "Songkok",
            accessory: "Cape",
            color: "#16a34a"
          },
          pet: {
            id: "pet-hasby-1",
            type: "cat",
            name: "Comel Cat",
            level: 2,
            xp: 140,
            hunger: 80,
            happiness: 90,
            sleep: 95,
            evolutionStage: 1
          },
          level: 3,
          xp: 380,
          coins: 480,
          diamonds: 15,
          energy: 100,
          streak: 12,
          unlockedWorlds: ["kampung", "masjid", "sekolah"],
          builtStructures: [],
          inventory: ["s1", "s4"],
          solatProgress: umarSolatProgress,
          quranIqraProgress: umarQuranProgress
        },
        {
          id: "child-hasby-2",
          parentId: "u-1786365979575",
          name: "Aisyah Humaira",
          age: 5,
          gender: "girl",
          avatar: {
            clothing: "Baju Kurung",
            headwear: "Hijab",
            accessory: "Bag",
            color: "#0284c7"
          },
          pet: {
            id: "pet-hasby-2",
            type: "rabbit",
            name: "Comel Bunny",
            level: 1,
            xp: 60,
            hunger: 70,
            happiness: 85,
            sleep: 80,
            evolutionStage: 1
          },
          level: 2,
          xp: 220,
          coins: 390,
          diamonds: 10,
          energy: 100,
          streak: 9,
          unlockedWorlds: ["kampung", "masjid"],
          builtStructures: [],
          inventory: ["s5"],
          solatProgress: aisyahSolatProgress,
          quranIqraProgress: aisyahQuranProgress
        }
      ],
      activeChildId: "child-hasby-1",
      missions: umarMissions,
      language: "bm",
      lastSyncedAt: getRecentIsoStr(0, 0)
    },
    "shahirah_mahfuzah@yahoo.com": {
      user: SEED_ACCOUNTS[2],
      childrenProfiles: [
        {
          id: "child-1786254477676",
          parentId: "u-1786367110215",
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
            id: "pet-1786254477676",
            type: "cat",
            name: "Bella",
            level: 8,
            xp: 350,
            hunger: 80,
            happiness: 85,
            sleep: 90,
            evolutionStage: 3
          },
          level: 1,
          xp: 350,
          coins: 328,
          diamonds: 11,
          energy: 100,
          streak: 4,
          unlockedWorlds: ["kampung"],
          builtStructures: [],
          inventory: [],
          solatProgress: {
            history: [
              {
                id: `solat-irfan-${getRecentDateStr(1)}`,
                date: getRecentDateStr(1),
                fardhu: {
                  subuh: { completed: true, berjemaah: false, status: "completed" },
                  zohor: { completed: true, berjemaah: false, status: "completed" },
                  asar: { completed: true, berjemaah: false, status: "completed" },
                  maghrib: { completed: true, berjemaah: false, status: "completed" },
                  isyak: { completed: true, berjemaah: false, status: "completed" }
                },
                sunat: { dhuha: false, tahajjud: false, witir: false, rawatib: false, tarawih: false, hajat: false, taubat: false },
                note: "",
                updatedAt: getRecentIsoStr(1, 2)
              }
            ],
            totalFardhuCount: 15,
            totalSunatCount: 2,
            currentStreak: 4,
            qadhaPending: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
            qadhaCompleted: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
            qadhaHistory: []
          },
          quranIqraProgress: {
            currentType: "iqra",
            currentIqraLevel: 5,
            currentIqraPage: 3,
            currentQuranJuzuk: 1,
            currentQuranSurahName: "Al-Fatihah",
            currentQuranPage: 1,
            currentQuranAyat: 1,
            lastUpdated: getRecentIsoStr(1, 2),
            history: [
              {
                id: "log-irfan-1",
                type: "iqra",
                title: "Iqra 5 - Muka Surat 3",
                iqraLevel: 5,
                iqraPage: 3,
                completedAt: getRecentIsoStr(1, 3),
                parentNote: "Awal perintis bacaan tajwid lancar."
              }
            ]
          }
        }
      ],
      activeChildId: "child-1786254477676",
      missions: [],
      language: "bm",
      lastSyncedAt: getRecentIsoStr(1, 1)
    },
    "asbie85@gmail.com": {
      user: SEED_ACCOUNTS[3],
      childrenProfiles: [
        {
          id: "child-asbie-1",
          parentId: "u-1786368888888",
          name: "Ahmad",
          age: 8,
          gender: "boy",
          avatar: {
            clothing: "Baju Melayu",
            headwear: "Songkok",
            accessory: "Cape",
            color: "#2563eb"
          },
          pet: {
            id: "pet-asbie-1",
            type: "cat",
            name: "Mimi",
            level: 3,
            xp: 200,
            hunger: 85,
            happiness: 90,
            sleep: 90,
            evolutionStage: 1
          },
          level: 3,
          xp: 310,
          coins: 450,
          diamonds: 12,
          energy: 100,
          streak: 7,
          unlockedWorlds: ["kampung", "masjid"],
          builtStructures: [],
          inventory: [],
          solatProgress: {
            history: [
              {
                id: `solat-ahmad-${getRecentDateStr(0)}`,
                date: getRecentDateStr(0),
                fardhu: {
                  subuh: { completed: true, berjemaah: true, status: "completed" },
                  zohor: { completed: true, berjemaah: false, status: "completed" },
                  asar: { completed: true, berjemaah: false, status: "completed" },
                  maghrib: { completed: true, berjemaah: true, status: "completed" },
                  isyak: { completed: true, berjemaah: true, status: "completed" }
                },
                sunat: { dhuha: true, tahajjud: false, witir: false, rawatib: false, tarawih: false, hajat: false, taubat: false },
                note: "Solat tepat pada waktu",
                updatedAt: getRecentIsoStr(0, 1)
              }
            ],
            totalFardhuCount: 35,
            totalSunatCount: 5,
            currentStreak: 7,
            qadhaPending: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
            qadhaCompleted: { subuh: 0, zohor: 0, asar: 0, maghrib: 0, isyak: 0 },
            qadhaHistory: []
          },
          quranIqraProgress: {
            currentType: "iqra",
            currentIqraLevel: 3,
            currentIqraPage: 5,
            currentQuranJuzuk: 1,
            currentQuranSurahName: "Al-Fatihah",
            currentQuranPage: 1,
            currentQuranAyat: 1,
            lastUpdated: getRecentIsoStr(0, 1),
            history: [
              {
                id: "log-ahmad-1",
                type: "iqra",
                title: "Iqra 3 - Muka Surat 5",
                iqraLevel: 3,
                iqraPage: 5,
                completedAt: getRecentIsoStr(0, 2),
                parentNote: "Lancar sebutan tanda mati."
              }
            ]
          }
        }
      ],
      activeChildId: "child-asbie-1",
      missions: [],
      language: "bm",
      lastSyncedAt: getRecentIsoStr(0, 1)
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
