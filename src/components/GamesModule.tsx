import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { GameId } from "../types";
import {
  Gamepad2,
  Trophy,
  Star,
  Coins,
  Flame,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  Award,
  ArrowRight,
  Lock,
  Unlock,
  Check,
  X,
  AlertCircle,
  ShoppingBag,
  Gift
} from "lucide-react";
import { gameAudio } from "../utils/gameAudio";

// Import all 8 games
import { FindAndMatchGame } from "./games/FindAndMatchGame";
import { MemoryCardGame } from "./games/MemoryCardGame";
import { PictureQuizGame } from "./games/PictureQuizGame";
import { WordSearchGame } from "./games/WordSearchGame";
import { SpotDifferenceGame } from "./games/SpotDifferenceGame";
import { CodingPuzzleGame } from "./games/CodingPuzzleGame";
import { KidsSudokuGame } from "./games/KidsSudokuGame";
import { CrosswordGame } from "./games/CrosswordGame";

interface GameMetadata {
  id: GameId;
  order: number;
  title: string;
  subtitle: string;
  category: "logik" | "bahasa" | "visual";
  icon: string;
  bgGradient: string;
  difficulty: "Mudah" | "Sederhana" | "Mencabar";
  accentColor: string;
  description: string;
  skills: string[];
  coinPrice: number;
}

const GAME_CATALOGUE: GameMetadata[] = [
  {
    id: "find-match",
    order: 1,
    title: "Cari & Padan",
    subtitle: "Find & Match",
    category: "bahasa",
    icon: "🧩",
    bgGradient: "from-sky-500 to-blue-600",
    difficulty: "Mudah",
    accentColor: "border-sky-300 text-sky-700 bg-sky-50",
    description: "Padankan barangan ibadah, huruf Jawi dengan Rumi, serta amalan Islamik yang sepadan!",
    skills: ["Fokus", "Padanan Konsep", "Huruf Jawi"],
    coinPrice: 150
  },
  {
    id: "memory-card",
    order: 2,
    title: "Game Kad Memori",
    subtitle: "Memory Card Game",
    category: "visual",
    icon: "🎴",
    bgGradient: "from-emerald-500 to-teal-600",
    difficulty: "Sederhana",
    accentColor: "border-emerald-300 text-emerald-700 bg-emerald-50",
    description: "Uji daya ingatan tajam dengan membalikkan kad dan mencari pasangan simbol yang sepadan!",
    skills: ["Daya Ingatan", "Fokus Visual", "Ketelitian"],
    coinPrice: 150
  },
  {
    id: "picture-quiz",
    order: 3,
    title: "Kuiz Bergambar",
    subtitle: "Picture Quiz",
    category: "visual",
    icon: "🖼️",
    bgGradient: "from-amber-500 to-orange-600",
    difficulty: "Mudah",
    accentColor: "border-amber-300 text-amber-700 bg-amber-50",
    description: "Jawab soalan santai berilustrasi mengenai amalan Islam, alam ciptaan, dan sirah menarik!",
    skills: ["Pengetahuan Am", "Pengecaman Objek", "Rukun Islam"],
    coinPrice: 180
  },
  {
    id: "word-search",
    order: 4,
    title: "Cari Perkataan",
    subtitle: "Word Search",
    category: "bahasa",
    icon: "🔍",
    bgGradient: "from-purple-500 to-indigo-600",
    difficulty: "Sederhana",
    accentColor: "border-purple-300 text-purple-700 bg-purple-50",
    description: "Cari perkataan amalan soleh dan keindahan alam yang tersembunyi di dalam grid huruf!",
    skills: ["Kosa Kata", "Kecerdasan Visual", "Ejaan"],
    coinPrice: 200
  },
  {
    id: "spot-difference",
    order: 5,
    title: "Kenalpasti Perbezaan",
    subtitle: "Spot the Difference",
    category: "visual",
    icon: "👀",
    bgGradient: "from-rose-500 to-pink-600",
    difficulty: "Mencabar",
    accentColor: "border-rose-300 text-rose-700 bg-rose-50",
    description: "Cari 5 perbezaan halus antara dua ilustrasi taman kampung yang ceria dan penuh kejutan!",
    skills: ["Ketelitian", "Pemerhatian Tajam", "Kesabaran"],
    coinPrice: 200
  },
  {
    id: "coding-puzzle",
    order: 6,
    title: "Teka-teki Berkod",
    subtitle: "Coding Puzzle",
    category: "logik",
    icon: "🤖",
    bgGradient: "from-cyan-500 to-blue-600",
    difficulty: "Mencabar",
    accentColor: "border-cyan-300 text-cyan-700 bg-cyan-50",
    description: "Susun blok arahan maju dan belok untuk mengemudi Si Robot melepasi halangan menuju harta karun!",
    skills: ["Pemikiran Komputasional", "Algoritma", "Penyelesaian Masalah"],
    coinPrice: 250
  },
  {
    id: "kids-sudoku",
    order: 7,
    title: "Sudoku Kanak-Kanak",
    subtitle: "Kids Sudoku 4x4",
    category: "logik",
    icon: "🔢",
    bgGradient: "from-teal-500 to-emerald-700",
    difficulty: "Sederhana",
    accentColor: "border-teal-300 text-teal-700 bg-teal-50",
    description: "Isi kotak 4x4 menggunakan buah-buahan ceria atau nombor tanpa ada yang berulang!",
    skills: ["Logik Matematik", "Penaakulan", "Deduksi"],
    coinPrice: 250
  },
  {
    id: "crossword",
    order: 8,
    title: "Silang Kata",
    subtitle: "Kids Crossword",
    category: "bahasa",
    icon: "✏️",
    bgGradient: "from-orange-500 to-rose-600",
    difficulty: "Sederhana",
    accentColor: "border-orange-300 text-orange-700 bg-orange-50",
    description: "Selesaikan teka silang kata melintang dan menegak berpandukan petunjuk ibadah harian!",
    skills: ["Bahasa Melayu", "Kosa Kata Islamik", "Ejaan"],
    coinPrice: 300
  }
];

