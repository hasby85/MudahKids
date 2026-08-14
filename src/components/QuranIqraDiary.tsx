import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import confetti from "canvas-confetti";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Flame,
  MessageSquare,
  Plus,
  BookmarkCheck,
  RotateCcw,
  Star,
  Check,
  X
} from "lucide-react";
import { ReadingLogEntry } from "../types";

// List of popular Surahs for quick search & selection
export const SURAH_LIST = [
  { number: 1, nameMalay: "Al-Fatihah", nameArabic: "الفاتحة", totalAyat: 7, defaultJuz: 1 },
  { number: 2, nameMalay: "Al-Baqarah", nameArabic: "البقرة", totalAyat: 286, defaultJuz: 1 },
  { number: 3, nameMalay: "Ali 'Imran", nameArabic: "آل عمران", totalAyat: 200, defaultJuz: 3 },
  { number: 4, nameMalay: "An-Nisa'", nameArabic: "النساء", totalAyat: 176, defaultJuz: 4 },
  { number: 5, nameMalay: "Al-Ma'idah", nameArabic: "المائدة", totalAyat: 120, defaultJuz: 6 },
  { number: 6, nameMalay: "Al-An'am", nameArabic: "الأنعام", totalAyat: 165, defaultJuz: 7 },
  { number: 7, nameMalay: "Al-A'raf", nameArabic: "الأعراف", totalAyat: 206, defaultJuz: 8 },
  { number: 18, nameMalay: "Al-Kahf", nameArabic: "الكهف", totalAyat: 110, defaultJuz: 15 },
  { number: 36, nameMalay: "Ya-Sin", nameArabic: "يس", totalAyat: 83, defaultJuz: 22 },
  { number: 55, nameMalay: "Ar-Rahman", nameArabic: "الرحمن", totalAyat: 78, defaultJuz: 27 },
  { number: 56, nameMalay: "Al-Waqi'ah", nameArabic: "الواقعة", totalAyat: 96, defaultJuz: 27 },
  { number: 67, nameMalay: "Al-Mulk", nameArabic: "الملك", totalAyat: 30, defaultJuz: 29 },
  { number: 78, nameMalay: "An-Naba'", nameArabic: "النبأ", totalAyat: 40, defaultJuz: 30 },
  { number: 87, nameMalay: "Al-A'la", nameArabic: "الأعلى", totalAyat: 19, defaultJuz: 30 },
  { number: 93, nameMalay: "Ad-Duha", nameArabic: "الضحى", totalAyat: 11, defaultJuz: 30 },
  { number: 94, nameMalay: "Asy-Syarh", nameArabic: "الشرح", totalAyat: 8, defaultJuz: 30 },
  { number: 95, nameMalay: "At-Tin", nameArabic: "التين", totalAyat: 8, defaultJuz: 30 },
  { number: 96, nameMalay: "Al-'Alaq", nameArabic: "العلق", totalAyat: 19, defaultJuz: 30 },
  { number: 97, nameMalay: "Al-Qadr", nameArabic: "القدر", totalAyat: 5, defaultJuz: 30 },
  { number: 98, nameMalay: "Al-Bayyinah", nameArabic: "البينة", totalAyat: 8, defaultJuz: 30 },
  { number: 99, nameMalay: "Az-Zalzalah", nameArabic: "الزلزلة", totalAyat: 8, defaultJuz: 30 },
  { number: 100, nameMalay: "Al-'Adiyat", nameArabic: "العاديات", totalAyat: 11, defaultJuz: 30 },
  { number: 101, nameMalay: "Al-Qari'ah", nameArabic: "القارعة", totalAyat: 11, defaultJuz: 30 },
  { number: 102, nameMalay: "At-Takasur", nameArabic: "التكاثر", totalAyat: 8, defaultJuz: 30 },
  { number: 103, nameMalay: "Al-'Asr", nameArabic: "العصر", totalAyat: 3, defaultJuz: 30 },
  { number: 104, nameMalay: "Al-Humazah", nameArabic: "الهمزة", totalAyat: 9, defaultJuz: 30 },
  { number: 105, nameMalay: "Al-Fil", nameArabic: "الفيل", totalAyat: 5, defaultJuz: 30 },
  { number: 106, nameMalay: "Quraisy", nameArabic: "قريش", totalAyat: 4, defaultJuz: 30 },
  { number: 107, nameMalay: "Al-Ma'un", nameArabic: "الماعون", totalAyat: 7, defaultJuz: 30 },
  { number: 108, nameMalay: "Al-Kausar", nameArabic: "الكوثر", totalAyat: 3, defaultJuz: 30 },
  { number: 109, nameMalay: "Al-Kafirun", nameArabic: "الكافرون", totalAyat: 6, defaultJuz: 30 },
  { number: 110, nameMalay: "An-Nasr", nameArabic: "النصر", totalAyat: 3, defaultJuz: 30 },
  { number: 111, nameMalay: "Al-Masad", nameArabic: "المسد", totalAyat: 5, defaultJuz: 30 },
  { number: 112, nameMalay: "Al-Ikhlas", nameArabic: "الإخلاص", totalAyat: 4, defaultJuz: 30 },
  { number: 113, nameMalay: "Al-Falaq", nameArabic: "الفلق", totalAyat: 5, defaultJuz: 30 },
  { number: 114, nameMalay: "An-Nas", nameArabic: "الناس", totalAyat: 6, defaultJuz: 30 }
];

