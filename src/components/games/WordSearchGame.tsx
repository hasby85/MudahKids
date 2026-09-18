import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Sparkles, Check, Lightbulb, Trophy } from "lucide-react";
import { gameAudio } from "../../utils/gameAudio";
import { GameRewardModal } from "./GameRewardModal";

interface WordSearchProps {
  onBack: () => void;
  onComplete: (stars: number, score: number, coins: number, xp: number) => void;
  onNextGame?: () => void;
}

interface WordPuzzleConfig {
  name: string;
  gridSize: number; // 8x8
  words: { word: string; meaning: string; hintCoord: { r: number; c: number } }[];
  grid: string[][];
  wordLocations: { word: string; coords: [number, number][] }[];
}

const PUZZLE_LEVELS: WordPuzzleConfig[] = [
  {
    name: "Tahap 1: Amalan & Ibadah Mulia",
    gridSize: 8,
    words: [
      { word: "SOLAT", meaning: "Tiang agama 5 waktu", hintCoord: { r: 0, c: 0 } },
      { word: "PUASA", meaning: "Rukun Islam di bulan Ramadhan", hintCoord: { r: 2, c: 1 } },
      { word: "ZAKAT", meaning: "Pembersih harta & membantu fakir", hintCoord: { r: 4, c: 2 } },
      { word: "IMAN", meaning: "Keyakinan teguh di dalam hati", hintCoord: { r: 6, c: 0 } },
      { word: "DOA", meaning: "Senjata dan permohonan orang mukmin", hintCoord: { r: 1, c: 5 } }
    ],
    // 8x8 Grid pre-placed words
    grid: [
      ["S", "O", "L", "A", "T", "D", "O", "A"],
      ["B", "K", "L", "M", "P", "D", "O", "A"],
      ["A", "P", "U", "A", "S", "A", "B", "C"],
      ["N", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "Z", "A", "K", "A", "T", "M"],
      ["N", "O", "P", "Q", "R", "S", "T", "U"],
      ["I", "M", "A", "N", "V", "W", "X", "Y"],
      ["Z", "A", "B", "C", "D", "E", "F", "G"]
    ],
    wordLocations: [
      { word: "SOLAT", coords: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
      { word: "DOA", coords: [[0, 5], [0, 6], [0, 7]] },
      { word: "PUASA", coords: [[2, 1], [2, 2], [2, 3], [2, 4], [2, 5]] },
      { word: "ZAKAT", coords: [[4, 2], [4, 3], [4, 4], [4, 5], [4, 6]] },
      { word: "IMAN", coords: [[6, 0], [6, 1], [6, 2], [6, 3]] }
    ]
  },
  {
    name: "Tahap 2: Keindahan Alam Ciptaan Allah",
    gridSize: 8,
    words: [
      { word: "BULAN", meaning: "Menerangi malam yang indah", hintCoord: { r: 1, c: 0 } },
      { word: "BINTANG", meaning: "Kerlipan cakerawala di langit", hintCoord: { r: 3, c: 0 } },
      { word: "HUJAN", meaning: "Rahmat menyuburkan bumi", hintCoord: { r: 5, c: 2 } },
      { word: "POKOK", meaning: "Tumbuh-tumbuhan hijau", hintCoord: { r: 7, c: 1 } }
    ],
    grid: [
      ["A", "K", "M", "S", "T", "U", "V", "W"],
      ["B", "U", "L", "A", "N", "X", "Y", "Z"],
      ["D", "E", "F", "G", "H", "I", "J", "K"],
      ["B", "I", "N", "T", "A", "N", "G", "L"],
      ["M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "H", "U", "J", "A", "N", "W"],
      ["X", "Y", "Z", "A", "B", "C", "D", "E"],
      ["F", "P", "O", "K", "O", "K", "G", "H"]
    ],
    wordLocations: [
      { word: "BULAN", coords: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]] },
      { word: "BINTANG", coords: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6]] },
      { word: "HUJAN", coords: [[5, 2], [5, 3], [5, 4], [5, 5], [5, 6]] },
      { word: "POKOK", coords: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]] }
    ]
  }
];

