import { Mission, ShopItem, JawiLesson, JawiLevel, LeaderboardEntry, Achievement } from "../types";

export const DEFAULT_ISLAMIC_MISSIONS = [
  {
    title: "Solat Subuh Berjemaah",
    titleEn: "Dawn Prayer in Congregation",
    category: "Islamic" as const,
    xpReward: 50,
    coinReward: 20,
    difficulty: "Mudah" as const,
    description: "Tunaikan solat Subuh bersama keluarga di awal waktu."
  },
  {
    title: "Solat Zohor Tepat Waktu",
    titleEn: "Dhuhr Prayer On Time",
    category: "Islamic" as const,
    xpReward: 40,
    coinReward: 15,
    difficulty: "Mudah" as const,
    description: "Selesaikan solat Zohor sebaik masuk waktu."
  },
  {
    title: "Solat Asar Tepat Waktu",
    titleEn: "Asr Prayer On Time",
    category: "Islamic" as const,
    xpReward: 40,
    coinReward: 15,
    difficulty: "Mudah" as const,
    description: "Solat Asar 4 rakaat dengan khusyuk."
  },
  {
    title: "Solat Maghrib & Doa",
    titleEn: "Maghrib Prayer & Supplication",
    category: "Islamic" as const,
    xpReward: 40,
    coinReward: 15,
    difficulty: "Mudah" as const,
    description: "Solat Maghrib dan amalkan membaca doa harian selepas solat."
  },
  {
    title: "Solat Isyak & Surah Mulk",
    titleEn: "Isha Prayer & Surah Al-Mulk",
    category: "Islamic" as const,
    xpReward: 50,
    coinReward: 20,
    difficulty: "Mudah" as const,
    description: "Tunaikan solat Isyak dan dengar/baca Surah Al-Mulk sebelum tidur."
  },
  {
    title: "Baca Al-Quran / Iqra 1 Muka Surat",
    titleEn: "Read Quran / Iqra 1 Page",
    category: "Islamic" as const,
    xpReward: 45,
    coinReward: 15,
    difficulty: "Sederhana" as const,
    description: "Membaca sekurang-kurangnya 1 muka surat Iqra atau Al-Quran."
  },
  {
    title: "Hafal Surah Al-Ikhlas / Al-Falaq / An-Nas",
    titleEn: "Memorize Short Surah",
    category: "Islamic" as const,
    xpReward: 60,
    coinReward: 25,
    difficulty: "Cabar" as const,
    description: "Ulang hafalan surah 3 Qul dengan tajwid yang betul."
  },
  {
    title: "Salam & Cium Tangan Ibu Bapa",
    titleEn: "Greet & Kiss Parent's Hand",
    category: "Islamic" as const,
    xpReward: 30,
    coinReward: 10,
    difficulty: "Mudah" as const,
    description: "Bersalaman dan meminta doa keberkatan daripada ibu bapa."
  },
  {
    title: "Membaca Azkar Pagi & Petang",
    titleEn: "Morning & Evening Azkar",
    category: "Islamic" as const,
    xpReward: 35,
    coinReward: 12,
    difficulty: "Mudah" as const,
    description: "Membaca zikir mudah: Subhanallah, Alhamdulillah, Allahu Akbar (33x)."
  }
];

