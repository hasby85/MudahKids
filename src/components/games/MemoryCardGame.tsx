import React, { useState, useEffect } from "react";
import { RotateCcw, ArrowLeft, Timer, Sparkles, Trophy, Brain } from "lucide-react";
import { gameAudio } from "../../utils/gameAudio";
import { GameRewardModal } from "./GameRewardModal";

interface MemoryCardProps {
  onBack: () => void;
  onComplete: (stars: number, score: number, coins: number, xp: number) => void;
  onNextGame?: () => void;
}

interface CardItem {
  id: number;
  pairKey: string;
  icon: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const THEMES = [
  {
    name: "Ibadah & Ceria",
    items: [
      { key: "masjid", icon: "🕌", label: "Masjid" },
      { key: "kaabah", icon: "🕋", label: "Kaabah" },
      { key: "quran", icon: "📖", label: "Al-Quran" },
      { key: "bulan", icon: "🌙", label: "Bulan Sabit" },
      { key: "bintang", icon: "⭐", label: "Bintang" },
      { key: "doa", icon: "🤲", label: "Doa" }
    ]
  },
  {
    name: "Sahabat Haiwan",
    items: [
      { key: "kucing", icon: "🐱", label: "Kucing" },
      { key: "arnab", icon: "🐰", label: "Arnab" },
      { key: "unta", icon: "🐪", label: "Unta" },
      { key: "kuda", icon: "🐎", label: "Kuda" },
      { key: "burung", icon: "🕊️", label: "Burung Merpati" },
      { key: "ikan", icon: "🐠", label: "Ikan" }
    ]
  },
  {
    name: "Buah-buahan Lazat",
    items: [
      { key: "epal", icon: "🍎", label: "Epal" },
      { key: "pisang", icon: "🍌", label: "Pisang" },
      { key: "anggur", icon: "🍇", label: "Anggur" },
      { key: "tembikai", icon: "🍉", label: "Tembikai" },
      { key: "strawberi", icon: "🍓", label: "Strawberi" },
      { key: "kurma", icon: "🌴", label: "Kurma" }
    ]
  }
];

export const MemoryCardGame: React.FC<MemoryCardProps> = ({ onBack, onComplete, onNextGame }) => {
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [combo, setCombo] = useState(0);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [earnedScore, setEarnedScore] = useState(0);

  // Initialize Cards
  const initGame = (themeIdx: number) => {
    const theme = THEMES[themeIdx];
    const initialPairs = theme.items;
    const duplicated: CardItem[] = [];

    initialPairs.forEach((item, idx) => {
      duplicated.push({
        id: idx * 2,
        pairKey: item.key,
        icon: item.icon,
        label: item.label,
        isFlipped: false,
        isMatched: false
      });
      duplicated.push({
        id: idx * 2 + 1,
        pairKey: item.key,
        icon: item.icon,
        label: item.label,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffled = duplicated.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setIsLocked(false);
    setMoves(0);
    setMatchedPairsCount(0);
    setSeconds(0);
    setTimerRunning(false);
    setCombo(0);
    setShowRewardModal(false);
  };

  useEffect(() => {
    initGame(selectedThemeIndex);
  }, [selectedThemeIndex]);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleCardClick = (cardId: number) => {
    if (isLocked) return;
    const targetCard = cards.find((c) => c.id === cardId);
    if (!targetCard || targetCard.isFlipped || targetCard.isMatched) return;

    if (!timerRunning) {
      setTimerRunning(true);
    }

    gameAudio.playFlip();

    // Flip card
    const updatedCards = cards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = updatedCards.find((c) => c.id === firstId);
      const secondCard = updatedCards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairKey === secondCard.pairKey) {
        // MATCH!
        gameAudio.playSuccess();
        const newCombo = combo + 1;
        setCombo(newCombo);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);

          const newMatchedCount = matchedPairsCount + 1;
          setMatchedPairsCount(newMatchedCount);

          // All pairs matched!
          if (newMatchedCount === THEMES[selectedThemeIndex].items.length) {
            setTimerRunning(false);

            // Calculate stars based on moves (minimum is 6 moves for 6 pairs)
            let stars = 3;
            if (moves + 1 > 14) stars = 1;
            else if (moves + 1 > 9) stars = 2;

            const score = Math.max(150, 600 - (moves + 1) * 20 - seconds * 2 + newCombo * 30);
            const coins = stars === 3 ? 40 : stars === 2 ? 30 : 20;
            const xp = stars === 3 ? 70 : stars === 2 ? 50 : 35;

            setEarnedStars(stars);
            setEarnedScore(score);
            onComplete(stars, score, coins, xp);

            setTimeout(() => {
              setShowRewardModal(true);
            }, 600);
          }
        }, 500);
      } else {
        // NO MATCH
        gameAudio.playWrong();
        setCombo(0);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c))
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border-2 border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase">
              Permainan 2 • Game Kad Memori
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              {THEMES[selectedThemeIndex].name}
            </h2>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-2xl gap-1">
            {THEMES.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedThemeIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedThemeIndex === idx
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-200"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => initGame(selectedThemeIndex)}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Ulang Semula"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Stat Bar */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-emerald-700">Padanan</div>
          <div className="text-base sm:text-lg font-black text-emerald-950">
            {matchedPairsCount} / {THEMES[selectedThemeIndex].items.length}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-amber-700">Langkah</div>
          <div className="text-base sm:text-lg font-black text-amber-950">{moves}</div>
        </div>
        <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-sky-700">Masa</div>
          <div className="text-base sm:text-lg font-black text-sky-950">{seconds}s</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-purple-700">Kombo</div>
          <div className="text-base sm:text-lg font-black text-purple-950">
            {combo > 1 ? `🔥 x${combo}` : "-"}
          </div>
        </div>
      </div>

      {/* Card Grid (4x3 layout) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-2xl sm:rounded-3xl p-2 cursor-pointer transition-all duration-300 transform select-none flex flex-col items-center justify-center border-2 ${
                card.isMatched
                  ? "bg-emerald-100 border-emerald-400 scale-95 shadow-xs"
                  : isRevealed
                  ? "bg-white border-amber-400 shadow-lg scale-102"
                  : "bg-gradient-to-br from-emerald-500 to-teal-700 border-emerald-400 shadow-md hover:scale-103 hover:shadow-lg"
              }`}
            >
              {isRevealed ? (
                <div className="text-center animate-fadeIn">
                  <div className="text-4xl sm:text-5xl">{card.icon}</div>
                  <div className="text-[11px] sm:text-xs font-black text-stone-800 mt-1 truncate max-w-[90px]">
                    {card.label}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white/90">
                  <Brain className="w-8 h-8 sm:w-10 sm:h-10 opacity-70" />
                  <span className="text-[10px] font-black uppercase tracking-wider mt-1 opacity-80">
                    Buka
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reward Modal */}
      <GameRewardModal
        isOpen={showRewardModal}
        gameTitle="Game Kad Memori"
        stars={earnedStars}
        score={earnedScore}
        coinsEarned={earnedStars === 3 ? 40 : earnedStars === 2 ? 30 : 20}
        xpEarned={earnedStars === 3 ? 70 : earnedStars === 2 ? 50 : 35}
        movesOrTimeText={`${moves} langkah dalam ${seconds} saat`}
        onPlayAgain={() => initGame(selectedThemeIndex)}
        onNextGame={onNextGame}
        onBackToLobby={onBack}
      />
    </div>
  );
};
