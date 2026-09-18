import React, { useState } from "react";
import { ArrowLeft, RotateCcw, Sparkles, CheckCircle2, XCircle, HelpCircle, Trophy } from "lucide-react";
import { gameAudio } from "../../utils/gameAudio";
import { GameRewardModal } from "./GameRewardModal";

interface PictureQuizProps {
  onBack: () => void;
  onComplete: (stars: number, score: number, coins: number, xp: number) => void;
  onNextGame?: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  imageEmoji: string;
  bgGradient: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Apakah nama binaan suci yang menjadi arah kiblat umat Islam ketika solat?",
    category: "Ibadah & Sejarah",
    imageEmoji: "🕋",
    bgGradient: "from-amber-400 to-amber-600",
    options: ["Kaabah", "Masjid Nabawi", "Menara Condong", "Kota A Famosa"],
    correctIndex: 0,
    explanation: "Kaabah terletak di Masjidil Haram, Makkah dan merupakan kiblat solat seluruh umat Islam."
  },
  {
    id: 2,
    question: "Alatan manakah yang dihamparkan sebagai alas bersih ketika mendirikan solat?",
    category: "Adab Solat",
    imageEmoji: "🕌",
    bgGradient: "from-emerald-400 to-teal-600",
    options: ["Tikar Mengkuang", "Sejadah", "Selimut Tebal", "Kain Meja"],
    correctIndex: 1,
    explanation: "Sejadah digunakan untuk memastikan tempat sujud dan solat sentiasa bersih dan suci."
  },
  {
    id: 3,
    question: "Haiwan apakah ini yang sering dikaitkan dengan padang pasir dan pengembaraan para nabi?",
    category: "Ciptaan Allah",
    imageEmoji: "🐪",
    bgGradient: "from-orange-400 to-amber-600",
    options: ["Kuda Belang", "Unta", "Gajah", "Rusa"],
    correctIndex: 1,
    explanation: "Unta adalah haiwan hebat yang mampu bertahan tanpa air selama berminggu-minggu di padang pasir."
  },
  {
    id: 4,
    question: "Kitab suci apakah yang diturunkan oleh Allah SWT kepada Nabi Muhammad SAW melalui Malaikat Jibril?",
    category: "Rukun Iman",
    imageEmoji: "📖",
    bgGradient: "from-sky-400 to-indigo-600",
    options: ["Kitab Taurat", "Kitab Zabur", "Kitab Injil", "Al-Quran Al-Karim"],
    correctIndex: 3,
    explanation: "Al-Quran adalah kalamullah yang menjadi mukjizat teragung dan panduan hidup orang mukmin."
  },
  {
    id: 5,
    question: "Bulan hijriah apakah yang mewajibkan seluruh umat Islam yang baligh dan mampu untuk berpuasa?",
    category: "Rukun Islam",
    imageEmoji: "🌙",
    bgGradient: "from-purple-500 to-pink-600",
    options: ["Bulan Syawal", "Bulan Ramadhan", "Bulan Zulhijjah", "Bulan Rejab"],
    correctIndex: 1,
    explanation: "Bulan Ramadhan adalah bulan penuh keberkatan di mana umat Islam diwajibkan berpuasa sebulan."
  }
];

export const PictureQuizGame: React.FC<PictureQuizProps> = ({ onBack, onComplete, onNextGame }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);

  const currentQ = QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      // CORRECT
      gameAudio.playSuccess();
      setScore((prev) => prev + 100 + streak * 20);
      setStreak((prev) => prev + 1);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      // WRONG
      gameAudio.playWrong();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    gameAudio.playClick();
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // FINISHED
      const finalCorrect = correctAnswersCount + (selectedOption === currentQ.correctIndex ? 0 : 0);
      let stars = 3;
      if (finalCorrect <= 2) stars = 1;
      else if (finalCorrect <= 4) stars = 2;

      const finalScore = score;
      const coins = stars === 3 ? 40 : stars === 2 ? 30 : 20;
      const xp = stars === 3 ? 75 : stars === 2 ? 50 : 35;

      setEarnedStars(stars);
      onComplete(stars, finalScore, coins, xp);
      setShowRewardModal(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setCorrectAnswersCount(0);
    setShowRewardModal(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase">
              Permainan 3 • Kuiz Bergambar
            </div>
            <h2 className="text-xl font-black text-stone-900">Soalan {currentIndex + 1} daripada {QUESTIONS.length}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-100 px-3 py-1.5 rounded-2xl text-amber-950 font-black text-sm">
            Skor: {score}
          </div>
          <button
            onClick={restartQuiz}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Mula Semula"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-amber-400 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-sm space-y-6">
        {/* Visual Banner */}
        <div
          className={`h-40 sm:h-48 rounded-2xl bg-gradient-to-br ${currentQ.bgGradient} flex flex-col items-center justify-center text-white shadow-inner relative overflow-hidden`}
        >
          <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black">
            {currentQ.category}
          </div>
          {streak > 1 && (
            <div className="absolute top-3 right-3 bg-amber-400 text-stone-950 px-3 py-1 rounded-full text-xs font-black shadow-md animate-bounce">
              🔥 Streak x{streak}!
            </div>
          )}
          <div className="text-6xl sm:text-7xl drop-shadow-md transform hover:scale-110 transition-transform">
            {currentQ.imageEmoji}
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-black text-stone-900 text-center leading-snug">
          {currentQ.question}
        </h3>

        {/* 4 Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = idx === currentQ.correctIndex;
            const isChosen = selectedOption === idx;

            let btnStyle = "bg-stone-50 border-stone-200 text-stone-800 hover:bg-amber-50 hover:border-amber-300";

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = "bg-emerald-500 border-emerald-600 text-white shadow-md animate-pulse";
              } else if (isChosen) {
                btnStyle = "bg-rose-500 border-rose-600 text-white";
              } else {
                btnStyle = "bg-stone-100 border-stone-200 text-stone-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border-2 font-black text-sm text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                      isAnswered && isCorrect
                        ? "bg-white text-emerald-700"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                {isAnswered && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback / Explanation Box */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-stone-800 space-y-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-black uppercase text-amber-800">
                  {selectedOption === currentQ.correctIndex ? "Tepat Sekali! 🎉" : "Kurang Tepat 💡"}
                </div>
                <p className="text-xs font-bold text-stone-600 mt-1 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{currentIndex < QUESTIONS.length - 1 ? "Soalan Seterusnya" : "Lihat Keputusan"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Reward Modal */}
      <GameRewardModal
        isOpen={showRewardModal}
        gameTitle="Kuiz Bergambar"
        stars={earnedStars}
        score={score}
        coinsEarned={earnedStars === 3 ? 40 : earnedStars === 2 ? 30 : 20}
        xpEarned={earnedStars === 3 ? 75 : earnedStars === 2 ? 50 : 35}
        movesOrTimeText={`${correctAnswersCount} daripada ${QUESTIONS.length} soalan betul`}
        onPlayAgain={restartQuiz}
        onNextGame={onNextGame}
        onBackToLobby={onBack}
      />
    </div>
  );
};