export const JAWI_LEVELS_DATA: JawiLevel[] = [
  {
    levelNumber: 1,
    title: "Tahap 1: Huruf Asas 1",
    titleEn: "Level 1: Basic Letters 1",
    description: "Mengenal & menulis 7 huruf tunggal asas (ا hingga ح) beserta sebutan yang betul.",
    descriptionEn: "Learn & trace 7 basic single letters (Alif to Ha) with correct pronunciation.",
    difficulty: "Mudah",
    icon: "🌱",
    lessons: [
      { id: "j1_1", letter: "ا", jawiName: "Alif", soundHint: "Bunyi 'A'", latinWord: "Ayam", jawiWord: "ايام", translation: "Chicken", imageEmoji: "🐓", audioPrompt: "Huruf Alif. Sebutan A. Contoh perkataan: Ayam." },
      { id: "j1_2", letter: "ب", jawiName: "Ba", soundHint: "Bunyi 'B'", latinWord: "Baju", jawiWord: "باجو", translation: "Shirt", imageEmoji: "👕", audioPrompt: "Huruf Ba. Sebutan B. Contoh perkataan: Baju." },
      { id: "j1_3", letter: "ت", jawiName: "Ta", soundHint: "Bunyi 'T'", latinWord: "Tali", jawiWord: "تالي", translation: "Rope", imageEmoji: "🪢", audioPrompt: "Huruf Ta. Sebutan T. Contoh perkataan: Tali." },
      { id: "j1_4", letter: "ث", jawiName: "Sa", soundHint: "Bunyi 'Th / S'", latinWord: "Thalji", jawiWord: "ثلجي", translation: "Snow", imageEmoji: "❄️", audioPrompt: "Huruf Sa. Sebutan Th. Contoh perkataan: Thalji." },
      { id: "j1_5", letter: "ج", jawiName: "Jim", soundHint: "Bunyi 'J'", latinWord: "Jam", jawiWord: "جام", translation: "Clock", imageEmoji: "⏰", audioPrompt: "Huruf Jim. Sebutan J. Contoh perkataan: Jam." },
      { id: "j1_6", letter: "چ", jawiName: "Ca", soundHint: "Bunyi 'C'", latinWord: "Cawan", jawiWord: "چاون", translation: "Cup", imageEmoji: "☕", audioPrompt: "Huruf Ca. Sebutan C. Contoh perkataan: Cawan." },
      { id: "j1_7", letter: "ح", jawiName: "Ha", soundHint: "Bunyi 'H'", latinWord: "Hakim", jawiWord: "حكيم", translation: "Judge", imageEmoji: "⚖️", audioPrompt: "Huruf Ha. Sebutan H. Contoh perkataan: Hakim." }
    ],
    quizQuestions: [
      {
        id: "q1_1",
        questionText: "Apakah nama dan sebutan huruf 'ب'?",
        questionTextEn: "What is the name and sound of letter 'ب'?",
        jawiDisplay: "ب",
        audioPrompt: "Apakah nama dan sebutan huruf ini?",
        options: ["Ba (Bunyi B)", "Ta (Bunyi T)", "Alif (Bunyi A)", "Jim (Bunyi J)"],
        correctAnswer: "Ba (Bunyi B)"
      },
      {
        id: "q1_2",
        questionText: "Manakah huruf Jawi Khas bagi perkataan 'Cawan'?",
        questionTextEn: "Which Jawi letter represents 'C' in 'Cawan'?",
        jawiDisplay: "چ",
        audioPrompt: "Pilih huruf Ca.",
        options: ["Ca (چ)", "Jim (ج)", "Ha (ح)", "Ba (ب)"],
        correctAnswer: "Ca (چ)"
      },
      {
        id: "q1_3",
        questionText: "Apakah perkataan contoh bagi huruf 'ا' (Alif)?",
        questionTextEn: "Which word starts with letter Alif?",
        jawiDisplay: "ا",
        audioPrompt: "Contoh perkataan huruf Alif.",
        options: ["Ayam (ايام)", "Baju (باجو)", "Jam (جام)", "Tali (تالي)"],
        correctAnswer: "Ayam (ايام)"
      }
    ]
  },
  {
    levelNumber: 2,
    title: "Tahap 2: Huruf Asas 2",
    titleEn: "Level 2: Basic Letters 2",
    description: "Mengenal huruf Kha hingga Syin (خ, د, ذ, ر, ز, س, ش).",
    descriptionEn: "Learn letters Kha to Syin.",
    difficulty: "Mudah",
    icon: "🌿",
    lessons: [
      { id: "j2_1", letter: "خ", jawiName: "Kha", soundHint: "Bunyi 'Kh'", latinWord: "Khemah", jawiWord: "خيمة", translation: "Tent", imageEmoji: "⛺", audioPrompt: "Huruf Kha. Sebutan Kh. Contoh: Khemah." },
      { id: "j2_2", letter: "د", jawiName: "Dal", soundHint: "Bunyi 'D'", latinWord: "Dadu", jawiWord: "دادو", translation: "Dice", imageEmoji: "🎲", audioPrompt: "Huruf Dal. Sebutan D. Contoh: Dadu." },
      { id: "j2_3", letter: "ذ", jawiName: "Dzal", soundHint: "Bunyi 'Dz'", latinWord: "Zikir", jawiWord: "ذكر", translation: "Dhikr", imageEmoji: "📿", audioPrompt: "Huruf Dzal. Sebutan Dz. Contoh: Zikir." },
      { id: "j2_4", letter: "ر", jawiName: "Ra", soundHint: "Bunyi 'R'", latinWord: "Roda", jawiWord: "رودا", translation: "Wheel", imageEmoji: "🛞", audioPrompt: "Huruf Ra. Sebutan R. Contoh: Roda." },
      { id: "j2_5", letter: "ز", jawiName: "Zai", soundHint: "Bunyi 'Z'", latinWord: "Zirafah", jawiWord: "زيرافه", translation: "Giraffe", imageEmoji: "🦒", audioPrompt: "Huruf Zai. Sebutan Z. Contoh: Zirafah." },
      { id: "j2_6", letter: "س", jawiName: "Sin", soundHint: "Bunyi 'S'", latinWord: "Susu", jawiWord: "سوسو", translation: "Milk", imageEmoji: "🥛", audioPrompt: "Huruf Sin. Sebutan S. Contoh: Susu." },
      { id: "j2_7", letter: "ش", jawiName: "Syin", soundHint: "Bunyi 'Sy'", latinWord: "Syampu", jawiWord: "شامڤو", translation: "Shampoo", imageEmoji: "🧴", audioPrompt: "Huruf Syin. Sebutan Sy. Contoh: Syampu." }
    ],
    quizQuestions: [
      {
        id: "q2_1",
        questionText: "Apakah nama huruf 'د'?",
        jawiDisplay: "د",
        audioPrompt: "Apakah nama huruf ini?",
        options: ["Dal", "Dzal", "Ra", "Zai"],
        correctAnswer: "Dal"
      },
      {
        id: "q2_2",
        questionText: "Huruf 'س' digunakan untuk mengeja perkataan apa?",
        jawiDisplay: "س",
        audioPrompt: "Perkataan huruf Sin.",
        options: ["Susu (سوسو)", "Roda (رودا)", "Dadu (دادو)", "Syampu (شامڤو)"],
        correctAnswer: "Susu (سوسو)"
      },
      {
        id: "q2_3",
        questionText: "Apakah sebutan bagi huruf 'ش' (Syin)?",
        jawiDisplay: "ش",
        audioPrompt: "Sebutan huruf Syin.",
        options: ["Bunyi 'Sy' (Sh)", "Bunyi 'S'", "Bunyi 'Z'", "Bunyi 'R'"],
        correctAnswer: "Bunyi 'Sy' (Sh)"
      }
    ]
  },
  {
    levelNumber: 3,
    title: "Tahap 3: Huruf Khas Jawi Nusantara",
    titleEn: "Level 3: Custom Jawi Letters",
    description: "Mengenal huruf khas Jawi: Nga (ڠ), Pa (ڤ), Ga (ݢ) & huruf Sad, Dad, Ta, Za, Fa.",
    descriptionEn: "Learn unique Jawi letters: Nga, Pa, Ga and others.",
    difficulty: "Sederhana",
    icon: "🌟",
    lessons: [
      { id: "j3_1", letter: "ص", jawiName: "Sad", soundHint: "Bunyi 'S'", latinWord: "Solat", jawiWord: "صلاة", translation: "Prayer", imageEmoji: "🕌", audioPrompt: "Huruf Sad. Sebutan S. Contoh: Solat." },
      { id: "j3_2", letter: "ض", jawiName: "Dad", soundHint: "Bunyi 'Dh'", latinWord: "Darab", jawiWord: "ضرب", translation: "Multiply", imageEmoji: "✖️", audioPrompt: "Huruf Dad. Sebutan Dh. Contoh: Darab." },
      { id: "j3_3", letter: "ط", jawiName: "Ta", soundHint: "Bunyi 'T'", latinWord: "Tabib", jawiWord: "طبيب", translation: "Doctor", imageEmoji: "🩺", audioPrompt: "Huruf Ta. Sebutan T. Contoh: Tabib." },
      { id: "j3_4", letter: "ظ", jawiName: "Za", soundHint: "Bunyi 'Z'", latinWord: "Zalim", jawiWord: "ظالم", translation: "Unfair", imageEmoji: "🚫", audioPrompt: "Huruf Za. Sebutan Z. Contoh: Zalim." },
      { id: "j3_5", letter: "ڠ", jawiName: "Nga", soundHint: "Bunyi 'Ng'", latinWord: "Nganga", jawiWord: "ڠاڠا", translation: "Open Mouth", imageEmoji: "😮", audioPrompt: "Huruf Nga. Sebutan Ng. Contoh: Nganga." },
      { id: "j3_6", letter: "ف", jawiName: "Fa", soundHint: "Bunyi 'F'", latinWord: "Fikir", jawiWord: "فيكير", translation: "Think", imageEmoji: "💡", audioPrompt: "Huruf Fa. Sebutan F. Contoh: Fikir." },
      { id: "j3_7", letter: "ڤ", jawiName: "Pa", soundHint: "Bunyi 'P'", latinWord: "Pokok", jawiWord: "ڤوكوق", translation: "Tree", imageEmoji: "🌳", audioPrompt: "Huruf Pa. Sebutan P. Contoh: Pokok." },
      { id: "j3_8", letter: "ݢ", jawiName: "Ga", soundHint: "Bunyi 'G'", latinWord: "Gajah", jawiWord: "ݢاجه", translation: "Elephant", imageEmoji: "🐘", audioPrompt: "Huruf Ga. Sebutan G. Contoh: Gajah." }
    ],
    quizQuestions: [
      {
        id: "q3_1",
        questionText: "Apakah huruf khas Jawi dengan 3 titik di atas untuk sebutan 'P'?",
        jawiDisplay: "ڤ",
        audioPrompt: "Pilih nama huruf ini.",
        options: ["Pa (ڤ)", "Fa (ف)", "Ga (ݢ)", "Nga (ڠ)"],
        correctAnswer: "Pa (ڤ)"
      },
      {
        id: "q3_2",
        questionText: "Apakah huruf khas Jawi bagi bunyi 'G' (Contoh: Gajah)?",
        jawiDisplay: "ݢ",
        audioPrompt: "Huruf apakah ini?",
        options: ["Ga (ݢ)", "Kaf (ك)", "Nga (ڠ)", "Pa (ڤ)"],
        correctAnswer: "Ga (ݢ)"
      },
      {
        id: "q3_3",
        questionText: "Huruf 'ڠ' (Nga) mempunyai berapa titik di atas?",
        jawiDisplay: "ڠ",
        audioPrompt: "Soalan huruf Nga.",
        options: ["3 Titik", "1 Titik", "2 Titik", "Tiada Titik"],
        correctAnswer: "3 Titik"
      }
    ]
  },
  {
    levelNumber: 4,
    title: "Tahap 4: Huruf Vokal & Akhir",
    titleEn: "Level 4: Vowels & Final Letters",
    description: "Mengenal Lam, Mim, Nun, Wau, Va (ۏ), Ha, Hamzah, Ya & Nya (ڽ).",
    descriptionEn: "Master Lam to Nya including Va & Nya.",
    difficulty: "Sederhana",
    icon: "🔥",
    lessons: [
      { id: "j4_1", letter: "ل", jawiName: "Lam", soundHint: "Bunyi 'L'", latinWord: "Lembu", jawiWord: "لمبو", translation: "Cow", imageEmoji: "🐄", audioPrompt: "Huruf Lam. Sebutan L. Contoh: Lembu." },
      { id: "j4_2", letter: "م", jawiName: "Mim", soundHint: "Bunyi 'M'", latinWord: "Meja", jawiWord: "ميجا", translation: "Table", imageEmoji: "🪑", audioPrompt: "Huruf Mim. Sebutan M. Contoh: Meja." },
      { id: "j4_3", letter: "ن", jawiName: "Nun", soundHint: "Bunyi 'N'", latinWord: "Nasi", jawiWord: "ناسي", translation: "Rice", imageEmoji: "🍚", audioPrompt: "Huruf Nun. Sebutan N. Contoh: Nasi." },
      { id: "j4_4", letter: "و", jawiName: "Wau", soundHint: "Bunyi 'W / U / O'", latinWord: "Wau", jawiWord: "واو", translation: "Kite", imageEmoji: "🪁", audioPrompt: "Huruf Wau. Sebutan W. Contoh: Wau." },
      { id: "j4_5", letter: "ۏ", jawiName: "Va", soundHint: "Bunyi 'V'", latinWord: "Van", jawiWord: "ۏن", translation: "Van", imageEmoji: "🚐", audioPrompt: "Huruf Va. Sebutan V. Contoh: Van." },
      { id: "j4_6", letter: "ه", jawiName: "Ha", soundHint: "Bunyi 'H'", latinWord: "Harimau", jawiWord: "هريماو", translation: "Tiger", imageEmoji: "🐅", audioPrompt: "Huruf Ha. Sebutan H. Contoh: Harimau." },
      { id: "j4_7", letter: "ء", jawiName: "Hamzah", soundHint: "Hentian Glotal", latinWord: "Air", jawiWord: "اءير", translation: "Water", imageEmoji: "💧", audioPrompt: "Huruf Hamzah. Contoh: Air." },
      { id: "j4_8", letter: "ي", jawiName: "Ya", soundHint: "Bunyi 'Y / I / E'", latinWord: "Yoyo", jawiWord: "يويو", translation: "Yoyo", imageEmoji: "🪀", audioPrompt: "Huruf Ya. Sebutan Y. Contoh: Yoyo." },
      { id: "j4_9", letter: "ڽ", jawiName: "Nya", soundHint: "Bunyi 'Ny'", latinWord: "Nyamuk", jawiWord: "ڽاموق", translation: "Mosquito", imageEmoji: "🦟", audioPrompt: "Huruf Nya. Sebutan Ny. Contoh: Nyamuk." }
    ],
    quizQuestions: [
      {
        id: "q4_1",
        questionText: "Apakah nama huruf khas 'ۏ' (dengan titik di atas Wau)?",
        jawiDisplay: "ۏ",
        audioPrompt: "Apakah nama huruf ini?",
        options: ["Va (Bunyi V)", "Wau (Bunyi W)", "Fa (Bunyi F)", "Pa (Bunyi P)"],
        correctAnswer: "Va (Bunyi V)"
      },
      {
        id: "q4_2",
        questionText: "Huruf Jawi khas apakah yang digunakan untuk sebutan 'NY' (Nyamuk)?",
        jawiDisplay: "ڽ",
        audioPrompt: "Pilih huruf Nya.",
        options: ["Nya (ڽ)", "Nun (ن)", "Nga (ڠ)", "Ya (ي)"],
        correctAnswer: "Nya (ڽ)"
      },
      {
        id: "q4_3",
        questionText: "Manakah contoh perkataan yang mengandungi huruf 'و' (Wau)?",
        jawiDisplay: "و",
        audioPrompt: "Perkataan huruf Wau.",
        options: ["Wau (واو)", "Nasi (ناسي)", "Meja (ميجا)", "Harimau (هريماو)"],
        correctAnswer: "Wau (واو)"
      }
    ]
  },
  {
    levelNumber: 5,
    title: "Tahap 5: Suku Kata Terbuka Jawi",
    titleEn: "Level 5: Open Syllables",
    description: "Gabungan Konsonan + Vokal Jawi (ا, و, ي) seperti Ba, Bu, Bi, Ca, Pu, Gi, Na.",
    descriptionEn: "Combine Consonant + Vowel in Jawi.",
    difficulty: "Sederhana",
    icon: "🧩",
    lessons: [
      { id: "j5_1", letter: "با", jawiName: "Ba + Alif", soundHint: "B + A = BA", latinWord: "Bapa", jawiWord: "باڤ", translation: "Father", imageEmoji: "👨", audioPrompt: "Suku kata Ba. B A Ba." },
      { id: "j5_2", letter: "بو", jawiName: "Ba + Wau", soundHint: "B + U = BU", latinWord: "Buku", jawiWord: "بوكو", translation: "Book", imageEmoji: "📖", audioPrompt: "Suku kata Bu. B U Bu." },
      { id: "j5_3", letter: "بي", jawiName: "Ba + Ya", soundHint: "B + I = BI", latinWord: "Biru", jawiWord: "بيرو", translation: "Blue", imageEmoji: "💙", audioPrompt: "Suku kata Bi. B I Bi." },
      { id: "j5_4", letter: "چا", jawiName: "Ca + Alif", soundHint: "C + A = CA", latinWord: "Cawan", jawiWord: "چاون", translation: "Cup", imageEmoji: "☕", audioPrompt: "Suku kata Ca. C A Ca." },
      { id: "j5_5", letter: "ڤو", jawiName: "Pa + Wau", soundHint: "P + U = PU / PO", latinWord: "Pokok", jawiWord: "ڤوكوق", translation: "Tree", imageEmoji: "🌳", audioPrompt: "Suku kata Pu atau Po." },
      { id: "j5_6", letter: "ݢي", jawiName: "Ga + Ya", soundHint: "G + I = GI", latinWord: "Gigi", jawiWord: "ݢيݢي", translation: "Teeth", imageEmoji: "🦷", audioPrompt: "Suku kata Gi. G I Gi." }
    ],
    quizQuestions: [
      {
        id: "q5_1",
        questionText: "Apakah sebutan bagi gabungan 'ب' + 'و'?",
        jawiDisplay: "بو",
        audioPrompt: "Bunyi suku kata ini.",
        options: ["BU / BO", "BA", "BI", "BE"],
        correctAnswer: "BU / BO"
      },
      {
        id: "q5_2",
        questionText: "Bagaimanakah mengeja suku kata 'GI' dalam Jawi?",
        jawiDisplay: "ݢي",
        audioPrompt: "Suku kata Gi.",
        options: ["ݢي (Ga + Ya)", "ݢا (Ga + Alif)", "ݢو (Ga + Wau)", "كي (Kaf + Ya)"],
        correctAnswer: "ݢي (Ga + Ya)"
      },
      {
        id: "q5_3",
        questionText: "Gabungan 'چ' + 'ا' membentuk bunyi apa?",
        jawiDisplay: "چا",
        audioPrompt: "Bunyi Ca.",
        options: ["CA", "CU", "CI", "CO"],
        correctAnswer: "CA"
      }
    ]
  },
  {
    levelNumber: 6,
    title: "Tahap 6: Pembinaan Perkataan Jawi",
    titleEn: "Level 6: Word Building",
    description: "Menyusun dan membaca perkataan Jawi lengkap (Baju, Buku, Nasi, Bola, Gajah, Pokok).",
    descriptionEn: "Build & read full Jawi words.",
    difficulty: "Cabar",
    icon: "🏆",
    lessons: [
      { id: "j6_1", letter: "باجو", jawiName: "BAJU", soundHint: "BA + JU", latinWord: "BAJU", jawiWord: "باجو", translation: "Shirt", imageEmoji: "👕", audioPrompt: "Perkataan Baju. Ba Jo Baju." },
      { id: "j6_2", letter: "بوكو", jawiName: "BUKU", soundHint: "BU + KU", latinWord: "BUKU", jawiWord: "بوكو", translation: "Book", imageEmoji: "📖", audioPrompt: "Perkataan Buku. Bu Ku Buku." },
      { id: "j6_3", letter: "ناسي", jawiName: "NASI", soundHint: "NA + SI", latinWord: "NASI", jawiWord: "ناسي", translation: "Rice", imageEmoji: "🍚", audioPrompt: "Perkataan Nasi. Na Si Nasi." },
      { id: "j6_4", letter: "بولا", jawiName: "BOLA", soundHint: "BO + LA", latinWord: "BOLA", jawiWord: "بولا", translation: "Ball", imageEmoji: "⚽", audioPrompt: "Perkataan Bola. Bo La Bola." },
      { id: "j6_5", letter: "ݢاجه", jawiName: "GAJAH", soundHint: "GA + JAH", latinWord: "GAJAH", jawiWord: "ݢاجه", translation: "Elephant", imageEmoji: "🐘", audioPrompt: "Perkataan Gajah. Ga Jah Gajah." },
      { id: "j6_6", letter: "ڤوكوق", jawiName: "POKOK", soundHint: "PO + KOK", latinWord: "POKOK", jawiWord: "ڤوكوق", translation: "Tree", imageEmoji: "🌳", audioPrompt: "Perkataan Pokok. Po Kok Pokok." }
    ],
    quizQuestions: [
      {
        id: "q6_1",
        questionText: "Apakah ejaan Jawi yang betul bagi perkataan 'BAJU'?",
        jawiDisplay: "باجو",
        audioPrompt: "Ejaan Baju.",
        options: ["باجو (BAJU)", "بوكو (BUKU)", "ناسي (NASI)", "بولا (BOLA)"],
        correctAnswer: "باجو (BAJU)"
      },
      {
        id: "q6_2",
        questionText: "Apakah maksud perkataan Jawi 'ناسي'?",
        jawiDisplay: "ناسي",
        audioPrompt: "Maksud perkataan Nasi.",
        options: ["Nasi", "Buku", "Baju", "Gajah"],
        correctAnswer: "Nasi"
      },
      {
        id: "q6_3",
        questionText: "Perkataan 'ݢاجه' bermula dengan huruf khas apakah?",
        jawiDisplay: "ݢاجه",
        audioPrompt: "Perkataan Gajah.",
        options: ["Ga (ݢ)", "Pa (ڤ)", "Nga (ڠ)", "Ca (چ)"],
        correctAnswer: "Ga (ݢ)"
      }
    ]
  },
  {
    levelNumber: 7,
    title: "Tahap 7: Bacaan & Kisah Pendek Jawi",
    titleEn: "Level 7: Short Stories & Sentences",
    description: "Membaca ayat dan kisah pendek Jawi dengan sebutan lancar dan pemahaman.",
    descriptionEn: "Read short Jawi sentences and stories with fluency.",
    difficulty: "Cabar",
    icon: "👑",
    lessons: [
      { id: "j7_1", letter: "سيا سوک بلاجر جاوي", jawiName: "Ayat 1", soundHint: "Saya suka belajar Jawi", latinWord: "Saya suka belajar Jawi", jawiWord: "سيا سوک بلاجر جاوي", translation: "I like learning Jawi", imageEmoji: "📚", audioPrompt: "Saya suka belajar Jawi." },
      { id: "j7_2", letter: "اييبو مماسق ناسي", jawiName: "Ayat 2", soundHint: "Ibu memasak nasi", latinWord: "Ibu memasak nasi", jawiWord: "اييبو مماسق ناسي", translation: "Mother cooks rice", imageEmoji: "🍲", audioPrompt: "Ibu memasak nasi." },
      { id: "j7_3", letter: "اياه ممبلي بوكو", jawiName: "Ayat 3", soundHint: "Ayah membeli buku", latinWord: "Ayah membeli buku", jawiWord: "اياه ممبلي بوكو", translation: "Father buys a book", imageEmoji: "📖", audioPrompt: "Ayah membeli buku." }
    ],
    quizQuestions: [
      {
        id: "q7_1",
        questionText: "Apakah bacaan rumi bagi ayat: 'سيا سوک بلاجر جاوي'?",
        jawiDisplay: "سيا سوک بلاجر جاوي",
        audioPrompt: "Bacaan ayat ini.",
        options: ["Saya suka belajar Jawi", "Saya suka membaca buku", "Ibu memasak nasi di dapur", "Ayah pergi ke masjid"],
        correctAnswer: "Saya suka belajar Jawi"
      },
      {
        id: "q7_2",
        questionText: "Apakah maksud ayat: 'اييبو مماسق ناسي'?",
        jawiDisplay: "اييبو مماسق ناسي",
        audioPrompt: "Maksud ayat ini.",
        options: ["Ibu memasak nasi", "Ayah membeli buku", "Adik bermain bola", "Kakak menyiram pokok"],
        correctAnswer: "Ibu memasak nasi"
      }
    ]
  }
];