export const GamesModule: React.FC = () => {
  const { activeChild, updateChildProfile, showToast, role } = useApp();

  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"semua" | "logik" | "bahasa" | "visual">("semua");

  // Purchase Modal State (Single Game Purchase)
  const [purchaseModal, setPurchaseModal] = useState<{
    game: GameMetadata;
    price: number;
  } | null>(null);

  // Read games progress from active child
  const gamesProgress = activeChild?.gamesProgress || {
    totalStars: 0,
    unlockedLevel: 1,
    gamesPlayedCount: 0,
    gameStats: {},
    dailyStreak: 1,
    isModuleUnlocked: false,
    unlockedGameIds: []
  };

  const isModuleFullyUnlocked = Boolean(gamesProgress.isModuleUnlocked);
  const unlockedList: GameId[] = gamesProgress.unlockedGameIds || [];

  // Check if a specific game is unlocked
  const isGameUnlocked = (id: GameId) => {
    return isModuleFullyUnlocked || unlockedList.includes(id);
  };

  // Count how many games unlocked
  const unlockedGamesCount = isModuleFullyUnlocked
    ? GAME_CATALOGUE.length
    : GAME_CATALOGUE.filter((g) => unlockedList.includes(g.id)).length;

  // Handle single game purchase with coins
  const handleConfirmBuySingle = (game: GameMetadata) => {
    if (!activeChild) return;
    const currentCoins = activeChild.coins || 0;
    if (currentCoins < game.coinPrice) {
      gameAudio.playWrong();
      showToast(`Syiling tidak mencukupi! Anda perlukan ${game.coinPrice - currentCoins} syiling lagi.`, "error");
      return;
    }

    const newCoins = currentCoins - game.coinPrice;
    const prevUnlocked = gamesProgress.unlockedGameIds || [];
    const updatedUnlocked = Array.from(new Set([...prevUnlocked, game.id]));
    const isNowAllUnlocked = GAME_CATALOGUE.every((g) => updatedUnlocked.includes(g.id));

    updateChildProfile({
      coins: newCoins,
      gamesProgress: {
        ...gamesProgress,
        unlockedGameIds: updatedUnlocked,
        isModuleUnlocked: gamesProgress.isModuleUnlocked || isNowAllUnlocked
      }
    });

    gameAudio.playReward();
    showToast(`🎉 Tahniah! Permainan "${game.title}" berjaya dibuka dengan ${game.coinPrice} Syiling!`, "success");
    setPurchaseModal(null);
  };

  // Parent reward helper: grant full access for free as a parent gift
  const handleParentGiftFullAccess = () => {
    if (!activeChild) return;
    const allGameIds = GAME_CATALOGUE.map((g) => g.id);

    updateChildProfile({
      gamesProgress: {
        ...gamesProgress,
        isModuleUnlocked: true,
        unlockedGameIds: allGameIds
      }
    });

    gameAudio.playReward();
    showToast(`🎁 Hadiah Ibu Bapa: Semua 8 Permainan telah dibuka untuk ${activeChild.name}!`, "success");
  };

  // Handle completion of any game
  const handleGameComplete = (gameId: GameId, stars: number, score: number, coins: number, xp: number) => {
    if (!activeChild) return;

    const prevStats = gamesProgress.gameStats[gameId] || {
      stars: 0,
      highScore: 0,
      timesCompleted: 0,
      lastPlayed: new Date().toISOString()
    };

    const newStarsForGame = Math.max(prevStats.stars, stars);
    const starDelta = Math.max(0, newStarsForGame - prevStats.stars);

    const updatedGameStats = {
      ...gamesProgress.gameStats,
      [gameId]: {
        stars: newStarsForGame,
        highScore: Math.max(prevStats.highScore, score),
        timesCompleted: prevStats.timesCompleted + 1,
        lastPlayed: new Date().toISOString()
      }
    };

    // Calculate new total stars
    const newTotalStars = (gamesProgress.totalStars || 0) + starDelta;

    // Boost pet happiness as a reward!
    const newPetHappiness = Math.min(100, (activeChild.pet?.happiness || 80) + 10);

    updateChildProfile({
      coins: (activeChild.coins || 0) + coins,
      xp: (activeChild.xp || 0) + xp,
      pet: {
        ...activeChild.pet,
        happiness: newPetHappiness
      },
      gamesProgress: {
        ...gamesProgress,
        totalStars: newTotalStars,
        gamesPlayedCount: (gamesProgress.gamesPlayedCount || 0) + 1,
        gameStats: updatedGameStats
      }
    });

    showToast(`Hebat! Berjaya selesaikan misi permainan! +${coins} Syiling & +${xp} XP`, "success");
  };

  // Navigate to next game in list (only if unlocked)
  const handleNextGame = (currentId: GameId) => {
    const currentIndex = GAME_CATALOGUE.findIndex((g) => g.id === currentId);
    if (currentIndex >= 0 && currentIndex < GAME_CATALOGUE.length - 1) {
      const candidateGame = GAME_CATALOGUE[currentIndex + 1];
      if (isGameUnlocked(candidateGame.id)) {
        setActiveGameId(candidateGame.id);
      } else {
        // Return to catalogue and prompt to buy
        setActiveGameId(null);
        setPurchaseModal({
          type: "single",
          game: candidateGame,
          price: candidateGame.coinPrice
        });
      }
    } else {
      setActiveGameId(null);
    }
  };

  // Filtered list of games
  const displayedGames = GAME_CATALOGUE.filter((g) =>
    selectedFilter === "semua" ? true : g.category === selectedFilter
  );

  // Render individual game if active and unlocked
  if (activeGameId && isGameUnlocked(activeGameId)) {
    return (
      <div className="space-y-4 animate-fadeIn">
        {activeGameId === "find-match" && (
          <FindAndMatchGame
            onBack={() => setActiveGameId(null)}
            onComplete={(stars, score, coins, xp) => handleGameComplete("find-match", stars, score, coins, xp)}
            onNextGame={() => handleNextGame("find-match")}
          />
        )}

        {activeGameId === "memory-card" && (
          <MemoryCardGame
            onBack={() => setActiveGameId(null)}
            onComplete={(stars, score, coins, xp) => handleGameComplete("memory-card", stars, score, coins, xp)}
            onNextGame={() => handleNextGame("memory-card")}
          />
        )}

        {activeGameId === "picture-quiz" && (
          <PictureQuizGame
            onBack={() => setActiveGameId(null)}
            onComplete={(stars, score, coins, xp) => handleGameComplete("picture-quiz", stars, score, coins, xp)}
            onNextGame={() => handleNextGame("picture-quiz")}
          />
        )}

        {activeGameId === "word-search" && (
          <WordSearchGame
            onBack={() => setActiveGameId(null)}
            onComplete={(stars, score, coins, xp) => handleGameComplete("word-search", stars, score, coins, xp)}
            onNextGame={() => handleNextGame("word-search")}
          />
        )}

        {activeGameId === "spot-difference" && (
          <SpotDifferenceGame
            onBack={() => setActiveGameId(null)}
            onComplete={(stars, score, coins, xp) => handleGameComplete("spot-difference", stars, score, coins, xp)}
            onNextGame={() => handleNextGame("spot-difference")}
          />
        )}

        {activeGameId === "coding-puzzle" && (
          <CodingPuzzleGame
            onBack={() => setActiveGameId(null)}
            onComplete={(stars, score, coins, xp) => handleGameComplete("coding-puzzle", stars, score, coins, xp)}
            onNextGame={() => handleNextGame("coding-puzzle")}
          />
        )}

        {activeGameId === "kids-sudoku" && (
          <KidsSudokuGame
            onBack={() => setActiveGameId(null)}
            onComplete={(stars, score, coins, xp) => handleGameComplete("kids-sudoku", stars, score, coins, xp)}
            onNextGame={() => handleNextGame("kids-sudoku")}
          />
        )}

        {activeGameId === "crossword" && (
          <CrosswordGame
            onBack={() => setActiveGameId(null)}
            onComplete={(stars, score, coins, xp) => handleGameComplete("crossword", stars, score, coins, xp)}
            onNextGame={() => handleNextGame("crossword")}
          />
        )}
      </div>
    );
  }

  // Calculate total possible stars (8 games * 3 stars = 24 max)
  const maxPossibleStars = GAME_CATALOGUE.length * 3;
  const currentTotalStars = Object.values(gamesProgress.gameStats || {}).reduce(
    (acc: number, cur: any) => acc + (cur?.stars || 0),
    0
  );

  const childCoins = activeChild?.coins || 0;

  return (
    <div className="space-y-6">
      {/* Hero Showcase Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 sm:p-8 text-stone-950 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/15 backdrop-blur-md text-stone-950 text-xs font-black uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4" />
                Pusat Permainan Minda & Interaktif
              </div>

              {isModuleFullyUnlocked ? (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs">
                  <Unlock className="w-3.5 h-3.5" />
                  Semua 8 Permainan Dimiliki
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900 text-amber-300 text-xs font-black shadow-xs">
                  <Lock className="w-3.5 h-3.5" />
                  {unlockedGamesCount}/8 Permainan Dimiliki
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Pusat Arked Permainan Kanak-Kanak
            </h1>

            <p className="text-xs sm:text-sm font-bold text-stone-900/90 leading-relaxed">
              Buka permainan kegemaran anda satu per satu menggunakan syiling emas yang diperoleh daripada amalan solat dan tugasan harian. Latih daya ingatan, logik, dan bahasa sambil kumpul bintang!
            </p>

            {/* Parent Gift Full Access Shortcut */}
            {role === "parent" && !isModuleFullyUnlocked && (
              <div className="pt-2">
                <button
                  onClick={handleParentGiftFullAccess}
                  className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-stone-900 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-stone-900/10"
                >
                  <Gift className="w-3.5 h-3.5 text-rose-500" />
                  <span>Ibu Bapa: Hadiahkan Akses Penuh (Percuma)</span>
                </button>
              </div>
            )}
          </div>

          {/* Player Progress & Coin Balance Card */}
          <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border-2 border-stone-900/10 shadow-lg shrink-0 w-full md:w-auto min-w-[220px]">
            <div className="text-[11px] font-black uppercase text-stone-500 tracking-wider mb-2">
              Baki Syiling & Bintang
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-2xl shadow-xs">
                  🪙
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-700 leading-tight">
                    {childCoins} <span className="text-xs font-bold text-stone-500">Syiling</span>
                  </div>
                  <div className="text-[11px] font-bold text-stone-500">
                    Boleh digunakan untuk beli game
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-black text-stone-700">
                <div className="flex items-center gap-1.5 text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{currentTotalStars} / {maxPossibleStars} Bintang</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700">
                  <Flame className="w-3.5 h-3.5 fill-emerald-400 text-emerald-600" />
                  <span>{activeChild?.xp || 0} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation & Discipline Objective Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🕌</span>
          <div>
            <div className="font-black text-emerald-950">
              Misi Disiplin & Anak Soleh: Terokai Satu Per Satu Permainan
            </div>
            <div className="text-[11px] font-bold text-stone-600">
              Beli dan terokai permainan satu demi satu menggunakan syiling hasil usaha Solat 5 Waktu, mengaji Al-Quran/Iqra & berbakti kepada ibu bapa!
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-black text-emerald-800">
          <span className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            🪙 150 - 300 Syiling / Permainan
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border-2 border-stone-200 shadow-2xs gap-1.5">
          <button
            onClick={() => setSelectedFilter("semua")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedFilter === "semua"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Semua (8)
          </button>

          <button
            onClick={() => setSelectedFilter("logik")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedFilter === "logik"
                ? "bg-cyan-600 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            🤖 Minda & Logik (2)
          </button>

          <button
            onClick={() => setSelectedFilter("bahasa")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedFilter === "bahasa"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            📖 Bahasa & Kata (3)
          </button>

          <button
            onClick={() => setSelectedFilter("visual")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedFilter === "visual"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            👀 Visual & Memori (3)
          </button>
        </div>

        <div className="text-xs font-black text-stone-500">
          {unlockedGamesCount} daripada 8 permainan telah dibuka
        </div>
      </div>

      {/* 8 Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {displayedGames.map((game) => {
          const stats = gamesProgress.gameStats[game.id];
          const starsEarned = stats?.stars || 0;
          const highScore = stats?.highScore || 0;
          const playedCount = stats?.timesCompleted || 0;
          const unlocked = isGameUnlocked(game.id);

          return (
            <div
              key={game.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                unlocked
                  ? "border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-md"
                  : "border-stone-200 bg-stone-50/70 opacity-95"
              }`}
            >
              <div className="space-y-4">
                {/* Visual Header Banner */}
                <div
                  className={`h-28 rounded-2xl bg-gradient-to-br ${game.bgGradient} p-3 flex flex-col justify-between text-white shadow-inner relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-black/25 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                      #{game.order} • {game.difficulty}
                    </span>

                    {/* Status Badge (Unlocked vs Locked) */}
                    {unlocked ? (
                      <div className="flex items-center gap-0.5 bg-black/25 backdrop-blur-md px-2 py-0.5 rounded-full">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= starsEarned
                                ? "fill-amber-300 text-amber-300"
                                : "fill-white/30 text-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-stone-900/80 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black">
                        <Lock className="w-3 h-3" />
                        <span>{game.coinPrice} 🪙</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <span className="text-4xl drop-shadow-md transform group-hover:scale-115 transition-transform duration-300">
                      {game.icon}
                    </span>

                    {unlocked && playedCount > 0 ? (
                      <span className="text-[10px] font-black bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
                        {playedCount}x Selesai
                      </span>
                    ) : !unlocked ? (
                      <span className="text-[10px] font-black bg-stone-900/60 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-md">
                        Terkunci
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-lg font-black text-stone-900 group-hover:text-amber-600 transition-colors leading-snug">
                      {game.title}
                    </h3>
                    {unlocked ? (
                      <span className="inline-flex items-center text-emerald-600 text-xs font-black shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-stone-400 text-xs shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-extrabold text-stone-400 -mt-0.5">
                    {game.subtitle}
                  </div>

                  <p className="text-xs font-bold text-stone-600 mt-2 leading-relaxed line-clamp-2">
                    {game.description}
                  </p>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {game.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-600 text-[10px] font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button & Best Score / Unlock price */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                {unlocked ? (
                  <>
                    <div className="text-left">
                      <div className="text-[9px] uppercase font-black text-stone-400">Skor Tertinggi</div>
                      <div className="text-xs font-black text-stone-800">
                        {highScore > 0 ? highScore : "-"}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        gameAudio.playClick();
                        setActiveGameId(game.id);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer group-hover:scale-103"
                    >
                      <Play className="w-3.5 h-3.5 fill-stone-950" />
                      <span>Main</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-left">
                      <div className="text-[9px] uppercase font-black text-stone-400">Harga Buka</div>
                      <div className="text-xs font-black text-amber-700 flex items-center gap-1">
                        <Coins className="w-3 h-3 fill-amber-400 text-amber-600" />
                        <span>{game.coinPrice} Syiling</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        gameAudio.playClick();
                        setPurchaseModal({
                          game,
                          price: game.coinPrice
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-103"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Buka ({game.coinPrice} 🪙)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coin Purchase Confirmation Modal */}
      {purchaseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-stone-200 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Beli Permainan Menggunakan Syiling</span>
              </div>

              <button
                onClick={() => setPurchaseModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Details Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center text-3xl shadow-sm border border-amber-200">
                {purchaseModal.game.icon}
              </div>

              <h3 className="text-lg font-black text-stone-900">
                {purchaseModal.game.title}
              </h3>

              <p className="text-xs font-bold text-stone-600">
                {purchaseModal.game.description}
              </p>
            </div>

            {/* Coin Breakdown Calculation */}
            <div className="space-y-2 text-xs font-extrabold bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between text-stone-600">
                <span>Baki Syiling Anda Semasa:</span>
                <span className="font-black text-stone-900 text-sm">🪙 {childCoins}</span>
              </div>

              <div className="flex items-center justify-between text-rose-600">
                <span>Harga Pembelian:</span>
                <span className="font-black text-rose-600 text-sm">- 🪙 {purchaseModal.price}</span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-stone-800">
                <span>Baki Selepas Pembelian:</span>
                <span
                  className={`font-black text-sm ${
                    childCoins >= purchaseModal.price ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  🪙 {childCoins - purchaseModal.price}
                </span>
              </div>
            </div>

            {/* Status & CTA Button */}
            {childCoins >= purchaseModal.price ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    handleConfirmBuySingle(purchaseModal.game);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Sahkan & Buka Sekarang (🪙 {purchaseModal.price})</span>
                </button>

                <button
                  onClick={() => setPurchaseModal(null)}
                  className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50/90 border-2 border-amber-300/80 rounded-2xl text-xs text-stone-800 space-y-2.5">
                  <div className="flex items-start gap-2 text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-rose-900">Syiling Belum Mencukupi!</span>
                      <div className="text-[11px] font-bold text-stone-700">
                        Anda perlukan <span className="font-black text-rose-600 underline text-xs">+{purchaseModal.price - childCoins} syiling</span> lagi untuk membuka permainan ini.
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-1.5 text-[11px]">
                    <div className="font-black text-stone-800 flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>Kumpul Syiling Melalui Disiplin & Amalan Soleh:</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-700 font-bold border-b border-stone-100 pb-1">
                      <span>🕌 Solat Fardu 5 Waktu di awal waktu</span>
                      <span className="text-amber-700 font-black">+85 🪙 / hari</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-700 font-bold border-b border-stone-100 pb-1">
                      <span>📖 Mengaji Iqra, Surah & Hafazan</span>
                      <span className="text-amber-700 font-black">+15-25 🪙</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-700 font-bold">
                      <span>🌟 Bersalaman & Bantu Ibu Bapa</span>
                      <span className="text-amber-700 font-black">+10-20 🪙</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setPurchaseModal(null)}
                  className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Faham, Saya Berazam Kumpul Syiling Hari Ini!</span>
                  <span>💪</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

