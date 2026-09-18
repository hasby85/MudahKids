import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Star, Award, Coins, Flame, ArrowRight, RotateCcw, Home, Sparkles } from "lucide-react";
import { gameAudio } from "../../utils/gameAudio";

interface GameRewardModalProps {
  isOpen: boolean;
  gameTitle: string;
  stars: number; // 1 to 3
  score: number;
  coinsEarned: number;
  xpEarned: number;
  movesOrTimeText?: string;
  onPlayAgain: () => void;
  onNextGame?: () => void;
  onBackToLobby: () => void;
}

export const GameRewardModal: React.FC<GameRewardModalProps> = ({
  isOpen,
  gameTitle,
  stars,
  score,
  coinsEarned,
  xpEarned,
  movesOrTimeText,
  onPlayAgain,
  onNextGame,
  onBackToLobby
}) => {
  useEffect(() => {
    if (isOpen) {
      gameAudio.playVictory();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden transform scale-100 transition-all">
        {/* Background glow & sparkles */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-200 rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-200 rounded-full blur-2xl opacity-60 pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Header Title & Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Tahniah! Misi Berjaya!
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
            {gameTitle}
          </h2>

          {/* 3 Stars with animated pop */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3].map((starIndex) => {
              const isEarned = starIndex <= stars;
              return (
                <div
                  key={starIndex}
                  className={`relative p-2.5 rounded-2xl transition-all duration-500 transform ${
                    isEarned
                      ? "bg-amber-100 text-amber-500 scale-110 rotate-3 shadow-md animate-bounce"
                      : "bg-stone-100 text-stone-300 scale-95"
                  }`}
                  style={{ animationDelay: `${starIndex * 150}ms` }}
                >
                  <Star
                    className={`w-9 h-9 sm:w-11 sm:h-11 ${
                      isEarned ? "fill-amber-400 text-amber-500" : "fill-stone-200 text-stone-300"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <p className="text-sm font-bold text-stone-600">
            {stars === 3
              ? "Cemerlang Luar Biasa! 3 Bintang Penuh!"
              : stars === 2
              ? "Hebat Sekali! Prestasi yang sangat baik!"
              : "Bagus! Teruskan usaha untuk dapat 3 bintang!"}
          </p>

          {movesOrTimeText && (
            <div className="inline-block bg-stone-100 px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-600">
              {movesOrTimeText} • Skor: <span className="text-stone-900 font-extrabold">{score}</span>
            </div>
          )}

          {/* Rewards Breakdown Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-amber-50 border-2 border-amber-200 p-3.5 rounded-2xl flex items-center justify-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-xs">
                <Coins className="w-5 h-5 fill-amber-300" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-black text-amber-800 tracking-wider">Syiling</div>
                <div className="text-lg font-black text-amber-950">+{coinsEarned}</div>
              </div>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-200 p-3.5 rounded-2xl flex items-center justify-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-xs">
                <Flame className="w-5 h-5 fill-emerald-300" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-black text-emerald-800 tracking-wider">Mata XP</div>
                <div className="text-lg font-black text-emerald-950">+{xpEarned}</div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold flex items-center justify-center gap-2">
            <span>🐾</span>
            <span>Haiwan peliharaan anda berasa bertambah gembira (+10 Kegembiraan)!</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {onNextGame && (
              <button
                onClick={onNextGame}
                className="w-full py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Permainan Seterusnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={onPlayAgain}
                className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Semula</span>
              </button>

              <button
                onClick={onBackToLobby}
                className="flex-1 py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Pusat Permainan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
