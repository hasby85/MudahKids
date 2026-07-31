import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { JAWI_LEVELS_DATA } from "../data/initialData";
import { JawiLevel, JawiLesson, JawiQuizQuestion } from "../types";
import {
  Volume2,
  Lock,
  Unlock,
  CheckCircle2,
  RotateCcw,
  Trophy,
  Sparkles,
  HelpCircle
} from "lucide-react";

// Phonetic Arabic dictionary for Jawi characters, letters, and words
const JAWI_ARABIC_PHONETICS: Record<string, string> = {
  "ا": "أَلِف",
  "ب": "بَاء",
  "ت": "تَاء",
  "ث": "ثَاء",
  "ج": "جِيم",
  "چ": "تَشَا",
  "ح": "حَاء",
  "خ": "خَاء",
  "د": "دَال",
  "ذ": "ذَال",
  "ر": "رَاء",
  "ز": "زَاي",
  "س": "سِين",
  "ش": "شِين",
  "ص": "صَاد",
  "ض": "ضَاد",
  "ط": "طَاء",
  "ظ": "ظَاء",
  "ع": "عَيْن",
  "غ": "غَيْن",
  "ڠ": "نْغَا",
  "ف": "فَاء",
  "ڤ": "بَا",
  "ق": "قَاف",
  "ك": "كَاف",
  "ک": "كَاف",
  "ݢ": "كَا",
  "ل": "لاَم",
  "م": "مِيم",
  "ن": "نُون",
  "و": "وَاو",
  "ه": "هَاء",
  "ء": "هَمْزَة",
  "ي": "يَاء",
  "ڽ": "نِيَا",
  "alif": "أَلِف",
  "ba": "بَاء",
  "ta": "تَاء",
  "sa": "ثَاء",
  "jim": "جِيم",
  "ca": "تَشَا",
  "ha": "حَاء",
  "kha": "خَاء",
  "dal": "دَال",
  "dzal": "ذَال",
  "ra": "رَاء",
  "zai": "زَاي",
  "sin": "سِين",
  "syin": "شِين",
  "sad": "صَاد",
  "dad": "ضَاد",
  "nga": "نْغَا",
  "fa": "فَاء",
  "pa": "بَا",
  "ga": "كَا",
  "nya": "نِيَا",
  "باجو": "بَاجُو",
  "بوكو": "بُوكُو",
  "ناسي": "نَاسِي",
  "بولا": "بُولاَ",
  "ݢاجه": "جَاجَه",
  "ڤوكوق": "بُوكُوق",
  "با": "بَا",
  "بي": "بِي",
  "بو": "بُو",
  "جا": "جَا",
  "جي": "جِي",
  "جو": "جُو",
  "تا": "تَا",
  "تي": "تِي",
  "تو": "تُو"
};

const playAudioChime = (freq = 523.25) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // ignore audio restriction
  }
};