export const DEFAULT_JAWI_LESSONS: JawiLesson[] = JAWI_LEVELS_DATA[0].lessons;

export const DEFAULT_CHORES = [
  {
    title: "Kemas Katil & Selimut",
    titleEn: "Make Bed & Fold Blanket",
    category: "Chores" as const,
    xpReward: 25,
    coinReward: 10,
    difficulty: "Mudah" as const,
    description: "Rapikan bantal dan lipat selimut selepas bangun tidur."
  },
  {
    title: "Gosok Gigi & Basuh Muka",
    titleEn: "Brush Teeth & Wash Face",
    category: "Chores" as const,
    xpReward: 20,
    coinReward: 8,
    difficulty: "Mudah" as const,
    description: "Jaga kebersihan diri setiap pagi dan sebelum tidur."
  },
  {
    title: "Kemas Mainan Selepas Main",
    titleEn: "Clean Toys After Play",
    category: "Chores" as const,
    xpReward: 30,
    coinReward: 12,
    difficulty: "Mudah" as const,
    description: "Simpan semua mainan ke dalam bakul mainan."
  },
  {
    title: "Siram Pokok Bunga",
    titleEn: "Water Plants",
    category: "Chores" as const,
    xpReward: 25,
    coinReward: 10,
    difficulty: "Mudah" as const,
    description: "Bantu ibu menyiram pokok di halaman rumah."
  },
  {
    title: "Beri Kucing Makan",
    titleEn: "Feed Pet Cat",
    category: "Chores" as const,
    xpReward: 25,
    coinReward: 10,
    difficulty: "Mudah" as const,
    description: "Isi makanan dan air bersih untuk haiwan peliharaan."
  },
  {
    title: "Basuh Pinggan Sendiri",
    titleEn: "Wash Own Plate",
    category: "Chores" as const,
    xpReward: 35,
    coinReward: 15,
    difficulty: "Sederhana" as const,
    description: "Bersihkan pinggan dan cawan selepas makan."
  },
  {
    title: "Siapkan Kerja Sekolah (Homework)",
    titleEn: "Complete Homework",
    category: "Chores" as const,
    xpReward: 50,
    coinReward: 20,
    difficulty: "Sederhana" as const,
    description: "Selesaikan latihan tugasan sekolah sebelum bermain."
  },
  {
    title: "Susun Buku & Buka Beg Sekolah",
    titleEn: "Organise Books & School Bag",
    category: "Chores" as const,
    xpReward: 30,
    coinReward: 12,
    difficulty: "Mudah" as const,
    description: "Susun jadual waktu buku sekolah untuk esok."
  }
];

