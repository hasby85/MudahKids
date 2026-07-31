import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { HAFAZAN_SURAHS } from "../data/hafazanData";
import { SurahHafazan, HafazanVerse } from "../types";
import confetti from "canvas-confetti";
import {
  BookOpen,
  CheckCircle2,
  Volume2,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Trophy,
  Crown,
  Play,
  Award,
  ArrowLeft,
  ChevronRight,
  Zap,
  HelpCircle
} from "lucide-react";

export const HafazanLearningModule: React.FC = () => {
  const { language, activeChild, updateChildProfile, showToast, soundEnabled } = useApp();

  const [selectedSurah, setSelectedSurah] = useState<SurahHafazan | null>(null);
  const [activeTab, setActiveTab] = useState<"read" | "hide_test" | "quiz">("read");

  // State for Hide & Reveal mode
  const [hideArabic, setHideArabic] = useState(false);
  const [hideRumi, setHideRumi] = useState(true);
  const [hideTranslation, setHideTranslation] = useState(true);
  const [revealedVerses, setRevealedVerses] = useState<Record<number, boolean>>({});

  // Audio Playback State
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<"normal" | "slow">("normal");

  // Verse Order Quiz State
  const [quizShuffledVerses, setQuizShuffledVerses] = useState<HafazanVerse[]>([]);
  const [quizSelectedVerses, setQuizSelectedVerses] = useState<HafazanVerse[]>([]);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);

  // Exclusive Title Modal
  const [showHafizTitleModal, setShowHafizTitleModal] = useState(false);

  if (!activeChild) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 max-w-lg mx-auto my-8 space-y-4">
        <div className="text-4xl">📜</div>
        <h3 className="font-black text-lg text-stone-900">
          {language === "en" ? "No Active Child Profile" : "Tiada Profil Anak Aktif"}
        </h3>
        <p className="text-xs text-stone-500">
          {language === "en"
            ? "Please select or create a child profile to access the Hafazan Module."
            : "Sila pilih atau cipta profil anak untuk memulakan Modul Hafazan."}
        </p>
      </div>
    );
  }

  // Get current completed surahs
  const completedSurahIds = activeChild.hafazanProgress?.completedSurahIds || [];
  const verseProgressMap = activeChild.hafazanProgress?.verseProgress || {};

  const totalSurahs = HAFAZAN_SURAHS.length;
  const completedCount = completedSurahIds.length;
  const isAllCompleted = completedCount === totalSurahs;

  // Title name based on child gender
  const hafizTitleName = activeChild.gender === "boy" ? "Hafiz Cilik" : "Hafizah Cilik";

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Audio Reference
  const currentAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlayingAyat(null);
  };

  const pad3 = (num: number) => num.toString().padStart(3, "0");

  const speakTextFallback = (text: string, lang = "ar-SA") => {
    if (!("speechSynthesis" in window)) {
      showToast("Gagal memainkan audio.", "error");
      setPlayingAyat(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = audioSpeed === "slow" ? 0.65 : 0.85;

    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith("ar"));
    if (arVoice) utterance.voice = arVoice;

    utterance.onend = () => setPlayingAyat(null);
    utterance.onerror = () => setPlayingAyat(null);

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayAyat = (verse: HafazanVerse, repeatCount = 1) => {
    if (!selectedSurah) return;
    stopAudio();

    setPlayingAyat(verse.ayatNumber);

    const surahPadded = pad3(selectedSurah.number);
    const versePadded = pad3(verse.ayatNumber);
    const mp3Url = `https://everyayah.com/data/Alafasy_128kbps/${surahPadded}${versePadded}.mp3`;

    let playCount = 0;

    const audio = new Audio(mp3Url);
    audio.playbackRate = audioSpeed === "slow" ? 0.8 : 1.0;
    currentAudioRef.current = audio;

    const playNext = () => {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          playCount++;
        })
        .catch((err) => {
          console.warn("EveryAyah MP3 play error, falling back to Web Speech", err);
          speakTextFallback(verse.arabicText, "ar-SA");
        });
    };

    audio.onended = () => {
      if (playCount < repeatCount) {
        setTimeout(playNext, 800);
      } else {
        setPlayingAyat(null);
        currentAudioRef.current = null;
      }
    };

    audio.onerror = () => {
      console.warn("Failed to load MP3 from EveryAyah, trying fallback...");
      speakTextFallback(verse.arabicText, "ar-SA");
    };

    playNext();
  };

  const handleToggleVerseProgress = (surahId: string, ayatNumber: number) => {
    const currentSurahVerses = verseProgressMap[surahId] || [];
    const exists = currentSurahVerses.includes(ayatNumber);
    const updatedVerses = exists
      ? currentSurahVerses.filter((v) => v !== ayatNumber)
      : [...currentSurahVerses, ayatNumber];

    const updatedVerseMap = {
      ...verseProgressMap,
      [surahId]: updatedVerses
    };

    updateChildProfile({
      hafazanProgress: {
        completedSurahIds,
        verseProgress: updatedVerseMap
      }
    });

    if (!exists) {
      showToast(`Ayat ${ayatNumber} ditanda sebagai Telah Dihafal! 🎉`, "success");
    }
  };

  const handleCompleteSurah = (surah: SurahHafazan) => {
    if (completedSurahIds.includes(surah.id)) {
      showToast(`Surah ${surah.nameMalay} telah pun dihafal sepenuhnya!`, "info");
      return;
    }

    const updatedCompleted = [...completedSurahIds, surah.id];
    const newTotalCompleted = updatedCompleted.length;

    // Check if child reached all 10 surahs to award exclusive "Hafiz Cilik" title!
    let awardedTitle = activeChild.activeTitle;
    let titleGrantedNow = false;

    if (newTotalCompleted === totalSurahs && activeChild.activeTitle !== hafizTitleName) {
      awardedTitle = hafizTitleName;
      titleGrantedNow = true;
    }

    updateChildProfile({
      xp: activeChild.xp + 100,
      coins: activeChild.coins + 30,
      hafazanProgress: {
        completedSurahIds: updatedCompleted,
        verseProgress: {
          ...verseProgressMap,
          [surah.id]: surah.verses.map((v) => v.ayatNumber)
        }
      },
      activeTitle: awardedTitle
    });

    triggerConfetti();

    if (titleGrantedNow) {
      setShowHafizTitleModal(true);
    } else {
      showToast(
        `Tahniah! Surah ${surah.nameMalay} disahkan Hafal! +100 XP & +30 Syiling!`,
        "success"
      );
    }
  };

  const handleInitQuiz = (surah: SurahHafazan) => {
    // Shuffle verses for ordering test
    const shuffled = [...surah.verses].sort(() => Math.random() - 0.5);
    setQuizShuffledVerses(shuffled);
    setQuizSelectedVerses([]);
    setQuizResult(null);
  };

  const handlePickQuizVerse = (verse: HafazanVerse) => {
    if (quizSelectedVerses.some((v) => v.ayatNumber === verse.ayatNumber)) return;
    const newSelected = [...quizSelectedVerses, verse];
    setQuizSelectedVerses(newSelected);

    // Check if all selected
    if (newSelected.length === selectedSurah?.verses.length) {
      const isCorrect = newSelected.every((v, index) => v.ayatNumber === index + 1);
      if (isCorrect) {
        setQuizResult("correct");
        triggerConfetti();
        updateChildProfile({
          xp: activeChild.xp + 40,
          coins: activeChild.coins + 15
        });
        showToast("Luar Biasa! Susunan ayat tepat sekali! +40 XP & +15 Syiling!", "success");
      } else {
        setQuizResult("wrong");
        showToast("Susunan kurang tepat. Sila cuba lagi!", "error");
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-emerald-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border-2 border-emerald-600 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none text-9xl flex items-center justify-center font-serif pr-6">
          📖
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-stone-900 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Modul Hafazan Interaktif
            </span>

            {activeChild.activeTitle && (
              <span className="bg-gradient-to-r from-amber-300 to-yellow-400 text-stone-900 font-black text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-200">
                <Crown className="w-3.5 h-3.5 text-amber-900" />
                {activeChild.activeTitle}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-amber-300 tracking-tight">
              📜 Modul Hafazan Surah-Surah Pilihan
            </h1>
            <p className="text-xs md:text-sm text-emerald-100 leading-relaxed mt-1">
              Hafal 10 Surah Pilihan untuk mendapat Gelaran Eksklusif{" "}
              <span className="text-amber-300 font-bold underline decoration-amber-400">
                {hafizTitleName}
              </span>
              ! Dilengkapi audio bacaan, mod uji hafazan, dan kuiz susun ayat interaktif.
            </p>
          </div>

          {/* Overall Hafazan Progress Bar */}
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-emerald-200">
                Kemajuan Hafazan {activeChild.name}: {completedCount} / {totalSurahs} Surah
              </span>
              <span className="text-amber-300">
                {Math.round((completedCount / totalSurahs) * 100)}% Selesai
              </span>
            </div>

            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${(completedCount / totalSurahs) * 100}%` }}
              />
            </div>

            {isAllCompleted ? (
              <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold pt-1">
                <Crown className="w-4 h-4" />
                <span>
                  Tahniah! Anda telah dikurniakan gelaran eksklusif 🌟 <strong>{hafizTitleName}</strong>!
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-emerald-200">
                Hafal lagi {totalSurahs - completedCount} surah untuk membuka gelaran eksklusif{" "}
                <strong className="text-amber-300">{hafizTitleName}</strong>.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Surah Detail Studio OR Surah List */}
      {selectedSurah ? (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <button
              onClick={() => {
                stopAudio();
                setSelectedSurah(null);
              }}
              className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Senarai Surah</span>
            </button>

            <div className="text-center">
              <h2 className="text-xl font-black text-stone-900 flex items-center justify-center gap-2">
                <span>Surah {selectedSurah.nameMalay}</span>
                <span className="font-serif text-2xl text-emerald-700">
                  ({selectedSurah.nameArabic})
                </span>
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Surah Ke-{selectedSurah.number} • {selectedSurah.totalAyat} Ayat • {selectedSurah.meaning}
              </p>
            </div>

            <div>
              {completedSurahIds.includes(selectedSurah.id) ? (
                <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✓ Sudah Dihafal</span>
                </div>
              ) : (
                <button
                  onClick={() => handleCompleteSurah(selectedSurah)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-900 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300"
                >
                  <Award className="w-4 h-4" />
                  <span>Tanda Selesai Hafal Surah (+100 XP)</span>
                </button>
              )}
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <strong className="font-black block text-amber-950">Fadhilat & Keutamaan Surah:</strong>
              <p className="leading-relaxed mt-0.5">{selectedSurah.description}</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-100 p-2 rounded-2xl">
            <div className="flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveTab("read")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "read"
                    ? "bg-emerald-600 text-white font-black shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>1. Baca & Dengar</span>
              </button>

              <button
                onClick={() => setActiveTab("hide_test")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "hide_test"
                    ? "bg-emerald-600 text-white font-black shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <EyeOff className="w-4 h-4" />
                <span>2. Uji Hafazan (Sembunyi Teks)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("quiz");
                  handleInitQuiz(selectedSurah);
                }}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "quiz"
                    ? "bg-emerald-600 text-white font-black shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>3. Kuiz Susun Ayat</span>
              </button>
            </div>

            {/* Audio Speed Control */}
            {activeTab === "read" && (
              <div className="flex items-center gap-2 text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                <span className="text-stone-500">Kelajuan Audio:</span>
                <button
                  onClick={() => setAudioSpeed("normal")}
                  className={`px-2 py-0.5 rounded-md ${
                    audioSpeed === "normal"
                      ? "bg-emerald-600 text-white font-extrabold"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  Biasa
                </button>
                <button
                  onClick={() => setAudioSpeed("slow")}
                  className={`px-2 py-0.5 rounded-md ${
                    audioSpeed === "slow"
                      ? "bg-emerald-600 text-white font-extrabold"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  Perlahan 🐢
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: Baca & Dengar (Read & Listen) */}
          {activeTab === "read" && (
            <div className="space-y-4">
              {selectedSurah.verses.map((verse) => {
                const currentSurahVerses = verseProgressMap[selectedSurah.id] || [];
                const isVerseDone = currentSurahVerses.includes(verse.ayatNumber);
                const isPlaying = playingAyat === verse.ayatNumber;

                return (
                  <div
                    key={verse.ayatNumber}
                    className={`p-6 rounded-3xl border transition-all space-y-4 ${
                      isVerseDone
                        ? "bg-emerald-50/70 border-emerald-300"
                        : "bg-white border-stone-200 hover:border-emerald-200"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                          {verse.ayatNumber}
                        </span>
                        <span className="text-xs font-bold text-stone-500">
                          Ayat Ke-{verse.ayatNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Audio Play Buttons */}
                        <button
                          onClick={() => handlePlayAyat(verse, 1)}
                          className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                            isPlaying
                              ? "bg-amber-400 text-stone-900 shadow-md animate-pulse"
                              : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                          }`}
                        >
                          <Volume2 className="w-4 h-4 text-emerald-700" />
                          <span>{isPlaying ? "Membaca..." : "🔊 Dengar"}</span>
                        </button>

                        <button
                          onClick={() => handlePlayAyat(verse, 3)}
                          className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-extrabold text-xs flex items-center gap-1 border border-teal-200 cursor-pointer"
                        >
                          <span>🔁 Ulang 3x</span>
                        </button>

                        {/* Toggle Checkbox */}
                        <button
                          onClick={() =>
                            handleToggleVerseProgress(selectedSurah.id, verse.ayatNumber)
                          }
                          className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            isVerseDone
                              ? "bg-emerald-600 text-white"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isVerseDone ? "✓ Hafal" : "Tanda Hafal"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Arabic Verse Display */}
                    <div className="text-right py-2">
                      <p className="font-serif text-2xl md:text-3xl font-bold leading-loose text-stone-900 tracking-wide">
                        {verse.arabicText}
                      </p>
                    </div>

                    {/* Rumi Transliteration */}
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs text-stone-700 font-semibold space-y-1">
                      <span className="text-[10px] font-black uppercase text-teal-700 block">
                        Sebutan Rumi:
                      </span>
                      <p className="italic">{verse.latinText}</p>
                    </div>

                    {/* Translation */}
                    <div className="text-xs text-stone-600 font-medium space-y-1">
                      <span className="text-[10px] font-black uppercase text-stone-400 block">
                        Terjemahan Bahasa Melayu:
                      </span>
                      <p className="leading-relaxed">{verse.translation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Mod Uji Hafazan (Hide & Reveal) */}
          {activeTab === "hide_test" && (
            <div className="space-y-6">
              {/* Controls Bar */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-teal-950 text-sm">
                    Mod Latihan Ingatan & Sembunyi Teks 🙈
                  </h4>
                  <p className="text-xs text-teal-800">
                    Sembunyikan teks untuk menguji ingatan anda, kemudian tekan petak untuk mendedahkan bacaan!
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <button
                    onClick={() => setHideArabic(!hideArabic)}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      hideArabic
                        ? "bg-teal-700 text-white border-teal-800 font-black"
                        : "bg-white text-stone-700 border-stone-300"
                    }`}
                  >
                    {hideArabic ? "🙈 Sembunyi Arab" : "👁️ Tunjuk Arab"}
                  </button>

                  <button
                    onClick={() => setHideRumi(!hideRumi)}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      hideRumi
                        ? "bg-teal-700 text-white border-teal-800 font-black"
                        : "bg-white text-stone-700 border-stone-300"
                    }`}
                  >
                    {hideRumi ? "🙈 Sembunyi Rumi" : "👁️ Tunjuk Rumi"}
                  </button>

                  <button
                    onClick={() => setHideTranslation(!hideTranslation)}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      hideTranslation
                        ? "bg-teal-700 text-white border-teal-800 font-black"
                        : "bg-white text-stone-700 border-stone-300"
                    }`}
                  >
                    {hideTranslation ? "🙈 Sembunyi Maksud" : "👁️ Tunjuk Maksud"}
                  </button>
                </div>
              </div>

              {/* Verses Grid for Hide/Reveal */}
              <div className="space-y-4">
                {selectedSurah.verses.map((verse) => {
                  const isRevealed = revealedVerses[verse.ayatNumber];

                  return (
                    <div
                      key={verse.ayatNumber}
                      onClick={() =>
                        setRevealedVerses((prev) => ({
                          ...prev,
                          [verse.ayatNumber]: !prev[verse.ayatNumber]
                        }))
                      }
                      className={`p-6 rounded-3xl border-2 transition-all cursor-pointer space-y-3 ${
                        isRevealed
                          ? "bg-white border-emerald-400 shadow-md"
                          : "bg-stone-50 border-dashed border-stone-300 hover:border-teal-400"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                        <span className="w-7 h-7 rounded-full bg-stone-800 text-white text-xs flex items-center justify-center font-black">
                          {verse.ayatNumber}
                        </span>
                        <span>
                          {isRevealed
                            ? "✓ Teks Didedahkan (Tekan untuk sembunyi)"
                            : "👉 Tekan Petak Ini untuk Dedah Bacaan"}
                        </span>
                      </div>

                      {/* Arabic Text Display or Blurred Mask */}
                      <div className="text-right py-2">
                        {hideArabic && !isRevealed ? (
                          <div className="py-3 px-4 rounded-xl bg-stone-200 text-stone-400 text-center font-black text-sm italic">
                            ❓ [ Ayat Arab Tersembunyi - Cuba Ingat Dalam Hati ]
                          </div>
                        ) : (
                          <p className="font-serif text-2xl md:text-3xl font-bold leading-loose text-stone-900">
                            {verse.arabicText}
                          </p>
                        )}
                      </div>

                      {/* Rumi Display */}
                      {(!hideRumi || isRevealed) && (
                        <p className="text-xs text-teal-800 font-semibold italic bg-teal-50 p-2.5 rounded-xl">
                          {verse.latinText}
                        </p>
                      )}

                      {/* Translation Display */}
                      {(!hideTranslation || isRevealed) && (
                        <p className="text-xs text-stone-600 font-medium">
                          {verse.translation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Kuiz Susun Ayat (Interactive Verse Ordering Game) */}
          {activeTab === "quiz" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <h4 className="font-black text-amber-950 text-sm flex items-center gap-2">
                  <span>🧩 Permainan Susun Ayat Surah {selectedSurah.nameMalay}</span>
                </h4>
                <p className="text-xs text-amber-800">
                  Tekan blok ayat di bawah mengikut susunan yang betul dari Ayat 1 sehingga Ayat Akhir.
                </p>
              </div>

              {/* Progress of Selected Verses */}
              <div className="space-y-3">
                <h5 className="font-extrabold text-xs uppercase text-stone-500">
                  Susunan Pilihan Anda ({quizSelectedVerses.length} / {selectedSurah.verses.length} Ayat):
                </h5>

                {quizSelectedVerses.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 text-center text-stone-400 text-xs font-bold">
                    Pilih ayat dari pilihan di bawah untuk menyusun...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {quizSelectedVerses.map((v, idx) => (
                      <div
                        key={v.ayatNumber}
                        className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-4"
                      >
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="font-serif text-lg font-bold text-stone-900 text-right w-full">
                          {v.arabicText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quiz Results Banner */}
              {quizResult === "correct" && (
                <div className="p-5 rounded-2xl bg-emerald-600 text-white text-center space-y-2 shadow-lg animate-bounce">
                  <h4 className="font-black text-lg">🎉 Tahniah! Susunan Anda 100% Tepat!</h4>
                  <p className="text-xs text-emerald-100">
                    Anda mendapat ganjaran +40 XP & +15 Syiling!
                  </p>
                  <button
                    onClick={() => handleInitQuiz(selectedSurah)}
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-xs shadow-md cursor-pointer mt-2"
                  >
                    Main Semula Kuiz
                  </button>
                </div>
              )}

              {quizResult === "wrong" && (
                <div className="p-5 rounded-2xl bg-rose-600 text-white text-center space-y-2 shadow-lg">
                  <h4 className="font-black text-lg">❌ Susunan Kurang Tepat</h4>
                  <p className="text-xs text-rose-100">
                    Jangan putus asa, mari cuba semula susun ayat dengan betul!
                  </p>
                  <button
                    onClick={() => handleInitQuiz(selectedSurah)}
                    className="px-5 py-2 rounded-xl bg-white text-rose-900 font-extrabold text-xs shadow-md cursor-pointer mt-2"
                  >
                    Cuba Semula 🔄
                  </button>
                </div>
              )}

              {/* Shuffled Verses Selection Pool */}
              {quizResult === null && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-xs uppercase text-stone-500">
                      Pilihan Ayat (Sila Tekan Mengikut Urutan):
                    </h5>
                    <button
                      onClick={() => handleInitQuiz(selectedSurah)}
                      className="text-xs font-bold text-teal-700 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Set Semula
                    </button>
                  </div>

                  <div className="space-y-2">
                    {quizShuffledVerses.map((verse) => {
                      const isPicked = quizSelectedVerses.some(
                        (v) => v.ayatNumber === verse.ayatNumber
                      );

                      return (
                        <button
                          key={verse.ayatNumber}
                          disabled={isPicked}
                          onClick={() => handlePickQuizVerse(verse)}
                          className={`w-full p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                            isPicked
                              ? "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-50"
                              : "bg-white border-stone-200 hover:border-amber-400 hover:shadow-md"
                          }`}
                        >
                          <p className="font-serif text-xl font-bold text-stone-900">
                            {verse.arabicText}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* SURAH LISTING GRID */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-stone-900">
                Senarai 10 Surah Hafazan Pilihan 📖
              </h2>
              <p className="text-xs text-stone-500">
                Pilih mana-mana surah di bawah untuk memulakan latihan bacaan, mendengarkan audio, atau ujian hafazan.
              </p>
            </div>

            <div className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3.5 py-2 rounded-2xl border border-amber-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-700" />
              <span>
                {completedCount} daripada {totalSurahs} Surah Selesai
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {HAFAZAN_SURAHS.map((surah) => {
              const isCompleted = completedSurahIds.includes(surah.id);
              const currentVersesDone = (verseProgressMap[surah.id] || []).length;
              const progressPercent = Math.round((currentVersesDone / surah.totalAyat) * 100);

              return (
                <div
                  key={surah.id}
                  onClick={() => setSelectedSurah(surah)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-lg ${
                    isCompleted
                      ? "bg-emerald-50/80 border-emerald-300"
                      : currentVersesDone > 0
                      ? "bg-amber-50/60 border-amber-300"
                      : "bg-white border-stone-200 hover:border-teal-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 font-black text-xs flex items-center justify-center shadow-2xs">
                          {surah.number}
                        </span>
                        <span className="font-serif text-2xl font-bold text-emerald-800">
                          {surah.nameArabic}
                        </span>
                      </div>

                      {isCompleted ? (
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ✓ Hafal
                        </span>
                      ) : currentVersesDone > 0 ? (
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-400 text-stone-900">
                          ⏳ Sedang Hafal
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
                          Belum Mula
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-black text-lg text-stone-900">
                        Surah {surah.nameMalay}
                      </h3>
                      <p className="text-xs font-semibold text-stone-500">
                        Maksud: "{surah.meaning}" • {surah.totalAyat} Ayat
                      </p>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {surah.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-stone-500">
                        Kemajuan Verse: {currentVersesDone} / {surah.totalAyat} Ayat
                      </span>
                      <span className="text-emerald-700">{progressPercent}%</span>
                    </div>

                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-teal-800">
                      <span>Mula Latihan Hafazan</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EXCLUSIVE TITLE CELEBRATION MODAL ("HAFIZ CILIK") */}
      {showHafizTitleModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 rounded-3xl max-w-md w-full p-8 text-center text-stone-900 shadow-2xl border-4 border-amber-200 space-y-6 relative overflow-hidden animate-in fade-in zoom-in">
            <div className="w-24 h-24 rounded-full bg-white text-stone-900 flex items-center justify-center text-5xl mx-auto shadow-xl border-4 border-amber-300">
              👑
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider bg-stone-900 text-amber-300 px-3 py-1 rounded-full inline-block">
                Pencapaian Agung MudahKids
              </span>
              <h2 className="text-3xl font-black text-stone-950">
                TAHNIAH, {activeChild.name.toUpperCase()}!
              </h2>
              <p className="text-xs text-stone-900 font-bold leading-relaxed">
                Anda telah berjaya menghafal kesemua 10 Surah Pilihan dalam Modul Hafazan! Dengan ini anda dikurniakan gelaran eksklusif:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900 text-amber-300 border-2 border-amber-300 space-y-1 shadow-lg">
              <span className="text-[10px] font-black uppercase text-amber-200">
                Gelaran Rasmi Dianugerahkan:
              </span>
              <div className="text-2xl font-black tracking-wide text-amber-300">
                🌟 {hafizTitleName} 🌟
              </div>
            </div>

            <button
              onClick={() => setShowHafizTitleModal(false)}
              className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-black text-xs shadow-xl cursor-pointer"
            >
              Terima Gelaran & Teruskan!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