export const JawiLearningModule: React.FC = () => {
  const { language, activeChild, updateChildProfile, showToast } = useApp();

  // Child's jawi progress
  const jawiProgress = activeChild.jawiProgress || { unlockedLevel: 1, completedLevels: [] };
  const unlockedLevel = jawiProgress.unlockedLevel || 1;
  const levelActivities = jawiProgress.levelActivities || {};

  // Selected Level Index (0 to 6)
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const currentLevel: JawiLevel = JAWI_LEVELS_DATA[selectedLevelIdx] || JAWI_LEVELS_DATA[0];

  // Current level completion status
  const currentLevelNum = currentLevel.levelNumber;
  const currentLevelStatus = levelActivities[currentLevelNum] || { tracing: false, test: false, builder: false };

  // Sub-tabs within current level: "learn" | "test" | "builder"
  const [activeSubTab, setActiveSubTab] = useState<"learn" | "test" | "builder">("learn");

  // Selected Lesson inside current level
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const currentLesson: JawiLesson = currentLevel.lessons[selectedLessonIdx] || currentLevel.lessons[0];

  // Tracing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Level Test State
  const [testQuestionIdx, setTestQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  // Word Builder State
  const [builderTargetIdx, setBuilderTargetIdx] = useState(0);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  // Jawi Audio Reference
  const jawiAudioRef = useRef<HTMLAudioElement | null>(null);

  // Arabic / Jawi Audio Pronunciation for Jawi Letters & Words
  const playArabicSound = (text: string) => {
    playAudioChime(659.25);
    if (!text) return;

    if (jawiAudioRef.current) {
      jawiAudioRef.current.pause();
      jawiAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const cleanText = text.trim();
    const spokenText =
      JAWI_ARABIC_PHONETICS[cleanText] ||
      JAWI_ARABIC_PHONETICS[cleanText.toLowerCase()] ||
      cleanText;

    const encodeQuery = encodeURIComponent(spokenText);
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeQuery}&tl=ar&client=tw-ob`;

    const audio = new Audio(googleTtsUrl);
    jawiAudioRef.current = audio;

    let playedOk = false;

    audio.play().then(() => {
      playedOk = true;
    }).catch((err) => {
      console.warn("Google TTS MP3 failed, falling back to Web Speech API:", err);
      fallbackWebSpeech(spokenText);
    });

    audio.onerror = () => {
      if (!playedOk) {
        fallbackWebSpeech(spokenText);
      }
    };
  };

  const fallbackWebSpeech = (spokenText: string) => {
    if (!("speechSynthesis" in window)) return;
    try {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = "ar-SA";
      utterance.rate = 0.8;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const arVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith("ar")) ||
        voices.find((v) => v.lang.toLowerCase().startsWith("ms")) ||
        voices.find((v) => v.lang.toLowerCase().startsWith("id"));
      if (arVoice) {
        utterance.voice = arVoice;
      }

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    } catch (e) {
      console.error("SpeechSynthesis error:", e);
    }
  };

  // Smart Speech for Question Prompt (Malay/English voice for question, Arabic tone for Jawi letter)
  const speakQuestion = (q: JawiQuizQuestion) => {
    playAudioChime(587.33);
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const isEn = language === "en";
    const questionText = isEn ? (q.questionTextEn || q.questionText) : q.questionText;

    // Phase 1: Speak question text in Malay or English
    const promptUtterance = new SpeechSynthesisUtterance(questionText);
    promptUtterance.rate = 0.88;

    if (isEn) {
      promptUtterance.lang = "en-US";
      const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
      if (enVoice) promptUtterance.voice = enVoice;
    } else {
      promptUtterance.lang = "ms-MY";
      const msVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith("ms") || v.lang.toLowerCase().startsWith("id")
      );
      if (msVoice) promptUtterance.voice = msVoice;
    }

    // Phase 2: Speak Jawi letter or display text in authentic Arabic tone
    if (q.jawiDisplay) {
      promptUtterance.onend = () => {
        const cleanJawi = q.jawiDisplay.trim();
        const arabicPhonetic = JAWI_ARABIC_PHONETICS[cleanJawi] || cleanJawi;

        const arabicUtterance = new SpeechSynthesisUtterance(arabicPhonetic);
        arabicUtterance.lang = "ar-SA";
        arabicUtterance.rate = 0.72;
        const arVoice = voices.find((v) => v.lang.toLowerCase().startsWith("ar"));
        if (arVoice) arabicUtterance.voice = arVoice;

        window.speechSynthesis.speak(arabicUtterance);
      };
    }

    window.speechSynthesis.speak(promptUtterance);
  };

  // Reset state when level or sub-tab changes
  useEffect(() => {
    setSelectedLessonIdx(0);
    setTestQuestionIdx(0);
    setSelectedOption(null);
    setTestScore(0);
    setTestFinished(false);
    setSelectedParts([]);
    setBuilderTargetIdx(0);
  }, [selectedLevelIdx, activeSubTab]);

  // Helper to mark an activity complete & check if all 3 are finished to unlock next level
  const markActivityComplete = (activity: "tracing" | "test" | "builder") => {
    const updatedActivities = {
      ...levelActivities,
      [currentLevelNum]: {
        ...(levelActivities[currentLevelNum] || {}),
        [activity]: true
      }
    };

    const currentAct = updatedActivities[currentLevelNum];
    const allThreeDone = currentAct.tracing && currentAct.test && currentAct.builder;

    let nextUnlocked = unlockedLevel;
    let newCompletedLevels = [...(jawiProgress.completedLevels || [])];

    if (allThreeDone) {
      if (!newCompletedLevels.includes(currentLevelNum)) {
        newCompletedLevels.push(currentLevelNum);
      }
      nextUnlocked = Math.max(unlockedLevel, currentLevelNum + 1);
    }

    updateChildProfile({
      jawiProgress: {
        unlockedLevel: nextUnlocked,
        completedLevels: newCompletedLevels,
        levelActivities: updatedActivities
      }
    });

    if (allThreeDone && unlockedLevel < currentLevelNum + 1) {
      showToast(
        language === "en"
          ? `🎉 Congratulations! All 3 tests for Level ${currentLevelNum} completed! Level ${currentLevelNum + 1} is now unlocked!`
          : `🎉 Tahniah! Ketiga-tiga ujian Tahap ${currentLevelNum} telah selesai! Tahap ${currentLevelNum + 1} kini DIBUKA!`,
        "success"
      );
    }
  };

  // Setup Tracing Canvas (WITHOUT green horizontal & vertical grid lines)
  useEffect(() => {
    if (activeSubTab !== "learn") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clean canvas background
    ctx.fillStyle = "#FAF9F5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render faint guide letter only (NO grid lines)
    ctx.font = "bold 140px 'Traditional Arabic', 'Scheherazade New', serif, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(currentLesson.letter, canvas.width / 2, canvas.height / 2 - 5);
  }, [selectedLevelIdx, selectedLessonIdx, activeSubTab, currentLesson]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FAF9F5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 140px 'Traditional Arabic', 'Scheherazade New', serif, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(currentLesson.letter, canvas.width / 2, canvas.height / 2 - 5);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#059669"; // Emerald stroke

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const completeTracing = () => {
    updateChildProfile({
      coins: activeChild.coins + 10,
      xp: activeChild.xp + 20
    });

    markActivityComplete("tracing");

    showToast(
      language === "en"
        ? "Tracing completed! +10 Coins & +20 XP awarded."
        : "Tekapan selesai! +10 Syiling & +20 XP diperoleh.",
      "success"
    );

    if (selectedLessonIdx < currentLevel.lessons.length - 1) {
      setSelectedLessonIdx(selectedLessonIdx + 1);
    }
  };

  // Handle Level Selection
  const handleSelectLevel = (idx: number) => {
    const targetLevelNum = idx + 1;
    if (targetLevelNum > unlockedLevel) {
      showToast(
        language === "en"
          ? `🔒 Level ${targetLevelNum} is locked! Complete all 3 tests (Tracing, Level Test & Word Builder) in Level ${targetLevelNum - 1} first.`
          : `🔒 Tahap ${targetLevelNum} terkunci! Anda perlu selesaikan ketiga-tiga ujian (Tekap, Ujian Tahap & Bina Perkataan) di Tahap ${targetLevelNum - 1} terlebih dahulu.`,
        "info"
      );
      return;
    }
    setSelectedLevelIdx(idx);
  };

  // Handle Level Quiz Answer
  const handleAnswerTest = (option: string) => {
    setSelectedOption(option);
    const questions = currentLevel.quizQuestions;
    const currentQ = questions[testQuestionIdx];

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setTestScore((prev) => prev + 1);
      showToast(
        language === "en" ? "Correct answer! Syabas!" : "Jawapan tepat! Syabas!",
        "success"
      );
    } else {
      showToast(
        language === "en"
          ? `Incorrect. Correct answer: ${currentQ.correctAnswer}`
          : `Kurang tepat. Jawapan betul: ${currentQ.correctAnswer}`,
        "info"
      );
    }

    setTimeout(() => {
      if (testQuestionIdx < questions.length - 1) {
        setTestQuestionIdx((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setTestFinished(true);
        const finalScore = testScore + (isCorrect ? 1 : 0);
        const passThreshold = Math.ceil(questions.length / 2);
        const passed = finalScore >= passThreshold;

        if (passed) {
          updateChildProfile({
            coins: activeChild.coins + 30,
            xp: activeChild.xp + 50
          });

          markActivityComplete("test");

          showToast(
            language === "en"
              ? `🎉 Passed Level ${currentLevel.levelNumber} Quiz Test! (+30 Coins & +50 XP)`
              : `🎉 Lulus Ujian Tahap ${currentLevel.levelNumber}! (+30 Syiling & +50 XP)`,
            "success"
          );
        }
      }
    }, 1200);
  };

  // Current Word Builder Target
  const currentBuilderLesson = currentLevel.lessons[builderTargetIdx] || currentLevel.lessons[0];
  const targetJawiWord = currentBuilderLesson.jawiWord;
  const targetWordLetters = Array.from(targetJawiWord);

  // Available selectable letters: target letters + a couple of distractors from other lessons in this level
  const distractorLetters = currentLevel.lessons
    .map((l) => l.letter)
    .filter((lettr) => !targetWordLetters.includes(lettr))
    .slice(0, 3);

  const availableLetterTiles = [...targetWordLetters, ...distractorLetters].sort(
    () => (builderTargetIdx * 7) % 3 - 1
  );

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl shadow-2xs">
            ✏️
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900">
              {language === "en" ? "Progressive Jawi Learning" : "Pembelajaran Jawi Progresif"}
            </h2>
            <p className="text-stone-500 text-xs">
              {language === "en"
                ? "Master Jawi step-by-step with authentic Arabic voice audio and interactive tests."
                : "Kuasai Jawi bertahap dengan sebutan bernada Arab dan ujian komprehensif."}
            </p>
          </div>
        </div>

        {/* Unlocked Level Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
          <Trophy className="w-5 h-5 text-amber-500" />
          <div className="text-xs">
            <span className="text-stone-500 font-medium block">
              {language === "en" ? "Unlocked Level" : "Tahap Terbuka"}
            </span>
            <span className="font-extrabold text-emerald-800 text-sm">
              {unlockedLevel} / {JAWI_LEVELS_DATA.length}
            </span>
          </div>
        </div>
      </div>

      {/* LEVEL MAP / SELECTOR PATH */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-600">
          <span>{language === "en" ? "Select Level:" : "Pilih Tahap Pembelajaran:"}</span>
          <span className="text-emerald-700">
            {language === "en"
              ? "Complete all 3 tests in each level to unlock the next level"
              : "Selesaikan ketiga-tiga ujian untuk membuka tahap seterusnya"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {JAWI_LEVELS_DATA.map((lvl, idx) => {
            const isUnlocked = lvl.levelNumber <= unlockedLevel;
            const isSelected = selectedLevelIdx === idx;
            const lvlActs = levelActivities[lvl.levelNumber] || {};
            const isLevelFullyDone = lvlActs.tracing && lvlActs.test && lvlActs.builder;

            return (
              <button
                key={lvl.levelNumber}
                onClick={() => handleSelectLevel(idx)}
                className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-102"
                    : isUnlocked
                    ? "bg-emerald-50/60 text-stone-800 border-emerald-200 hover:bg-emerald-100"
                    : "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-80"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{lvl.icon}</span>
                  {isFullyCompleted(isLevelFullyDone, isUnlocked, isSelected)}
                </div>

                <div>
                  <span
                    className={`text-[10px] font-black tracking-wider uppercase block ${
                      isSelected ? "text-emerald-100" : "text-emerald-700"
                    }`}
                  >
                    Tahap {lvl.levelNumber}
                  </span>
                  <h4 className="text-xs font-bold truncate leading-tight">
                    {language === "en" ? lvl.titleEn : lvl.title.split(":")[1] || lvl.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE LEVEL DETAILS & ACTIVITY LOCK CHECKLIST */}
      <div className="bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/50 rounded-3xl p-5 border border-emerald-100 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px]">
                {currentLevel.title}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                {currentLevel.difficulty}
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium max-w-2xl">
              {language === "en" && currentLevel.descriptionEn ? currentLevel.descriptionEn : currentLevel.description}
            </p>
          </div>

          {/* Activity Sub-tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-stone-200 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setActiveSubTab("learn")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "learn"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>✏️ {language === "en" ? "Tracing & Speech" : "Tekap & Sebutan"}</span>
              {currentLevelStatus.tracing && <span className="text-amber-300">✓</span>}
            </button>
            <button
              onClick={() => setActiveSubTab("test")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "test"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>❓ {language === "en" ? "Level Test" : "Ujian Tahap"}</span>
              {currentLevelStatus.test && <span className="text-amber-300">✓</span>}
            </button>
            <button
              onClick={() => setActiveSubTab("builder")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "builder"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>🧩 {language === "en" ? "Word Builder" : "Bina Perkataan"}</span>
              {currentLevelStatus.builder && <span className="text-amber-300">✓</span>}
            </button>
          </div>
        </div>

        {/* 3-Test Requirements Banner */}
        <div className="p-3 bg-white rounded-2xl border border-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2">
          <span className="font-extrabold text-stone-700">
            {language === "en"
              ? "Requirements to unlock next level:"
              : "Syarat untuk membuka tahap seterusnya:"}
          </span>
          <div className="flex items-center gap-3 font-bold text-xs">
            <span
              className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                currentLevelStatus.tracing
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              ✏️ {language === "en" ? "Tracing" : "Tekap"} {currentLevelStatus.tracing ? "✓" : "⏳"}
            </span>
            <span
              className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                currentLevelStatus.test
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              ❓ {language === "en" ? "Level Test" : "Ujian Tahap"} {currentLevelStatus.test ? "✓" : "⏳"}
            </span>
            <span
              className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                currentLevelStatus.builder
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              🧩 {language === "en" ? "Word Builder" : "Bina Perkataan"} {currentLevelStatus.builder ? "✓" : "⏳"}
            </span>
          </div>
        </div>

        {/* SUB-TAB 1: TEKAP & SEBUTAN (TRACING & ARABIC PRONUNCIATION) */}
        {activeSubTab === "learn" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
            {/* Left Column: Tracing Canvas (Clean box without horizontal/vertical green grid lines) */}
            <div className="lg:col-span-5 flex flex-col items-center space-y-3">
              <div className="relative border-4 border-emerald-500/30 rounded-3xl overflow-hidden shadow-md bg-stone-50">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                  className="cursor-crosshair touch-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={clearCanvas}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{language === "en" ? "Clear" : "Padam"}</span>
                </button>
                <button
                  onClick={completeTracing}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === "en" ? "Complete Tracing (+10 🪙)" : "Selesai Tekap (+10 🪙)"}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Letter Info & Authentic Arabic Sound */}
            <div className="lg:col-span-7 space-y-4 p-6 bg-white rounded-3xl border border-emerald-100 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {language === "en" ? "Item" : "Item"} {selectedLessonIdx + 1} / {currentLevel.lessons.length}
                </span>

                <button
                  onClick={() => playArabicSound(currentLesson.letter || currentLesson.jawiName)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{language === "en" ? "Listen Pronunciation" : "Dengar Sebutan"}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-5xl font-black text-stone-900 font-serif">
                    {currentLesson.letter}
                  </h3>
                  <span className="text-xl font-bold text-emerald-700">
                    {currentLesson.jawiName}
                  </span>
                </div>

                <div className="inline-block bg-sky-50 border border-sky-200 text-sky-800 text-xs font-extrabold px-3 py-1 rounded-xl">
                  {currentLesson.soundHint}
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 block uppercase">
                      {language === "en" ? "Example Word" : "Contoh Perkataan"}
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-black text-stone-900 font-serif">{currentLesson.jawiWord}</span>
                      <span className="text-sm font-bold text-emerald-600">({currentLesson.latinWord})</span>
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      {language === "en" ? "Meaning:" : "Maksud:"} {currentLesson.translation}
                    </span>
                  </div>
                  <span className="text-4xl">{currentLesson.imageEmoji}</span>
                </div>
              </div>

              {/* Lesson Picker buttons */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-stone-500 block">
                  {language === "en" ? "Select Lesson Item:" : "Pilih Item Latihan:"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentLevel.lessons.map((l, idx) => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLessonIdx(idx)}
                      className={`px-3.5 py-2 rounded-xl font-black text-base font-serif flex items-center justify-center transition-all cursor-pointer ${
                        selectedLessonIdx === idx
                          ? "bg-emerald-600 text-white shadow-md scale-105"
                          : "bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {l.letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: UJIAN TAHAP (LEVEL TEST) */}
        {activeSubTab === "test" && (
          <div className="p-6 bg-white rounded-3xl border border-sky-100 max-w-2xl mx-auto space-y-6 text-center">
            {!testFinished ? (
              <>
                <div className="flex items-center justify-between text-xs font-extrabold text-stone-500 border-b pb-3">
                  <span>
                    {language === "en" ? "Question" : "Soalan Ujian Tahap"} {testQuestionIdx + 1} / {currentLevel.quizQuestions.length}
                  </span>
                  <span className="text-emerald-700">
                    {language === "en" ? "Score:" : "Mata:"} {testScore}
                  </span>
                </div>

                <div className="p-6 bg-gradient-to-b from-sky-50 to-white rounded-3xl border border-sky-200 space-y-3 shadow-2xs">
                  <div className="flex justify-center">
                    <span className="text-6xl font-black text-stone-900 font-serif block bg-white px-8 py-3 rounded-2xl shadow-2xs border border-sky-100">
                      {currentLevel.quizQuestions[testQuestionIdx].jawiDisplay}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-stone-800">
                    {language === "en" && currentLevel.quizQuestions[testQuestionIdx].questionTextEn
                      ? currentLevel.quizQuestions[testQuestionIdx].questionTextEn
                      : currentLevel.quizQuestions[testQuestionIdx].questionText}
                  </h3>

                  <button
                    onClick={() => speakQuestion(currentLevel.quizQuestions[testQuestionIdx])}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{language === "en" ? "Listen Question" : "Dengar Soalan"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLevel.quizQuestions[testQuestionIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerTest(opt)}
                      className={`p-4 rounded-2xl font-black text-sm border shadow-2xs transition-all cursor-pointer text-center ${
                        selectedOption === opt
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-stone-800 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-5 py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl font-black shadow-md">
                  🏆
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-stone-900">
                    {testScore >= Math.ceil(currentLevel.quizQuestions.length / 2)
                      ? language === "en"
                        ? "Congratulations! You Passed the Level Test!"
                        : "Tahniah! Anda Lulus Ujian Tahap!"
                      : language === "en"
                      ? "Try Again - Level Test"
                      : "Cuba Lagi Ujian Tahap"}
                  </h3>
                  <p className="text-xs font-bold text-stone-600">
                    {language === "en" ? "Score:" : "Markah:"} {testScore} / {currentLevel.quizQuestions.length}
                  </p>
                </div>

                {testScore >= Math.ceil(currentLevel.quizQuestions.length / 2) && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-extrabold space-y-1">
                    <p>
                      {language === "en"
                        ? "🎉 Level Test activity completed for this level!"
                        : "🎉 Ujian Tahap bagi tahap ini berjaya diselesaikan!"}
                    </p>
                    <p className="text-stone-600 font-normal">
                      {language === "en"
                        ? "Rewards awarded: +30 Coins & +50 XP!"
                        : "Ganjaran dikreditkan: +30 Syiling & +50 XP!"}
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setTestQuestionIdx(0);
                      setTestScore(0);
                      setTestFinished(false);
                      setSelectedOption(null);
                    }}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    {language === "en" ? "Retake Test" : "Ulang Ujian"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 3: BINA PERKATAAN (WORD BUILDER) */}
        {activeSubTab === "builder" && (
          <div className="p-6 bg-white rounded-3xl border border-stone-200 max-w-xl mx-auto space-y-6 text-center">
            <div className="flex items-center justify-between border-b pb-3 text-xs font-bold text-stone-500">
              <span>
                {language === "en" ? "Word Builder Practice" : "Latihan Bina Perkataan Jawi"}
              </span>
              <span className="text-emerald-700">
                {language === "en" ? "Item" : "Item"} {builderTargetIdx + 1} / {currentLevel.lessons.length}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">{currentBuilderLesson.imageEmoji}</span>
                <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {currentBuilderLesson.latinWord} ({currentBuilderLesson.translation})
                </span>
              </div>

              <div className="p-6 bg-stone-50 rounded-3xl border border-stone-200 min-h-[110px] flex flex-col items-center justify-center space-y-2">
                <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
                  {language === "en" ? "Target Jawi Word:" : "Perkataan Jawi Sasaran:"}
                </span>
                <div className="flex items-center gap-2 flex-row-reverse font-serif">
                  {selectedParts.length > 0 ? (
                    selectedParts.map((letter, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const updated = [...selectedParts];
                          updated.splice(idx, 1);
                          setSelectedParts(updated);
                        }}
                        className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-md hover:bg-red-600 transition-all cursor-pointer"
                        title={language === "en" ? "Click to remove" : "Tekan untuk buang"}
                      >
                        {letter}
                      </button>
                    ))
                  ) : (
                    <span className="text-3xl font-black text-stone-300 font-serif">
                      _ _ _ _
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-stone-500 font-semibold">
                {language === "en"
                  ? "Tap the Jawi letters below in correct sequence to build the word:"
                  : "Tekan huruf-huruf Jawi di bawah mengikut urutan yang betul untuk membina perkataan:"}
              </p>
            </div>

            {/* All Jawi letters required for this word + distractor tiles */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              {availableLetterTiles.map((tileLetter, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedParts([...selectedParts, tileLetter]);
                    playArabicSound(tileLetter);
                  }}
                  className="w-14 h-14 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-400 font-black text-2xl text-stone-900 shadow-sm transition-all cursor-pointer font-serif flex items-center justify-center active:scale-95"
                >
                  {tileLetter}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSelectedParts([])}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-xs text-stone-700 cursor-pointer"
              >
                {language === "en" ? "Reset" : "Semula"}
              </button>
              <button
                onClick={() => {
                  const constructedWord = selectedParts.join("");
                  if (constructedWord === targetJawiWord) {
                    updateChildProfile({ coins: activeChild.coins + 20, xp: activeChild.xp + 30 });
                    markActivityComplete("builder");

                    showToast(
                      language === "en"
                        ? `Perfect! You built the Jawi word '${targetJawiWord}' (${currentBuilderLesson.latinWord})! (+20 🪙)`
                        : `Tepat sekali! Perkataan Jawi '${targetJawiWord}' (${currentBuilderLesson.latinWord}) berjaya dibina! (+20 🪙)`,
                      "success"
                    );

                    if (builderTargetIdx < currentLevel.lessons.length - 1) {
                      setBuilderTargetIdx(builderTargetIdx + 1);
                      setSelectedParts([]);
                    }
                  } else {
                    showToast(
                      language === "en"
                        ? "Almost correct! Make sure to select all required letters in the right order."
                        : "Hampir tepat! Sila pastikan semua huruf Jawi dipilih mengikut urutan ejaan yang betul.",
                      "info"
                    );
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
              >
                {language === "en" ? "Check Answer" : "Semak Jawapan"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function isFullyCompleted(isLevelFullyDone: boolean, isUnlocked: boolean, isSelected: boolean) {
  if (isLevelFullyDone) {
    return <span className="text-xs font-black text-amber-300 bg-emerald-800/80 px-1.5 py-0.5 rounded-md">✓✓✓</span>;
  }
  return isUnlocked ? (
    <Unlock className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-200" : "text-emerald-600"}`} />
  ) : (
    <Lock className="w-3.5 h-3.5 text-stone-400" />
  );
}
