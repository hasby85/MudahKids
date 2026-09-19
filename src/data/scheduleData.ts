import { ScheduleActivity, DayOfWeek } from "../types";

export const DAYS_OF_WEEK: { key: DayOfWeek; labelBm: string; labelEn: string; short: string; isWeekend?: boolean }[] = [
  { key: "isnin", labelBm: "Isnin", labelEn: "Monday", short: "Isn" },
  { key: "selasa", labelBm: "Selasa", labelEn: "Tuesday", short: "Sel" },
  { key: "rabu", labelBm: "Rabu", labelEn: "Wednesday", short: "Rab" },
  { key: "khamis", labelBm: "Khamis", labelEn: "Thursday", short: "Kha" },
  { key: "jumaat", labelBm: "Jumaat", labelEn: "Friday", short: "Jum" },
  { key: "sabtu", labelBm: "Sabtu", labelEn: "Saturday", short: "Sab", isWeekend: true },
  { key: "ahad", labelBm: "Ahad", labelEn: "Sunday", short: "Ahd", isWeekend: true }
];

export const getCurrentDayOfWeek = (): DayOfWeek => {
  const dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
  switch (dayIndex) {
    case 1:
      return "isnin";
    case 2:
      return "selasa";
    case 3:
      return "rabu";
    case 4:
      return "khamis";
    case 5:
      return "jumaat";
    case 6:
      return "sabtu";
    case 0:
    default:
      return "ahad";
  }
};

