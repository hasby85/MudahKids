import { JakimNote } from "../types";

export const INITIAL_JAKIM_NOTES: JakimNote[] = [
  // 1. BACAAN SOLAT LENGKAP
  {
    id: "jn-bacaan-1",
    category: "bacaan_solat",
    genderTarget: "all",
    title: "Lafaz Niat Solat 5 Waktu (Bahasa Al-Quran)",
    explanation: "Lafaz niat dalam bahasa Arab berserta Rumi dan maksud bagi Solat Subuh, Zohor, Asar, Maghrib, dan Isyak.",
    steps: [
      {
        stepNumber: 1,
        title: "Solat Subuh (2 Rakaat)",
        detail: "Niat solat Subuh tunai.",
        arabicText: "أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ أَدَاءً لِلَّهِ تَعَالَى",
        latinText: "Usolli fardhas-Subhi rak'ataini adaa'an lillahi Ta'ala.",
        translation: "Sahaja aku solat fardhu Subuh dua rakaat tunai kerana Allah Ta'ala.",
        illustrationEmoji: "🌅"
      },
      {
        stepNumber: 2,
        title: "Solat Zohor (4 Rakaat)",
        detail: "Niat solat Zohor tunai.",
        arabicText: "أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        latinText: "Usolli fardhaz-Zuhri arba'a rak'aatain adaa'an lillahi Ta'ala.",
        translation: "Sahaja aku solat fardhu Zohor empat rakaat tunai kerana Allah Ta'ala.",
        illustrationEmoji: "☀️"
      },
      {
        stepNumber: 3,
        title: "Solat Asar (4 Rakaat)",
        detail: "Niat solat Asar tunai.",
        arabicText: "أُصَلِّي فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        latinText: "Usolli fardhal-'Asri arba'a rak'aatain adaa'an lillahi Ta'ala.",
        translation: "Sahaja aku solat fardhu Asar empat rakaat tunai kerana Allah Ta'ala.",
        illustrationEmoji: "🌤️"
      },
      {
        stepNumber: 4,
        title: "Solat Maghrib (3 Rakaat)",
        detail: "Niat solat Maghrib tunai.",
        arabicText: "أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلاَثَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        latinText: "Usolli fardhal-Maghribi thalatha rak'aatain adaa'an lillahi Ta'ala.",
        translation: "Sahaja aku solat fardhu Maghrib tiga rakaat tunai kerana Allah Ta'ala.",
        illustrationEmoji: "🌆"
      },
      {
        stepNumber: 5,
        title: "Solat Isyak (4 Rakaat)",
        detail: "Niat solat Isyak tunai.",
        arabicText: "أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        latinText: "Usolli fardhal-'Isya'i arba'a rak'aatain adaa'an lillahi Ta'ala.",
        translation: "Sahaja aku solat fardhu Isyak empat rakaat tunai kerana Allah Ta'ala.",
        illustrationEmoji: "🌙"
      }
    ],
    translation: "Niat dihadirkan di dalam hati serentak dengan Takbiratul Ihram."
  },
  {
    id: "jn-bacaan-2",
    category: "bacaan_solat",
    genderTarget: "all",
    title: "Takbiratul Ihram & Doa Iftitah",
    explanation: "Bacaan takbir pembuka solat dan Doa Iftitah selepas Takbiratul Ihram.",
    arabicText: "اللهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللهِ بُكْرَةً وَأَصِيلاً. وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ. إِنَّ صَلاَتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ. لاَ شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُشْرِكِينَ.",
    latinText: "Allahu Akbar Kabiira, walhamdu lillahi kathira, wa Subhanallahi bukrataan wa asila. Wajjahtu wajhiya lilladhi fataras-samawati wal-arda hanifan musliman wa ma ana minal-mushrikin. Inna salati wa nusuki wa mahyaya wa mamati lillahi Rabbil-'alamin. La sharika lahu wa bidhalika umirtu wa ana minal-muslimin.",
    translation: "Allah Maha Besar, segala puji bagi Allah. Maha Suci Allah pagi dan petang. Aku hadapkan mukaku kepada Tuhan yang menciptakan langit dan bumi dengan lurus dan berserah diri..."
  },
  {
    id: "jn-bacaan-3",
    category: "bacaan_solat",
    genderTarget: "all",
    title: "Surah Al-Fatihah (Rukun Solat)",
    explanation: "Surah wajib dibaca pada setiap rakaat solat dengan tajwid yang betul.",
    arabicText: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلاَ الضَّالِّينَ ۝",
    latinText: "Bismillahirrahmanirrahiim. Alhamdu lillahi Rabbil-'alamin. Ar-Rahmanir-Rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-ladhina an'amta 'alayhim ghayril-maghdubi 'alayhim wa lad-dallin. Amin.",
    translation: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam..."
  },
  {
    id: "jn-bacaan-4",
    category: "bacaan_solat",
    genderTarget: "all",
    title: "Bacaan Ruku' & I'tidal",
    explanation: "Bacaan ketika bongkok Ruku' dan ketika bangkit I'tidal.",
    steps: [
      {
        stepNumber: 1,
        title: "Bacaan Semasa Ruku' (Dibaca 3 Kali)",
        detail: "Membongkokkan badan 90 darjah dengan tenang.",
        arabicText: "سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ",
        latinText: "Subhana Rabbiyal-'Adhimi wa bihamdih.",
        translation: "Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya.",
        illustrationEmoji: "🙇"
      },
      {
        stepNumber: 2,
        title: "Bacaan Bangkit I'tidal",
        detail: "Bangkit berdiri semula dari ruku'.",
        arabicText: "سَمِعَ اللهُ لِمَنْ حَمِدَهُ",
        latinText: "Sami'Allahu liman hamidah.",
        translation: "Allah mendengar orang yang memuji-Nya.",
        illustrationEmoji: "🧍"
      },
      {
        stepNumber: 3,
        title: "Doa Semasa Berdiri I'tidal",
        detail: "Dibaca setelah berdiri tegak.",
        arabicText: "رَبَّنَا وَلَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ",
        latinText: "Rabbana wa lakal-hamd, mil'as-samawati wa mil'al-ardi wa mil'a ma shi'ta min shay'in ba'd.",
        translation: "Wahai Tuhan kami, bagi-Mu jua segala puji, sepenuh langit dan sepenuh bumi...",
        illustrationEmoji: "🤲"
      }
    ],
    translation: "Diulang 3 kali dengan tuma'ninah (tenang seketika)."
  },
  {
    id: "jn-bacaan-5",
    category: "bacaan_solat",
    genderTarget: "all",
    title: "Bacaan Sujud & Duduk Antara Dua Sujud",
    explanation: "Bacaan semasa sujud dan ketika duduk antara dua sujud.",
    steps: [
      {
        stepNumber: 1,
        title: "Bacaan Semasa Sujud (Dibaca 3 Kali)",
        detail: "Menempelkan 7 anggota sujud ke lantai.",
        arabicText: "سُبْحَانَ رَبِّيَ الأَعْلَى وَبِحَمْدِهِ",
        latinText: "Subhana Rabbiyal-A'la wa bihamdih.",
        translation: "Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya.",
        illustrationEmoji: "🙇"
      },
      {
        stepNumber: 2,
        title: "Bacaan Duduk Antara Dua Sujud",
        detail: "Duduk berada dalam keadaan ikftirash.",
        arabicText: "رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي",
        latinText: "Rabbighfir li, warhamni, wajburni, warfa'ni, warzuqni, wahdini, wa 'afini, wa'fu 'anni.",
        translation: "Ya Tuhanku! Ampunilah aku, rahmatilah aku, cukupkanlah kekuranganku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, sehatkanlah aku, dan maafkanlah aku.",
        illustrationEmoji: "🧎"
      }
    ],
    translation: "Mengandungi doa memohon keampunan, rezeki, kesihatan, dan petunjuk."
  },
  {
    id: "jn-bacaan-6",
    category: "bacaan_solat",
    genderTarget: "all",
    title: "Bacaan Tahiyyat Awal & Tahiyyat Akhir",
    explanation: "Bacaan salam penghormatan dan selawat pada rakaat kedua dan terakhir.",
    steps: [
      {
        stepNumber: 1,
        title: "Tahiyyat Awal",
        detail: "Dibaca pada rakaat kedua bagi solat 3 & 4 rakaat.",
        arabicText: "التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ، السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ، اَللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
        latinText: "At-Tahiyyatu al-mubarakatu as-salawatu at-tayyibatu lillah. As-salamu 'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ash-hadu alla ilaha illallah, wa ash-hadu anna Muhammadan Rasulu-llah. Allahumma salli 'ala Muhammad.",
        translation: "Segala penghormatan yang berkat, solat dan kebaikan adalah bagi Allah. Sejahtera atasmu wahai Nabi serta rahmat Allah dan keberkatan-Nya...",
        illustrationEmoji: "📜"
      },
      {
        stepNumber: 2,
        title: "Selawat Ibrahimiyah (Tahiyyat Akhir)",
        detail: "Sambungan selawat pada Tahiyyat Akhir.",
        arabicText: "وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
        latinText: "Wa 'ala ali Muhammad, kama sallayta 'ala Ibrahim wa 'ala ali Ibrahim. Wa barik 'ala Muhammad wa 'ala ali Muhammad, kama barakta 'ala Ibrahim wa 'ala ali Ibrahim, fil-'alamina innaka Hamidum-Majid.",
        translation: "Dan ke atas keluarga Muhammad sebagaimana Engkau telah berselawat ke atas Ibrahim dan keluarga Ibrahim. Dan berkatilah Muhammad...",
        illustrationEmoji: "💚"
      }
    ],
    translation: "Duduk tawarruk pada Tahiyyat Akhir."
  },
  {
    id: "jn-bacaan-7",
    category: "bacaan_solat",
    genderTarget: "all",
    title: "Doa Qunut Solat Subuh",
    explanation: "Doa yang disunatkan dibaca pada iktidal rakaat kedua Solat Subuh.",
    arabicText: "اَللّهُمَّ اهْدِنِيْ فِيْمَنْ هَدَيْتَ ، وَعَافِنِيْ فِيْمَنْ عَافَيْتَ ، وَتَوَلَّنِيْ فِيْمَنْ تَوَلَّيْتَ ، وَبَارِكْ لِيْ فِيْمَا أَعْطَيْتَ ، وَقِنِيْ شَرَّ مَا قَضَيْتَ ، فَإِنَّكَ تَقْضِيْ وَلاَ يُقْضَى عَلَيْكَ ، وَإِنَّهُ لاَ يَذِلُّ مَنْ وَالَيْتَ ، وَلاَ يَعِزُّ مَنْ عَادَيْتَ ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ ، وَأَسْتَغْفِرُكَ وَأَتُوْبُ إِلَيْكَ ، وَصَلَّى اللهُ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ",
    latinText: "Allahummahdini fiman hadayt, wa 'afini fiman 'afayt, wa tawallani fiman tawallayt, wa barik li fiman a'tayt, wa qini sharra ma qadayt, fa-innaka taqdi wa la yuqda 'alayk, wa innahu la yadhillu man walayt, wa la ya'izzu man 'adayt, tabarakta Rabbana wa ta'alayt, fa-lakal-hamdu 'ala ma qadayt, wa astaghfiruka wa atubu ilayk, wa sallallahu 'ala Sayyidina Muhammadi-nin-Nabiyyil-Ummiyyi wa 'ala alihi wa sahbihi wa sallam.",
    translation: "Ya Allah, berilah aku petunjuk sebagaimana orang-orang yang telah Engkau beri petunjuk, berilah aku kesihatan sebagaimana orang-orang yang telah Engkau beri kesihatan..."
  },
  {
    id: "jn-bacaan-8",
    category: "bacaan_solat",
    genderTarget: "all",
    title: "Lafaz Salam",
    explanation: "Ucapan penutup solat sambil berpaling ke kanan dan ke kiri.",
    arabicText: "السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ",
    latinText: "As-salamu 'alaykum wa rahmatullah.",
    translation: "Sejahtera ke atas kamu dan rahmat Allah.",
    steps: [
      {
        stepNumber: 1,
        title: "Salam Pertama (Rukun)",
        detail: "Berpaling ke kanan sehingga pipi kanan kelihatan dari belakang.",
        arabicText: "السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ",
        latinText: "As-salamu 'alaykum wa rahmatullah.",
        translation: "Sejahtera ke atas kamu dan rahmat Allah.",
        illustrationEmoji: "👉"
      },
      {
        stepNumber: 2,
        title: "Salam Kedua (Sunat)",
        detail: "Berpaling ke kiri.",
        arabicText: "السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ",
        latinText: "As-salamu 'alaykum wa rahmatullah.",
        translation: "Sejahtera ke atas kamu dan rahmat Allah.",
        illustrationEmoji: "👈"
      }
    ]
  },

  // 2. HIMPUNAN DOA HARIAN (BAHASA AL-QURAN & HADIS)
  {
    id: "jn-doa-1",
    category: "doa_harian",
    genderTarget: "all",
    title: "Doa Untuk Kedua Ibu Bapa",
    explanation: "Doa memohon keampunan dan kasih sayang Allah untuk ibu dan ayah.",
    arabicText: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    latinText: "Rabbighfir li wa liwalidayya warhamhuma kama rabbayani saghira.",
    translation: "Ya Tuhanku, ampunilah dosaku dan dosa kedua ibu bapaku, dan kasihanilah mereka berdua sebagaimana mereka mendidikku sewaktu kecil."
  },
  {
    id: "jn-doa-2",
    category: "doa_harian",
    genderTarget: "all",
    title: "Doa Kebaikan Dunia & Akhirat (Rabbana Atina)",
    explanation: "Doa memohon kebaikan hidup di dunia, akhirat, dan dilindungi dari azab neraka.",
    arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latinText: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
    translation: "Wahai Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami daripada azab neraka."
  },
  {
    id: "jn-doa-3",
    category: "doa_harian",
    genderTarget: "all",
    title: "Doa Sebelum & Selepas Makan",
    explanation: "Doa memohon keberkatan rezeki makanan dan ucapan syukur.",
    steps: [
      {
        stepNumber: 1,
        title: "Doa Sebelum Makan",
        detail: "Membaca doa sebelum menelan suapan pertama.",
        arabicText: "اَللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
        latinText: "Allahumma barik lana fima razaqtana wa qina 'adhaban-nar.",
        translation: "Ya Allah, berkatilah rezeki yang Engkau kurniakan kepada kami dan peliharalah kami daripada azab neraka.",
        illustrationEmoji: "🍲"
      },
      {
        stepNumber: 2,
        title: "Doa Selepas Makan",
        detail: "Ucapan syukur setelah selesai makan.",
        arabicText: "اَلْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        latinText: "Alhamdu lillahilladhi at'amana wa saqana wa ja'alana muslimin.",
        translation: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami daripada golongan orang Islam.",
        illustrationEmoji: "🥤"
      }
    ],
    translation: "Sunat memulakan dengan membaca Bismillah."
  },
  {
    id: "jn-doa-4",
    category: "doa_harian",
    genderTarget: "all",
    title: "Doa Belajar & Memohon Terang Hati",
    explanation: "Doa memohon dilapangkan dada dan dipermudahkan kefahaman ilmu.",
    arabicText: "رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي ۝ يَفْقَهُوا قَوْلِي ۝",
    latinText: "Rabbish-rah li sadri, wa yassir li amri, wahlul 'uqdatam min lisani, yafqahu qauli.",
    translation: "Wahai Tuhanku, lapangkanlah dadaku, permudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku, supaya mereka memahami perkataanku."
  },
  {
    id: "jn-doa-5",
    category: "doa_harian",
    genderTarget: "all",
    title: "Doa Sebelum & Bangun Tidur",
    explanation: "Doa menyerahkan diri sebelum tidur dan kesyukuran apabila bangun.",
    steps: [
      {
        stepNumber: 1,
        title: "Doa Sebelum Tidur",
        detail: "Membaca doa sambil mengibas tempat tidur.",
        arabicText: "بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ",
        latinText: "Bismika-Allahumma ahya wa amut.",
        translation: "Dengan nama-Mu ya Allah, aku hidup dan aku mati.",
        illustrationEmoji: "😴"
      },
      {
        stepNumber: 2,
        title: "Doa Bangun Tidur",
        detail: "Dibaca sebaik sahaja membuka mata.",
        arabicText: "اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        latinText: "Alhamdu lillahilladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
        translation: "Segala puji bagi Allah yang menghidupkan kami semula selepas mematikan kami, dan kepada-Nya jua tempat kembali.",
        illustrationEmoji: "🌅"
      }
    ],
    translation: "Sunat wuduk sebelum tidur dan membaca Surah Al-Ikhlas, Al-Falaq, An-Nas."
  },
  {
    id: "jn-doa-6",
    category: "doa_harian",
    genderTarget: "all",
    title: "Doa Masuk & Keluar Tandas",
    explanation: "Doa perlindungan daripada gangguan syaitan semasa memasuki tandas.",
    steps: [
      {
        stepNumber: 1,
        title: "Doa Masuk Tandas",
        detail: "Melangkah masuk dengan kaki kiri.",
        arabicText: "اَللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        latinText: "Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith.",
        translation: "Ya Allah, aku memohon perlindungan-Mu daripada gangguan syaitan jantan dan syaitan betina.",
        illustrationEmoji: "🚪"
      },
      {
        stepNumber: 2,
        title: "Doa Keluar Tandas",
        detail: "Melangkah keluar dengan kaki kanan.",
        arabicText: "غُفْرَانَكَ ، اَلْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي",
        latinText: "Ghufranaka, alhamdu lillahilladhi adh-haba 'annil-adha wa 'afani.",
        translation: "Aku memohon keampunan-Mu. Segala puji bagi Allah yang telah menghilangkan kesakitan daripadaku dan menyihatkanku.",
        illustrationEmoji: "✨"
      }
    ],
    translation: "Adab ke tandas mengikut sunnah Rasulullah SAW."
  },
  {
    id: "jn-doa-7",
    category: "doa_harian",
    genderTarget: "all",
    title: "Doa Naik Kenderaan",
    explanation: "Doa memohon keselamatan perjalanan semasa menaiki bas, kereta, atau basikal.",
    arabicText: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    latinText: "Subhanalladhi sakh-khara lana hadha wa ma kunna lahu muqrinina wa inna ila Rabbina lamunqalibun.",
    translation: "Maha Suci Tuhan yang telah memudahkan kenderaan ini bagi kami, sedangkan kami sebelum ini tidak mampu menguasainya, dan sesungguhnya kepada Tuhan kamilah kami akan kembali."
  },
  {
    id: "jn-doa-8",
    category: "doa_harian",
    genderTarget: "all",
    title: "Ayat Kursi (Surah Al-Baqarah: 255)",
    explanation: "Ayat paling agung dalam Al-Quran yang memberi perlindungan dan keberkatan.",
    arabicText: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    latinText: "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi-shay'im-min 'ilmihi illa bima sha'a, wasi'a kursiyyuhus-samawati wal-arda wa la ya'uduhu hifdhuhuma wa Huwal-'Aliyyul-'Adhim.",
    translation: "Allah, tiada Tuhan melainkan Dia, Yang Hidup Kekal lagi terus menerus mengurus (makhluk-Nya)..."
  },
  {
    id: "jn-doa-9",
    category: "doa_harian",
    genderTarget: "all",
    title: "Doa Selepas Wuduk",
    explanation: "Doa yang dibaca sambil menghadap Qiblat selepas selesai mengambil wuduk.",
    arabicText: "أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اَللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ وَاجْعَلْنِي مِنْ عِبَادِكَ الصَّالِحِينَ",
    latinText: "Ash-hadu alla ilaha illallahu wahdahu la sharika lah, wa ash-hadu anna Muhammadan 'abduhu wa Rasuluh. Allahummaj-'alni minat-tawwabina waj-'alni minal-mutatahhiriina waj-'alni min 'ibadikas-salihin.",
    translation: "Aku bersaksi bahawa tiada Tuhan melainkan Allah yang Maha Esa, tiada sekutu bagi-Nya. Dan aku bersaksi bahawa Nabi Muhammad itu hamba-Nya dan pesuruh-Nya. Ya Allah, jadikanlah aku dalam kalangan orang yang bertaubat dan jadikanlah aku dalam kalangan orang yang bersuci..."
  },

  // 3. PANDUAN WUDUK SEMPURNA
  {
    id: "jn-wuduk-1",
    category: "wuduk",
    genderTarget: "all",
    title: "Panduan Wuduk Sempurna (JAKIM)",
    explanation: "Piawaian 6 Rukun Wuduk serta Sunat Wuduk mengikut ketetapan JAKIM.",
    steps: [
      {
        stepNumber: 1,
        title: "1. Niat Wuduk (Rukun)",
        detail: "Niat di dalam hati sewaktu basuhan muka pertama.",
        arabicText: "نَوَيْتُ رَفْعَ الْحَدَثِ الأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى",
        latinText: "Nawaitu raf'al hadathil-asghari fardhan lillahi Ta'ala.",
        translation: "Sahaja aku mengangkat hadas kecil fardhu kerana Allah Ta'ala.",
        illustrationEmoji: "🤲"
      },
      {
        stepNumber: 2,
        title: "2. Membasuh Muka (Rukun)",
        detail: "Membasuh keseluruhan muka dari tempat tumbuh rambut hingga bawah dagu.",
        illustrationEmoji: "💧"
      },
      {
        stepNumber: 3,
        title: "3. Membasuh Tangan Hingga Siku (Rukun)",
        detail: "Membasuh tangan kanan dan kiri sehingga melebihi paras siku.",
        illustrationEmoji: "💪"
      },
      {
        stepNumber: 4,
        title: "4. Menyapu Sebahagian Kepala (Rukun)",
        detail: "Menyapu sebahagian kulit atau rambut kepala dengan air basah.",
        illustrationEmoji: "🙆"
      },
      {
        stepNumber: 5,
        title: "5. Membasuh Kaki Hingga Buku Lali (Rukun)",
        detail: "Membasuh kedua-dua kaki sehingga melebihi paras buku lali.",
        illustrationEmoji: "🦶"
      },
      {
        stepNumber: 6,
        title: "6. Tertib (Rukun)",
        detail: "Lakukan susunan 1 hingga 5 mengikut urutan berdisiplin.",
        illustrationEmoji: "✨"
      }
    ],
    translation: "Wuduk yang sempurna menjadi syarat sah solat."
  },

  // 4. PANDUAN PERBUATAN SOLAT LELAKI & PEREMPUAN
  {
    id: "jn-solat-lelaki",
    category: "solat_lelaki",
    genderTarget: "boy",
    title: "Panduan Solat Lelaki (Piawaian JAKIM)",
    explanation: "Panduan khusus tatacara perbuatan solat bagi anak lelaki mengikut sunnah Nabi SAW dan piawaian JAKIM.",
    steps: [
      {
        stepNumber: 1,
        title: "Pakaian & Aurat Lelaki",
        detail: "Aurat lelaki di dalam solat adalah antara pusat hingga lutut. Pakaian mestilah bersih, suci, dan disunatkan memakai baju Melayu/jubah bersih serta songkok/kopiah.",
        illustrationEmoji: "🕋"
      },
      {
        stepNumber: 2,
        title: "Takbiratul Ihram & Ruku'",
        detail: "Lelaki merenggangkan sedikit kedua-dua tangan dan siku dari lambung badan semasa takbir dan ruku'.",
        illustrationEmoji: "🤲"
      },
      {
        stepNumber: 3,
        title: "Kedudukan Sujud Lelaki",
        detail: "Menjarakkan perut daripada paha. Siku ditegakkan dan diangkat dari menyentuh lantai.",
        illustrationEmoji: "🙇‍♂️"
      },
      {
        stepNumber: 4,
        title: "Kedudukan Saf Lelaki",
        detail: "Lelaki berdiri di saf hadapan di masjid/surau di belakang Imam.",
        illustrationEmoji: "🕌"
      }
    ],
    translation: "Mencapai kesempurnaan solat lelaki mengikut syariat Islam."
  },
  {
    id: "jn-solat-perempuan",
    category: "solat_perempuan",
    genderTarget: "girl",
    title: "Panduan Solat Perempuan (Piawaian JAKIM)",
    explanation: "Panduan khusus tatacara perbuatan solat bagi anak perempuan mengikut piawaian JAKIM.",
    steps: [
      {
        stepNumber: 1,
        title: "Pakaian & Aurat Perempuan",
        detail: "Aurat perempuan di dalam solat adalah seluruh badan KECUALI muka dan kedua-dua tapak tangan. Memakai telekung bersih yang tidak jarang.",
        illustrationEmoji: "🧕"
      },
      {
        stepNumber: 2,
        title: "Takbiratul Ihram & Ruku'",
        detail: "Perempuan merapatkan kedua-dua siku ke rusuk dan dada semasa takbiratul ihram dan ruku'.",
        illustrationEmoji: "🤲"
      },
      {
        stepNumber: 3,
        title: "Kedudukan Sujud Perempuan",
        detail: "Merapatkan perut ke paha dan kedua-dua siku dirapatkan ke lantai serta rusuk badan untuk kerapian aurat.",
        illustrationEmoji: "🙇‍♀️"
      },
      {
        stepNumber: 4,
        title: "Kedudukan Saf Perempuan",
        detail: "Perempuan berdiri di saf belakang di belakang saf lelaki bagi solat berjemaah.",
        illustrationEmoji: "🕌"
      }
    ],
    translation: "Memastikan solat wanita terpelihara aurat dan kesopanannya."
  },
  {
    id: "jn-syarat-rukun",
    category: "syarat_rukun",
    genderTarget: "all",
    title: "13 Rukun Solat (Piawaian JAKIM)",
    explanation: "Rukun solat adalah perkara wajib yang mesti dilakukan. Jika ditinggalkan, solat tidak sah.",
    steps: [
      { stepNumber: 1, title: "Niat", detail: "Niat di dalam hati mengikut solat yang dilakukan.", illustrationEmoji: "💭" },
      { stepNumber: 2, title: "Berdiri Bagi Yang Mampu", detail: "Berdiri tegak menghadap Qiblat.", illustrationEmoji: "🧍" },
      { stepNumber: 3, title: "Takbiratul Ihram", detail: "Lafaz 'Allahu Akbar' sambil berniat.", illustrationEmoji: "🙌" },
      { stepNumber: 4, title: "Membaca Surah Al-Fatihah", detail: "Wajib dibaca dengan tajwid yang betul di setiap rakaat.", illustrationEmoji: "📖" },
      { stepNumber: 5, title: "Ruku' Serta Tuma'ninah", detail: "Bongkokkan badan 90 darjah dengan tenang seketika.", illustrationEmoji: "🙇" },
      { stepNumber: 6, title: "I'tidal Serta Tuma'ninah", detail: "Bangkit berdiri semula dari ruku' dengan tenang.", illustrationEmoji: "🧍" },
      { stepNumber: 7, title: "Sujud 2 Kali Serta Tuma'ninah", detail: "Menempelkan dahi, tapak tangan, lutut, dan jari kaki.", illustrationEmoji: "🙇" },
      { stepNumber: 8, title: "Duduk Antara Dua Sujud", detail: "Duduk dan membaca 'Rabbighfirli warhamni...'.", illustrationEmoji: "🧎" },
      { stepNumber: 9, title: "Duduk Tahiyyat Akhir", detail: "Duduk tawarruk pada rakaat terakhir.", illustrationEmoji: "🧎" },
      { stepNumber: 10, title: "Membaca Bacaan Tahiyyat Akhir", detail: "Membaca 'At-Tahiyyatu al-Mubarakatu...'.", illustrationEmoji: "📜" },
      { stepNumber: 11, title: "Selawat Ke Atas Nabi Muhammad SAW", detail: "Dalam Tahiyyat Akhir.", illustrationEmoji: "💚" },
      { stepNumber: 12, title: "Memberi Salam Pertama", detail: "Pusingkan muka ke kanan sambil memberi salam.", illustrationEmoji: "👉" },
      { stepNumber: 13, title: "Tertib", detail: "Mengikut susunan dari rukun 1 hingga 12.", illustrationEmoji: "✅" }
    ],
    translation: "Mengikut ketetapan Fiqh Shafie JAKIM."
  }
];