export const QuranIqraDiary: React.FC = () => {
  const { language, activeChild, updateChildProfile, role, showToast } = useApp();

  if (!activeChild) return null;

  const currentProgress = activeChild.quranIqraProgress || {
    currentType: "iqra",
    currentIqraLevel: 5,
    currentIqraPage: 3,
    currentQuranJuzuk: 1,
    currentQuranSurahName: "Al-Fatihah",
    currentQuranPage: 1,
    currentQuranAyat: 1,
    lastUpdated: new Date().toISOString(),
    history: [
      {
        id: "log-init",
        type: "iqra",
        title: "Iqra 5 - Muka Surat 3",
        iqraLevel: 5,
        iqraPage: 3,
        completedAt: new Date().toISOString(),
        parentNote: "Awal perintis bacaan tajwid lancar."
      }
    ]
  };

  // Local state for active input form
  const [readingType, setReadingType] = useState<"iqra" | "quran">(
    currentProgress.currentType || "iqra"
  );
  
  // Iqra State
  const [selectedIqraLevel, setSelectedIqraLevel] = useState<number>(
    currentProgress.currentIqraLevel || 5
  );
  const [selectedIqraPage, setSelectedIqraPage] = useState<number>(
    currentProgress.currentIqraPage || 3
  );

  // Al-Quran State
  const [selectedQuranSurah, setSelectedQuranSurah] = useState<string>(
    currentProgress.currentQuranSurahName || "Al-Fatihah"
  );
  const [selectedQuranJuzuk, setSelectedQuranJuzuk] = useState<number>(
    currentProgress.currentQuranJuzuk || 1
  );
  const [selectedQuranPage, setSelectedQuranPage] = useState<number>(
    currentProgress.currentQuranPage || 1
  );
  const [selectedQuranAyat, setSelectedQuranAyat] = useState<number>(
    currentProgress.currentQuranAyat || 1
  );

  const [noteInput, setNoteInput] = useState("");
  const [filterHistoryType, setFilterHistoryType] = useState<"all" | "iqra" | "quran">("all");

  // Reset Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetType, setResetType] = useState<"iqra" | "quran" | "both">("iqra");
  const [resetNote, setResetNote] = useState("");

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Handle Cycle Reset (Khatam / Mula Kitaran Baru)
  const handleConfirmReset = () => {
    let logTitle = "";
    let newProgress = { ...currentProgress };

    const defaultNote =
      resetNote.trim() ||
      (language === "en"
        ? "Alhamdulillah, finished reading cycle! Starting a new reading cycle."
        : "Alhamdulillah, telah tamat bacaan. Bermula kitaran baru!");

    if (resetType === "iqra") {
      logTitle =
        language === "en"
          ? "🎉 KHATAM IQRA: New Iqra Cycle Started (Level 1, Page 1)"
          : "🎉 KHATAM IQRA: Kitaran Iqra Baru Dimulakan (Jilid 1, M/S 1)";
      newProgress = {
        ...newProgress,
        currentType: "iqra",
        currentIqraLevel: 1,
        currentIqraPage: 1,
        lastUpdated: new Date().toISOString()
      };
      setSelectedIqraLevel(1);
      setSelectedIqraPage(1);
      setReadingType("iqra");
    } else if (resetType === "quran") {
      logTitle =
        language === "en"
          ? "🎉 KHATAM AL-QURAN: New Al-Quran Cycle Started (Surah Al-Fatihah, Page 1)"
          : "🎉 KHATAM AL-QURAN: Kitaran Al-Quran Baru Dimulakan (Surah Al-Fatihah, M/S 1)";
      newProgress = {
        ...newProgress,
        currentType: "quran",
        currentQuranSurahName: "Al-Fatihah",
        currentQuranJuzuk: 1,
        currentQuranPage: 1,
        currentQuranAyat: 1,
        lastUpdated: new Date().toISOString()
      };
      setSelectedQuranSurah("Al-Fatihah");
      setSelectedQuranJuzuk(1);
      setSelectedQuranPage(1);
      setSelectedQuranAyat(1);
      setReadingType("quran");
    } else {
      logTitle =
        language === "en"
          ? "🎉 FULL KHATAM & RESET: New Iqra & Al-Quran Cycle Started"
          : "🎉 KHATAM & RESET SEMUA: Kitaran Iqra & Al-Quran Baru Dimulakan";
      newProgress = {
        ...newProgress,
        currentType: "iqra",
        currentIqraLevel: 1,
        currentIqraPage: 1,
        currentQuranSurahName: "Al-Fatihah",
        currentQuranJuzuk: 1,
        currentQuranPage: 1,
        currentQuranAyat: 1,
        lastUpdated: new Date().toISOString()
      };
      setSelectedIqraLevel(1);
      setSelectedIqraPage(1);
      setSelectedQuranSurah("Al-Fatihah");
      setSelectedQuranJuzuk(1);
      setSelectedQuranPage(1);
      setSelectedQuranAyat(1);
      setReadingType("iqra");
    }

    const milestoneEntry: ReadingLogEntry = {
      id: `log-reset-${Date.now()}`,
      type: resetType === "quran" ? "quran" : "iqra",
      title: logTitle,
      iqraLevel: 1,
      iqraPage: 1,
      quranJuzuk: 1,
      quranSurahName: "Al-Fatihah",
      quranPage: 1,
      quranAyat: 1,
      completedAt: new Date().toISOString(),
      parentNote: defaultNote
    };

    const updatedHistory = [milestoneEntry, ...(newProgress.history || [])];

    // Bonus reward for completing/resetting cycle: +100 XP & +50 Coins!
    const updatedXp = activeChild.xp + 100;
    const updatedCoins = activeChild.coins + 50;

    updateChildProfile({
      xp: updatedXp,
      coins: updatedCoins,
      quranIqraProgress: {
        ...newProgress,
        history: updatedHistory
      }
    });

    triggerCelebration();
    showToast(
      language === "en"
        ? `🎉 Alhamdulillah! Cycle reset successful. (+100 XP, +50 Coins)`
        : `🎉 Alhamdulillah! Kitaran bacaan di-reset untuk kitaran baru. (+100 XP, +50 Syiling)`,
      "success"
    );

    setShowResetModal(false);
    setResetNote("");
  };

  // Submit Progress Tick Function
  const handleSaveReadingProgress = () => {
    let title = "";
    let entry: ReadingLogEntry;

    if (readingType === "iqra") {
      title = `Iqra ${selectedIqraLevel} - Muka Surat ${selectedIqraPage}`;
      entry = {
        id: `log-${Date.now()}`,
        type: "iqra",
        title,
        iqraLevel: selectedIqraLevel,
        iqraPage: selectedIqraPage,
        completedAt: new Date().toISOString(),
        parentNote: noteInput.trim() || undefined
      };
    } else {
      title = `Al-Quran: Surah ${selectedQuranSurah} (Juzuk ${selectedQuranJuzuk}), Muka Surat ${selectedQuranPage}${
        selectedQuranAyat ? `, Ayat ${selectedQuranAyat}` : ""
      }`;
      entry = {
        id: `log-${Date.now()}`,
        type: "quran",
        title,
        quranJuzuk: selectedQuranJuzuk,
        quranSurahName: selectedQuranSurah,
        quranPage: selectedQuranPage,
        quranAyat: selectedQuranAyat,
        completedAt: new Date().toISOString(),
        parentNote: noteInput.trim() || undefined
      };
    }

    const updatedHistory = [entry, ...(currentProgress.history || [])];

    const newQuranIqraProgress = {
      currentType: readingType,
      currentIqraLevel: selectedIqraLevel,
      currentIqraPage: selectedIqraPage,
      currentQuranJuzuk: selectedQuranJuzuk,
      currentQuranSurahName: selectedQuranSurah,
      currentQuranPage: selectedQuranPage,
      currentQuranAyat: selectedQuranAyat,
      lastUpdated: new Date().toISOString(),
      history: updatedHistory
    };

    // Reward child with +30 XP and +15 Coins for logging reading!
    const updatedXp = activeChild.xp + 30;
    const updatedCoins = activeChild.coins + 15;

    updateChildProfile({
      xp: updatedXp,
      coins: updatedCoins,
      quranIqraProgress: newQuranIqraProgress
    });

    triggerCelebration();
    showToast(
      language === "en"
        ? `🎉 Updated! Registered: ${title} (+30 XP, +15 Coins)`
        : `🎉 Alhamdulillah! Rekod dikemaskini: ${title} (+30 XP, +15 Syiling)`,
      "success"
    );

    setNoteInput("");
  };

  // Helper when clicking a Surah to auto set default Juzuk
  const handleSelectSurah = (surahName: string) => {
    setSelectedQuranSurah(surahName);
    const found = SURAH_LIST.find((s) => s.nameMalay === surahName);
    if (found) {
      setSelectedQuranJuzuk(found.defaultJuz);
    }
  };

  const filteredHistory = (currentProgress.history || []).filter((h) => {
    if (filterHistoryType === "all") return true;
    return h.type === filterHistoryType;
  });

  return (
    <div className="space-y-8">
      {/* Banner / Current Position Highlight Card */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border-2 border-emerald-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-stone-900 text-xs font-black shadow-sm">
              <Sparkles className="w-4 h-4 fill-stone-900" />
              <span>{language === "en" ? "Iqra & Al Quran Reading Log" : "Rekod Bacaan Iqra & Al Quran"}</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              {language === "en" ? `Reading Progress for ${activeChild.name}` : `Rekod Bacaan ${activeChild.name}`}
            </h2>
            
            <p className="text-emerald-100 text-xs md:text-sm leading-relaxed">
              {language === "en"
                ? "Tick and record your latest reading page. Earn +30 XP & +15 Coins for every session!"
                : "Tanda dan catat muka surat bacaan terkini anda. Kumpul +30 XP & +15 Syiling setiap kali menanda rekod baru!"}
            </p>
          </div>

          {/* Current Saved Badge Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 shrink-0 min-w-[260px] space-y-2 shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{language === "en" ? "Latest Checked Progress" : "Kedudukan Bacaan Terkini"}</span>
            </span>

            <div className="text-xl font-black text-white flex items-center gap-2">
              {currentProgress.currentType === "iqra" ? (
                <>
                  <span className="text-2xl">📗</span>
                  <div>
                    <div>Iqra {currentProgress.currentIqraLevel || 1}</div>
                    <div className="text-xs font-bold text-amber-300">
                      Muka Surat {currentProgress.currentIqraPage || 1}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl">📖</span>
                  <div>
                    <div>Surah {currentProgress.currentQuranSurahName || "Al-Fatihah"}</div>
                    <div className="text-xs font-bold text-amber-300">
                      Juzuk {currentProgress.currentQuranJuzuk || 1} • M/S {currentProgress.currentQuranPage || 1}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="text-[10px] font-medium text-emerald-200 border-t border-white/10 pt-2 flex items-center justify-between gap-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-300" />
                {currentProgress.lastUpdated
                  ? new Date(currentProgress.lastUpdated).toLocaleDateString("ms-MY", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  : "Baru sekarang"}
              </span>

              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-900 font-black text-[10px] shadow-sm transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Tracker & Tick Form */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md space-y-8">
        
        {/* Khatam & Reset Banner Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-50 to-orange-50 p-4 md:p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center text-xl font-black shrink-0 shadow-xs">
              🎓
            </div>
            <div>
              <h4 className="font-extrabold text-stone-900 text-xs md:text-sm flex items-center gap-2">
                <span>{language === "en" ? "Finished or Khatam Iqra / Al-Quran?" : "Telah Tamat / Khatam Bacaan Iqra atau Al-Quran?"}</span>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {language === "en" ? "Cycle Reset" : "Reset Kitaran"}
                </span>
              </h4>
              <p className="text-[11px] text-stone-600">
                {language === "en"
                  ? "Reset progress to start a fresh cycle. All past log records remain safe in history!"
                  : "Tekan di sini jika anak telah khatam untuk memulakan kitaran bacaan baru. Rekod sejarah lama tidak dipadam!"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 border border-amber-300"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>{language === "en" ? "Start New Cycle (Reset)" : "Mula Kitaran Baru (Reset)"}</span>
          </button>
        </div>

        {/* Mode Selector Tabs (Iqra vs Al-Quran) */}
        <div className="flex items-center justify-center">
          <div className="bg-stone-100 p-1.5 rounded-2xl flex items-center gap-2 text-sm font-black w-full max-w-md shadow-inner">
            <button
              onClick={() => setReadingType("iqra")}
              className={`flex-1 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                readingType === "iqra"
                  ? "bg-emerald-600 text-white shadow-md font-black"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span className="text-lg">📗</span>
              <span>{language === "en" ? "Iqra 1 - 6" : "Buku Iqra (1 - 6)"}</span>
            </button>

            <button
              onClick={() => setReadingType("quran")}
              className={`flex-1 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                readingType === "quran"
                  ? "bg-emerald-600 text-white shadow-md font-black"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span className="text-lg">📖</span>
              <span>{language === "en" ? "Al-Quran 30 Juzuk" : "Al-Quran (30 Juzuk)"}</span>
            </button>
          </div>
        </div>

        {/* Form Mode 1: IQRA TRACKER */}
        {readingType === "iqra" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Step 1: Select Iqra Level (1 to 6) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <span>{language === "en" ? "Select Iqra Volume:" : "Pilih Jilid Iqra:"}</span>
                </label>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Dipilih: Iqra {selectedIqraLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((level) => {
                  const isSelected = selectedIqraLevel === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedIqraLevel(level)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-lg scale-105"
                          : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-amber-400 text-stone-900 rounded-full p-0.5 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      <span className="text-2xl">📗</span>
                      <span className="font-black text-base">Iqra {level}</span>
                      <span className={`text-[10px] font-bold ${isSelected ? "text-emerald-100" : "text-stone-400"}`}>
                        Jilid {level}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Muka Surat Iqra (Interactive Grid 1 to 30) */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <span>
                    {language === "en"
                      ? `Tick Latest Page for Iqra ${selectedIqraLevel}:`
                      : `Tekan / Tick Muka Surat Terkini Bagi Iqra ${selectedIqraLevel}:`}
                  </span>
                </label>

                {/* Quick stepper */}
                <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl text-xs font-bold">
                  <span className="text-stone-500 text-[11px] px-1">Laras Cepat:</span>
                  <button
                    onClick={() => setSelectedIqraPage((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:bg-stone-200 text-stone-800 font-black cursor-pointer flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="px-2 font-black text-emerald-700">M/S {selectedIqraPage}</span>
                  <button
                    onClick={() => setSelectedIqraPage((p) => Math.min(30, p + 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:bg-stone-200 text-stone-800 font-black cursor-pointer flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Grid 1-30 */}
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((pageNum) => {
                  const isChecked = pageNum === selectedIqraPage;
                  const isPast = pageNum < selectedIqraPage;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setSelectedIqraPage(pageNum)}
                      className={`h-12 rounded-xl font-black text-sm flex flex-col items-center justify-center transition-all cursor-pointer border relative ${
                        isChecked
                          ? "bg-amber-400 border-amber-500 text-stone-900 shadow-md ring-4 ring-amber-300/50 scale-105 z-10"
                          : isPast
                          ? "bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <span>{pageNum}</span>
                      {isChecked && (
                        <span className="text-[8px] font-black uppercase text-stone-900 bg-white px-1 rounded-xs -mt-0.5">
                          Terkini
                        </span>
                      )}
                      {isPast && !isChecked && (
                        <span className="text-[9px] text-emerald-600 font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Form Mode 2: AL-QURAN TRACKER */}
        {readingType === "quran" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Select Surah */}
              <div className="space-y-2">
                <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">
                    1
                  </span>
                  <span>{language === "en" ? "Select Surah:" : "Pilih Surah Al-Quran:"}</span>
                </label>
                <select
                  value={selectedQuranSurah}
                  onChange={(e) => handleSelectSurah(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 bg-stone-50 font-bold text-xs text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {SURAH_LIST.map((surah) => (
                    <option key={surah.number} value={surah.nameMalay}>
                      {surah.number}. {surah.nameMalay} ({surah.nameArabic}) - Juz {surah.defaultJuz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Juzuk */}
              <div className="space-y-2">
                <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">
                    2
                  </span>
                  <span>{language === "en" ? "Juzuk (1 - 30):" : "Nombor Juzuk (1 - 30):"}</span>
                </label>
                <select
                  value={selectedQuranJuzuk}
                  onChange={(e) => setSelectedQuranJuzuk(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 bg-stone-50 font-bold text-xs text-stone-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                    <option key={juz} value={juz}>
                      Juzuk {juz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Muka Surat Al-Quran */}
              <div className="space-y-2">
                <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">
                    3
                  </span>
                  <span>{language === "en" ? "Page Number (1 - 604):" : "Muka Surat Al-Quran (1 - 604):"}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={604}
                    value={selectedQuranPage}
                    onChange={(e) => setSelectedQuranPage(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 bg-stone-50 font-black text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedQuranPage((p) => Math.min(604, p + 1))}
                      className="px-3 py-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-xs cursor-pointer"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedQuranPage((p) => Math.min(604, p + 5))}
                      className="px-3 py-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-xs cursor-pointer"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Ayat input */}
            <div className="max-w-xs space-y-1">
              <label className="text-xs font-bold text-stone-600">
                {language === "en" ? "Verse / Ayat Number (Optional):" : "Nombor Ayat Terkini (Opsional):"}
              </label>
              <input
                type="number"
                min={1}
                value={selectedQuranAyat}
                onChange={(e) => setSelectedQuranAyat(Number(e.target.value))}
                placeholder="Contoh: Ayat 15"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-xs outline-none"
              />
            </div>
          </div>
        )}

        {/* Note / Comment Input */}
        <div className="space-y-2 border-t border-stone-200 pt-6">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>
              {language === "en"
                ? "Note or Remarks for Today's Session (Optional):"
                : "Catatan atau Nota Bacaan Hari Ini (Opsional):"}
            </span>
          </label>
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder={
              language === "en"
                ? "e.g. Read smoothly with teacher/parent, paid attention to Tajweed"
                : "Contoh: Bacaan lancar, sudah faham hukum Nun Mati & Tanwin."
            }
            className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 font-medium text-xs text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit & Tick Progress Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50 p-5 rounded-3xl border border-emerald-200">
          <div className="space-y-0.5 text-center sm:text-left">
            <h4 className="font-extrabold text-stone-900 text-sm">
              {readingType === "iqra"
                ? `Simpan & Tick: Iqra ${selectedIqraLevel} Muka Surat ${selectedIqraPage}`
                : `Simpan & Tick: Al-Quran Surah ${selectedQuranSurah} M/S ${selectedQuranPage}`}
            </h4>
            <p className="text-xs text-emerald-800 font-medium">
              🎁 Ganjaran membaca: +30 XP & +15 Syiling Emas akan dikreditkan!
            </p>
          </div>

          <button
            onClick={handleSaveReadingProgress}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg border border-emerald-500 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>
              {language === "en" ? "Tick & Save Reading Progress" : "✅ Tick & Simpan Rekod Bacaan"}
            </span>
          </button>
        </div>
      </div>

      {/* History Log Section (Diari Rekod Sejarah) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>{language === "en" ? "Reading History Diary" : "Diari Sejarah Rekod Bacaan"}</span>
            </h3>
            <p className="text-stone-500 text-xs">
              {language === "en"
                ? "Past recorded reading sessions with date & timestamps"
                : "Senarai catatan bacaan yang telah ditanda dan disemak sebelum ini"}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setFilterHistoryType("all")}
              className={`px-3 py-1.5 rounded-xl cursor-pointer ${
                filterHistoryType === "all" ? "bg-emerald-600 text-white font-extrabold" : "text-stone-600"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterHistoryType("iqra")}
              className={`px-3 py-1.5 rounded-xl cursor-pointer ${
                filterHistoryType === "iqra" ? "bg-emerald-600 text-white font-extrabold" : "text-stone-600"
              }`}
            >
              Iqra
            </button>
            <button
              onClick={() => setFilterHistoryType("quran")}
              className={`px-3 py-1.5 rounded-xl cursor-pointer ${
                filterHistoryType === "quran" ? "bg-emerald-600 text-white font-extrabold" : "text-stone-600"
              }`}
            >
              Al-Quran
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-10 space-y-2 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <span className="text-3xl">📖</span>
            <p className="text-xs font-extrabold text-stone-500">
              {language === "en" ? "No reading logs yet." : "Belum ada rekod sejarah bacaan."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 transition-all flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl shrink-0 mt-0.5">
                    {item.type === "iqra" ? "📗" : "📖"}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-sm">{item.title}</h4>
                    {item.parentNote && (
                      <p className="text-xs text-stone-600 italic bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 mt-1 inline-block">
                        💬 "{item.parentNote}"
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.completedAt).toLocaleDateString("ms-MY", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.completedAt).toLocaleTimeString("ms-MY", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    +30 XP
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center gap-1">
                    +15 🪙
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-black shrink-0">
                  🔄
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    {language === "en" ? "Reset Reading Cycle" : "Reset & Mula Kitaran Bacaan Baru"}
                  </h3>
                  <p className="text-stone-500 text-xs">
                    {language === "en"
                      ? "Finished reading? Select cycle reset option"
                      : "Telah khatam atau tamat jilid? Sila pilih jenis reset"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Notice */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                <strong>Catatan Sejarah Selamat:</strong> Semua catatan dan rekod bacaan yang lalu TIDAK akan dipadam. Ia akan kekal disimpan dalam sejarah diari anak anda!
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="text-xs font-black text-stone-900 uppercase tracking-wider">
                {language === "en" ? "Select Cycle To Reset:" : "Pilih Mod Kitaran Yang Ingin Di-reset:"}
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Option 1: Iqra Only */}
                <button
                  type="button"
                  onClick={() => setResetType("iqra")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                    resetType === "iqra"
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20"
                      : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📗</span>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        {language === "en" ? "Reset Iqra Reading Only" : "Reset Bacaan Iqra Sahaja"}
                      </h4>
                      <p className="text-stone-500 text-xs">
                        {language === "en" ? "Start again from Iqra Volume 1, Page 1" : "Mula semula dari Iqra Jilid 1, Muka Surat 1"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      resetType === "iqra" ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300"
                    }`}
                  >
                    {resetType === "iqra" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Option 2: Al-Quran Only */}
                <button
                  type="button"
                  onClick={() => setResetType("quran")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                    resetType === "quran"
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20"
                      : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📖</span>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        {language === "en" ? "Reset Al-Quran (Khatam)" : "Reset Bacaan Al-Quran Sahaja (Khatam)"}
                      </h4>
                      <p className="text-stone-500 text-xs">
                        {language === "en"
                          ? "Start again from Surah Al-Fatihah, Juz 1, Page 1"
                          : "Mula semula dari Surah Al-Fatihah, Juzuk 1, M/S 1"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      resetType === "quran" ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300"
                    }`}
                  >
                    {resetType === "quran" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Option 3: Reset Both */}
                <button
                  type="button"
                  onClick={() => setResetType("both")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                    resetType === "both"
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20"
                      : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        {language === "en" ? "Reset Both (Iqra & Al-Quran)" : "Reset Kedua-duanya (Iqra & Al-Quran)"}
                      </h4>
                      <p className="text-stone-500 text-xs">
                        {language === "en"
                          ? "Reset both Iqra and Al-Quran progress to page 1"
                          : "Kembalikan status Iqra dan Al-Quran ke muka surat permulaan"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      resetType === "both" ? "border-emerald-600 bg-emerald-600 text-white" : "border-stone-300"
                    }`}
                  >
                    {resetType === "both" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Note Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-stone-800">
                {language === "en" ? "Khatam / Milestone Remarks (Optional):" : "Catatan / Ucapan Khatam Kitaran Ini (Opsional):"}
              </label>
              <input
                type="text"
                value={resetNote}
                onChange={(e) => setResetNote(e.target.value)}
                placeholder={
                  language === "en"
                    ? "e.g. Alhamdulillah, completed full Iqra cycle with excellent recitation!"
                    : "Contoh: Alhamdulillah, anak telah khatam Iqra dengan jayanya! Tahniah!"
                }
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Reward Bonus Notice */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2 text-xs font-extrabold text-amber-900">
              <span className="text-xl">🎁</span>
              <span>
                {language === "en"
                  ? "Cycle Reward Bonus: +100 XP & +50 Gold Coins will be awarded!"
                  : "Ganjaran Menyiapkan Kitaran: +100 XP & +50 Syiling Emas akan diberikan!"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 font-bold text-xs text-stone-700 cursor-pointer"
              >
                {language === "en" ? "Cancel" : "Batal"}
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === "en" ? "Confirm & Start New Cycle" : "Sahkan & Mula Kitaran Baru"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