export const getTodayDateKey = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const DEFAULT_SCHEDULE_ACTIVITIES: ScheduleActivity[] = [
  // ===================== HARI SABTU (Contoh Utama Pengguna) =====================
  {
    id: "sch-sat-06",
    days: ["sabtu"],
    timeStart: "06:00",
    timeEnd: "07:00",
    hourSlot: 6,
    title: "Solat Subuh, Kemas Katil & Sarapan Pagi",
    description: "Solat subuh berjemaah, kemas katil bilik tidur, urus diri untuk ke sekolah / kelas tambahan, dan nikmati sarapan pagi berkhasiat.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-sat-07",
    days: ["sabtu"],
    timeStart: "07:00",
    timeEnd: "08:00",
    hourSlot: 7,
    title: "Ke Sekolah / Kelas Tambahan Pagi",
    description: "Berangkat ke sekolah / kelas bimbingan hujung minggu, bawa buku dan peralatan lengkap, bersalaman dengan ibu bapa.",
    linkedModule: "none",
    coinsReward: 10,
    xpReward: 20,
    categoryIcon: "🎒"
  },
  {
    id: "sch-sat-08",
    days: ["sabtu"],
    timeStart: "08:00",
    timeEnd: "10:00",
    hourSlot: 8,
    title: "Sesi Pembelajaran, Kelas & Ulangkaji",
    description: "Fokus belajar di kelas, tumpukan perhatian kepada guru, catat nota penting dan siapkan tugasan kelas.",
    linkedModule: "none",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🏫"
  },
  {
    id: "sch-sat-10",
    days: ["sabtu"],
    timeStart: "10:00",
    timeEnd: "11:00",
    hourSlot: 10,
    title: "Latihan Menulis & Mengeja Huruf Jawi",
    description: "Buka Modul Jawi MudahKids: Belajar sebutan huruf, padanan rumi ke Jawi, dan buat latihan lakaran di kanvas interaktif.",
    linkedModule: "jawi",
    coinsReward: 20,
    xpReward: 40,
    categoryIcon: "✏️"
  },
  {
    id: "sch-sat-11",
    days: ["sabtu"],
    timeStart: "11:00",
    timeEnd: "12:00",
    hourSlot: 11,
    title: "Ulang Hafazan Surah-surah Lazim",
    description: "Buka Modul Hafazan Cilik: Dengar bacaan surah, uji ingatan dengan kuiz susun ayat, dan semak sebutan makhraj.",
    linkedModule: "hafazan",
    coinsReward: 20,
    xpReward: 40,
    categoryIcon: "📜"
  },
  {
    id: "sch-sat-12",
    days: ["sabtu"],
    timeStart: "12:00",
    timeEnd: "13:00",
    hourSlot: 12,
    title: "Makan Tengah Hari & Bantu Ibu Bapa",
    description: "Makan tengah hari bersama keluarga, tolong basuh pinggan mangkuk sendiri, dan kemas meja makan.",
    linkedModule: "none",
    coinsReward: 10,
    xpReward: 20,
    categoryIcon: "🍲"
  },
  {
    id: "sch-sat-13",
    days: ["sabtu"],
    timeStart: "13:00",
    timeEnd: "14:00",
    hourSlot: 13,
    title: "Solat Zohor Berjemaah & Qailulah",
    description: "Ambil wuduk sempurna, solat Zohor berjemaah, dan ambil rehat singkat (qailulah) untuk pulihkan tenaga.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-sat-14",
    days: ["sabtu"],
    timeStart: "14:00",
    timeEnd: "15:30",
    hourSlot: 14,
    title: "Minda Cergas: Permainan Santai & Asah Otak",
    description: "Buka Modul Permainan MudahKids: Main teka silang kata, kad memori, sudoku kanak-kanak, atau cari perkataan.",
    linkedModule: "permainan",
    coinsReward: 15,
    xpReward: 25,
    categoryIcon: "🎮"
  },
  {
    id: "sch-sat-15",
    days: ["sabtu"],
    timeStart: "15:30",
    timeEnd: "16:30",
    hourSlot: 15,
    title: "Tadarus Iqra & Al-Quran 1 Muka Surat",
    description: "Buka Diari Iqra & Al-Quran: Rekod bacaan harian, perdengarkan bacaan kepada ibu bapa dan catat ayat.",
    linkedModule: "diari",
    coinsReward: 20,
    xpReward: 35,
    categoryIcon: "📖"
  },
  {
    id: "sch-sat-16",
    days: ["sabtu"],
    timeStart: "16:30",
    timeEnd: "17:30",
    hourSlot: 16,
    title: "Solat Asar Tepat Waktu",
    description: "Selesaikan solat Asar sejurus masuk waktu, berdoa kesejahteraan ibu bapa dan guru.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-sat-17",
    days: ["sabtu"],
    timeStart: "17:30",
    timeEnd: "18:45",
    hourSlot: 17,
    title: "Aktiviti Riadah Luar & Senaman Petang",
    description: "Bermain basikal, bola atau beriadah di halaman rumah. Mandi dan bersiap awal sebelum azan Maghrib.",
    linkedModule: "none",
    coinsReward: 10,
    xpReward: 20,
    categoryIcon: "⚽"
  },
  {
    id: "sch-sat-19",
    days: ["sabtu"],
    timeStart: "19:00",
    timeEnd: "20:00",
    hourSlot: 19,
    title: "Solat Maghrib & Tazkirah Ringkas",
    description: "Solat Maghrib bersama keluarga di surau / rumah, baca doa harian dan dengar perkongsian tazkirah.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-sat-20",
    days: ["sabtu"],
    timeStart: "20:00",
    timeEnd: "21:00",
    hourSlot: 20,
    title: "Makan Malam Bersama Keluarga & Sembang Mesra",
    description: "Makan malam bersama keluarga, berkongsi cerita pengalaman hari ini, dan bantu kemas dapur.",
    linkedModule: "none",
    coinsReward: 10,
    xpReward: 20,
    categoryIcon: "🍽️"
  },
  {
    id: "sch-sat-21",
    days: ["sabtu"],
    timeStart: "21:00",
    timeEnd: "22:00",
    hourSlot: 21,
    title: "Solat Isyak & Bersedia Tidur Awal",
    description: "Solat Isyak 4 rakaat, berus gigi, kemas beg untuk esok, baca doa tidur & Surah Al-Mulk sebelum tidur lena.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "😴"
  },

  // ===================== HARI ISNIN - JUMAAT (Hari Persekolahan Biasa) =====================
  {
    id: "sch-wk-06",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "06:00",
    timeEnd: "07:00",
    hourSlot: 6,
    title: "Bangun Pagi, Solat Subuh & Kemas Katil",
    description: "Solat subuh awal waktu, kemas cadar bilik tidur, mandi, pakai pakaian seragam sekolah & bersarapan.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-wk-07",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "07:00",
    timeEnd: "13:00",
    hourSlot: 7,
    title: "Sesi Pembelajaran di Sekolah Harian",
    description: "Belajar bersungguh-sungguh di sekolah, hormati guru, jaga adab sesama rakan.",
    linkedModule: "none",
    coinsReward: 20,
    xpReward: 40,
    categoryIcon: "🏫"
  },
  {
    id: "sch-wk-13",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "13:00",
    timeEnd: "14:00",
    hourSlot: 13,
    title: "Pulang Sekolah, Solat Zohor & Makan",
    description: "Gantung pakaian seragam, mandi, solat Zohor tepat waktu dan nikmati makan tengah hari.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-wk-14",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "14:00",
    timeEnd: "15:30",
    hourSlot: 14,
    title: "Siapkan Kerja Sekolah (Homework)",
    description: "Selesaikan kerja sekolah dan tugasan guru hari ini sebelum memulakan aktiviti lain.",
    linkedModule: "none",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "📚"
  },
  {
    id: "sch-wk-15",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "15:30",
    timeEnd: "16:30",
    hourSlot: 15,
    title: "Kelas Mengaji Iqra & Al-Quran",
    description: "Latihan membaca Iqra / Al-Quran, rekod perkembangan di Diari Bacaan MudahKids.",
    linkedModule: "diari",
    coinsReward: 20,
    xpReward: 35,
    categoryIcon: "📖"
  },
  {
    id: "sch-wk-16",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "16:30",
    timeEnd: "17:30",
    hourSlot: 16,
    title: "Solat Asar & Riadah Petang",
    description: "Tunaikan solat Asar, kemudian rehat atau beriadah sebentar di sekitar rumah.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-wk-17",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "17:30",
    timeEnd: "18:30",
    hourSlot: 17,
    title: "Permainan Minda Santai MudahKids",
    description: "Luangkan 30-45 minit mengasah minda dengan permainan kuiz gambar, cari kata atau silang kata.",
    linkedModule: "permainan",
    coinsReward: 15,
    xpReward: 25,
    categoryIcon: "🎮"
  },
  {
    id: "sch-wk-19",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "19:00",
    timeEnd: "20:00",
    hourSlot: 19,
    title: "Solat Maghrib & Hafazan Surah",
    description: "Solat Maghrib bersama keluarga, ulangkaji hafalan 1 surah lazim di Modul Hafazan.",
    linkedModule: "hafazan",
    coinsReward: 20,
    xpReward: 35,
    categoryIcon: "📜"
  },
  {
    id: "sch-wk-20",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "20:00",
    timeEnd: "21:00",
    hourSlot: 20,
    title: "Makan Malam & Ulangkaji Jawi Ringkas",
    description: "Makan malam bersama keluarga, buka Modul Jawi untuk latihan mengeja 5 perkataan.",
    linkedModule: "jawi",
    coinsReward: 15,
    xpReward: 25,
    categoryIcon: "✏️"
  },
  {
    id: "sch-wk-21",
    days: ["isnin", "selasa", "rabu", "khamis", "jumaat"],
    timeStart: "21:00",
    timeEnd: "22:00",
    hourSlot: 21,
    title: "Solat Isyak & Masuk Tidur Awal",
    description: "Solat Isyak, susun buku sekolah dalam beg mengikut jadual esok, baca doa tidur.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "😴"
  },

  // ===================== HARI AHAD (Hujung Minggu / Rehat & Persiapan Sekolah) =====================
  {
    id: "sch-sun-06",
    days: ["ahad"],
    timeStart: "06:00",
    timeEnd: "07:30",
    hourSlot: 6,
    title: "Solat Subuh & Gotong-royong Bilik Tidur",
    description: "Solat Subuh berjemaah, tukar cadar, basuh kasut sekolah, dan kemas almari buku.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-sun-08",
    days: ["ahad"],
    timeStart: "08:00",
    timeEnd: "10:00",
    hourSlot: 8,
    title: "Sarapan Santai & Riadah Bersama Keluarga",
    description: "Sarapan bersama sekeluarga, berjoging atau berjalan di taman rekreasi.",
    linkedModule: "none",
    coinsReward: 15,
    xpReward: 25,
    categoryIcon: "🌳"
  },
  {
    id: "sch-sun-10",
    days: ["ahad"],
    timeStart: "10:00",
    timeEnd: "11:30",
    hourSlot: 10,
    title: "Latihan Jawi & Kuiz Huruf Interaktif",
    description: "Buka Modul Jawi MudahKids: Main kuiz padanan rumi ke jawi dan dapatkan markah penuh.",
    linkedModule: "jawi",
    coinsReward: 20,
    xpReward: 40,
    categoryIcon: "✏️"
  },
  {
    id: "sch-sun-13",
    days: ["ahad"],
    timeStart: "13:00",
    timeEnd: "14:30",
    hourSlot: 13,
    title: "Solat Zohor & Makan Tengah Hari",
    description: "Solat Zohor, nikmati hidangan tengah hari dan bantu basuh perkakas dapur.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-sun-15",
    days: ["ahad"],
    timeStart: "15:00",
    timeEnd: "16:30",
    hourSlot: 15,
    title: "Cabaran Permainan Minda & Bina Dunia",
    description: "Main game asah otak di Modul Permainan dan kumpul syiling untuk bina mercu tanda Nusantara.",
    linkedModule: "permainan",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🎮"
  },
  {
    id: "sch-sun-16",
    days: ["ahad"],
    timeStart: "16:30",
    timeEnd: "17:30",
    hourSlot: 16,
    title: "Solat Asar Tepat Waktu",
    description: "Tunaikan solat Asar 4 rakaat dengan tertib dan tenang.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "🕌"
  },
  {
    id: "sch-sun-19",
    days: ["ahad"],
    timeStart: "19:00",
    timeEnd: "20:00",
    hourSlot: 19,
    title: "Solat Maghrib & Hafazan Surah Mingguan",
    description: "Solat Maghrib, ulangkaji surah lazim pilihan minggu ini bersama ibu bapa.",
    linkedModule: "hafazan",
    coinsReward: 20,
    xpReward: 35,
    categoryIcon: "📜"
  },
  {
    id: "sch-sun-20",
    days: ["ahad"],
    timeStart: "20:00",
    timeEnd: "21:30",
    hourSlot: 20,
    title: "Persiapan Sekolah Hari Isnin & Solat Isyak",
    description: "Gosok baju seragam sekolah, semak jadual buku hari Isnin, solat Isyak dan tidur tepat jam 9.30 malam.",
    linkedModule: "solat",
    coinsReward: 15,
    xpReward: 30,
    categoryIcon: "👔"
  }
];