export const NUSANTARA_WORLDS = [
  { id: "kampung", name: "Kampung Melayu", nameEn: "Malay Village", unlockCost: 0, icon: "🏡", description: "Perkampungan indah berlatarkan rumah panggung dan sawah padi." },
  { id: "masjid", name: "Masjid Serene", nameEn: "Grand Mosque", unlockCost: 50, icon: "🕌", description: "Pusat ibadah dan keharmonian komuniti Nusantara." },
  { id: "sekolah", name: "Sekolah Agama", nameEn: "Religious School", unlockCost: 100, icon: "🏫", description: "Tempat menuntut ilmu Al-Quran dan bahasa Jawi." },
  { id: "perpustakaan", name: "Perpustakaan Hikmah", nameEn: "Hikmah Library", unlockCost: 150, icon: "📚", description: "Gedung buku dan kisah dongeng teladan." },
  { id: "sungai", name: "Sungai Jernih", nameEn: "Clear River", unlockCost: 200, icon: "🌊", description: "Sungai semula jadi dengan rakit dan pokok kelapa." },
  { id: "ladang", name: "Ladang Buah-Buahan", nameEn: "Fruit Farm", unlockCost: 250, icon: "🍉", description: "Ladang durian, rambutan dan pisang yang subur." },
  { id: "pasar", name: "Pasar Malam", nameEn: "Night Market", unlockCost: 300, icon: "🏪", description: "Pasar meriah menjual kuih-muih tradisional." },
  { id: "istana", name: "Istana Kesultanan", nameEn: "Sultanate Castle", unlockCost: 500, icon: "🏰", description: "Istana megah warisan kesultanan Melayu." },
  { id: "gunung", name: "Gunung Kinabalu", nameEn: "Kinabalu Mountain", unlockCost: 600, icon: "⛰️", description: "Puncak tertinggi penuh keajaiban alam." },
  { id: "hutan", name: "Hutan Hujan Tropika", nameEn: "Rainforest", unlockCost: 700, icon: "🌳", description: "Hutan simpan perlindungan haiwan peliharaan." },
  { id: "pulau", name: "Pulau Perhentian", nameEn: "Perhentian Island", unlockCost: 800, icon: "🏝️", description: "Pulau persisiran pantai pasir putih yang indah." },
  { id: "pelabuhan", name: "Pelabuhan Melaka", nameEn: "Melaka Harbour", unlockCost: 900, icon: "⛵", description: "Pelabuhan dagang penuh kapal layar kuno." },
  { id: "muzium", name: "Muzium Warisan", nameEn: "Heritage Museum", unlockCost: 1000, icon: "🏛️", description: "Muzium khazanah artifak dan sejarah Nusantara." },
  { id: "zoo", name: "Zoo Negara Safari", nameEn: "Safari Zoo", unlockCost: 1200, icon: "🐘", description: "Taman perlindungan fauna unik Nusantara." },
  { id: "space", name: "Balai Cerap Angkasa", nameEn: "Space Observatory", unlockCost: 1500, icon: "🔭", description: "Balai cerap pencerapan bulan dan bintang-bintang." }
];