export const WordSearchGame: React.FC<WordSearchProps> = ({ onBack, onComplete, onNextGame }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = PUZZLE_LEVELS[levelIndex];

  const [selectedCoords, setSelectedCoords] = useState<[number, number][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCoords, setFoundCoords] = useState<[number, number][]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [highlightHint, setHighlightHint] = useState<{ r: number; c: number } | null>(null);

  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [earnedScore, setEarnedScore] = useState(0);

  const resetLevel = (lvlIdx: number) => {
    setLevelIndex(lvlIdx);
    setSelectedCoords([]);
    setFoundWords([]);
    setFoundCoords([]);
    setHintsUsed(0);
    setHighlightHint(null);
    setSeconds(0);
    setTimerActive(false);
    setShowRewardModal(false);
  };

  useEffect(() => {
    resetLevel(levelIndex);
  }, [levelIndex]);

  useEffect(() => {
    let intv: any = null;
    if (timerActive) {
      intv = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(intv);
  }, [timerActive]);

  const handleCellClick = (r: number, c: number) => {
    if (!timerActive) setTimerActive(true);
    gameAudio.playClick();

    // Check if cell is already selected in current selection
    const exists = selectedCoords.some(([cr, cc]) => cr === r && cc === c);
    let newSelection: [number, number][];

    if (exists) {
      newSelection = selectedCoords.filter(([cr, cc]) => !(cr === r && cc === c));
    } else {
      newSelection = [...selectedCoords, [r, c]];
    }

    setSelectedCoords(newSelection);

    // Form word from current selection
    const selectedLetters = newSelection.map(([cr, cc]) => currentLevel.grid[cr][cc]).join("");
    const reversedLetters = selectedLetters.split("").reverse().join("");

    // Check against remaining words
    const match = currentLevel.wordLocations.find(
      (w) =>
        !foundWords.includes(w.word) &&
        (w.word === selectedLetters || w.word === reversedLetters) &&
        w.coords.length === newSelection.length &&
        w.coords.every((c) => newSelection.some(([sr, sc]) => sr === c[0] && sc === c[1]))
    );

    if (match) {
      // FOUND WORD!
      gameAudio.playSuccess();
      const updatedFound = [...foundWords, match.word];
      const updatedCoords = [...foundCoords, ...match.coords];
      setFoundWords(updatedFound);
      setFoundCoords(updatedCoords);
      setSelectedCoords([]);
      setHighlightHint(null);

      // Check win condition
      if (updatedFound.length === currentLevel.words.length) {
        setTimerActive(false);

        let stars = 3;
        if (hintsUsed >= 2 || seconds > 90) stars = 1;
        else if (hintsUsed >= 1 || seconds > 60) stars = 2;

        const score = Math.max(120, 500 - seconds * 2 - hintsUsed * 30);
        const coins = stars === 3 ? 40 : stars === 2 ? 30 : 20;
        const xp = stars === 3 ? 70 : stars === 2 ? 50 : 35;

        setEarnedStars(stars);
        setEarnedScore(score);
        onComplete(stars, score, coins, xp);

        setTimeout(() => {
          setShowRewardModal(true);
        }, 500);
      }
    }
  };

  const handleUseHint = () => {
    const unFound = currentLevel.words.find((w) => !foundWords.includes(w.word));
    if (!unFound) return;
    gameAudio.playClick();
    setHintsUsed((prev) => prev + 1);
    setHighlightHint(unFound.hintCoord);
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase">
              Permainan 4 • Cari Perkataan
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">{currentLevel.name}</h2>
          </div>
        </div>

        {/* Level Controls & Hint */}
        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-2xl gap-1">
            {PUZZLE_LEVELS.map((lvl, idx) => (
              <button
                key={idx}
                onClick={() => resetLevel(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  levelIndex === idx ? "bg-purple-600 text-white shadow-xs" : "text-stone-600 hover:bg-stone-200"
                }`}
              >
                Tahap {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleUseHint}
            className="px-3 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Dapatkan Petunjuk"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Petunjuk</span>
          </button>

          <button
            onClick={() => resetLevel(levelIndex)}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Mula Semula"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Arena & Word Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 8x8 Letter Grid */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-4 sm:p-6 border-2 border-stone-200 shadow-sm flex flex-col items-center">
          <div className="w-full max-w-[420px] aspect-square grid grid-cols-8 gap-1 sm:gap-2">
            {currentLevel.grid.map((row, r) =>
              row.map((char, c) => {
                const isSelected = selectedCoords.some(([sr, sc]) => sr === r && sc === c);
                const isFound = foundCoords.some(([fr, fc]) => fr === r && fc === c);
                const isHint = highlightHint?.r === r && highlightHint?.c === c;

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`aspect-square rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg transition-all duration-200 flex items-center justify-center cursor-pointer select-none ${
                      isFound
                        ? "bg-emerald-500 text-white font-black shadow-xs scale-95"
                        : isSelected
                        ? "bg-purple-600 text-white font-black shadow-md scale-105 animate-pulse"
                        : isHint
                        ? "bg-amber-300 text-stone-900 ring-4 ring-amber-400 font-black animate-bounce"
                        : "bg-stone-100 hover:bg-purple-100 text-stone-800 border border-stone-200"
                    }`}
                  >
                    {char}
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-4 text-xs font-bold text-stone-500 text-center">
            Klik huruf demi huruf untuk membentuk perkataan tersembunyi!
          </div>
        </div>

        {/* Word Clues Checklist */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-stone-600 tracking-wider">
              Senarai Perkataan ({foundWords.length}/{currentLevel.words.length})
            </h3>
            <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl">
              ⏱️ {seconds}s
            </span>
          </div>

          <div className="space-y-2.5">
            {currentLevel.words.map((item, idx) => {
              const isFound = foundWords.includes(item.word);
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-2 ${
                    isFound
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-stone-50 border-stone-200 text-stone-800"
                  }`}
                >
                  <div>
                    <div className={`font-black text-sm ${isFound ? "line-through opacity-80" : ""}`}>
                      {item.word}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{item.meaning}</div>
                  </div>

                  {isFound ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-400 flex items-center justify-center shrink-0 text-xs font-bold">
                      {idx + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reward Modal */}
      <GameRewardModal
        isOpen={showRewardModal}
        gameTitle="Cari Perkataan"
        stars={earnedStars}
        score={earnedScore}
        coinsEarned={earnedStars === 3 ? 40 : earnedStars === 2 ? 30 : 20}
        xpEarned={earnedStars === 3 ? 70 : earnedStars === 2 ? 50 : 35}
        movesOrTimeText={`Menemui semua perkataan dalam ${seconds} saat`}
        onPlayAgain={() => resetLevel(levelIndex)}
        onNextGame={onNextGame}
        onBackToLobby={onBack}
      />
    </div>
  );
};