export const SHOP_ITEMS: ShopItem[] = [
  // Pets (Haiwan Peliharaan)
  { id: "s1", name: "Kucing Comel Bersongkok", nameEn: "Cute Cat with Songkok", category: "pet", price: 50, currency: "coins", image: "🐱", unlockedLevel: 1 },
  { id: "s2", name: "Arnab Cilik Berpita", nameEn: "Little Bunny with Ribbon", category: "pet", price: 75, currency: "coins", image: "🐰", unlockedLevel: 2 },
  { id: "s3", name: "Unta Padang Pasir", nameEn: "Desert Camel", category: "pet", price: 100, currency: "coins", image: "🐪", unlockedLevel: 2 },
  { id: "s4", name: "Helang Raja Nusantara", nameEn: "Royal Falcon", category: "pet", price: 150, currency: "coins", image: "🦅", unlockedLevel: 3 },
  { id: "s5", name: "Kura-Kura Cilik", nameEn: "Little Turtle", category: "pet", price: 120, currency: "coins", image: "🐢", unlockedLevel: 3 },
  { id: "s6", name: "Burung Kakak Tua", nameEn: "Parrot Companion", category: "pet", price: 180, currency: "coins", image: "🦜", unlockedLevel: 4 },

  // Avatars (Gambar Watak Anak)
  { id: "s7", name: "Avatar Budak Lelaki Bersongkok", nameEn: "Boy Avatar with Songkok", category: "avatar", price: 100, currency: "coins", image: "👦🏻", unlockedLevel: 1 },
  { id: "s8", name: "Avatar Budak Perempuan Berhijab", nameEn: "Girl Avatar with Hijab", category: "avatar", price: 100, currency: "coins", image: "👧🏽", unlockedLevel: 1 },
  { id: "s9", name: "Avatar Putera Nusantara", nameEn: "Nusantara Prince Avatar", category: "avatar", price: 200, currency: "coins", image: "🤴🏻", unlockedLevel: 3 },
  { id: "s10", name: "Avatar Puteri Melayu", nameEn: "Malay Princess Avatar", category: "avatar", price: 200, currency: "coins", image: "👸🏽", unlockedLevel: 3 },
  { id: "s11", name: "Avatar Pahlawan Tengkolok", nameEn: "Warrior Avatar", category: "avatar", price: 250, currency: "coins", image: "🧑🏽‍🌾", unlockedLevel: 4 },

  // World Decorations (Hiasan Dunia)
  { id: "s12", name: "Pelita Panjut Hari Raya", nameEn: "Oil Lamp Panjut", category: "decoration", price: 30, currency: "coins", image: "🪔", unlockedLevel: 1 },
  { id: "s13", name: "Air Pancut Taman", nameEn: "Garden Fountain", category: "decoration", price: 80, currency: "coins", image: "⛲", unlockedLevel: 2 },
  { id: "s14", name: "Pokok Kelapa Sawah", nameEn: "Coconut Tree", category: "decoration", price: 40, currency: "coins", image: "🌴", unlockedLevel: 1 },
  { id: "s15", name: "Pondok Wakaf", nameEn: "Wakaf Gazebo", category: "furniture", price: 120, currency: "coins", image: "🛖", unlockedLevel: 3 },

  // Titles (Gelaran Eksklusif)
  { id: "s16", name: "Gelaran: Wira Keharmonian", nameEn: "Title: Hero of Harmony", category: "title", price: 300, currency: "coins", image: "🏅", unlockedLevel: 4 },
  { id: "s17", name: "Gelaran: Pakar Jawi Cilik", nameEn: "Title: Jawi Master", category: "title", price: 350, currency: "coins", image: "⭐", unlockedLevel: 5 }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: "lb1", name: "Umar Al-Farooq", avatarEmoji: "👦🏻", xp: 1250, coins: 480, streak: 12, category: "family" },
  { id: "lb2", name: "Aisyah Humaira", avatarEmoji: "👧🏽", xp: 1100, coins: 390, streak: 9, category: "family" },
  { id: "lb3", name: "Maryam Jameelah", avatarEmoji: "👧🏻", xp: 850, coins: 260, streak: 5, category: "family" },
  { id: "lb4", name: "Ahmad Zaki", avatarEmoji: "👦🏽", xp: 1400, coins: 520, streak: 15, category: "school" },
  { id: "lb5", name: "Nur Fatima", avatarEmoji: "👧🏼", xp: 980, coins: 310, streak: 7, category: "school" },
  { id: "lb6", name: "Adam Harith", avatarEmoji: "👦🏼", xp: 910, coins: 280, streak: 6, category: "friends" }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "ac1", title: "Disiplin 7 Hari", titleEn: "7 Day Streak", description: "Selesaikan sekurang-kurangnya 1 misi setiap hari selama 7 hari berturut-turut.", icon: "🔥", unlocked: true, progress: 7, maxProgress: 7, rewardCoins: 100 },
  { id: "ac2", title: "Wira Solat 100 Waktu", titleEn: "100 Prayers Hero", description: "Laksanakan 100 kali solat fardu tepat pada waktunya.", icon: "🕌", unlocked: false, progress: 34, maxProgress: 100, rewardCoins: 250 },
  { id: "ac3", title: "Pakar Jawi Cilik", titleEn: "Jawi Master", description: "Selesaikan 30 latihan mengeja dan menulis huruf Jawi.", icon: "✏️", unlocked: false, progress: 12, maxProgress: 30, rewardCoins: 200 },
  { id: "ac4", title: "Pembantu Ibu Bapa", titleEn: "Helping Hands", description: "Selesaikan 50 tugasan rumah dengan kelulusan ibu bapa.", icon: "🌟", unlocked: false, progress: 18, maxProgress: 50, rewardCoins: 200 },
  { id: "ac5", title: "Pengumpul Syiling 1000", titleEn: "1000 Coins Master", description: "Kumpul sebanyak 1,000 syiling daripada tugasan & ganjaran harian.", icon: "🪙", unlocked: false, progress: 480, maxProgress: 1000, rewardCoins: 300 }
];
