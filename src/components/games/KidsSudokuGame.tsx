import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Lightbulb, Sparkles, Eraser, Check, HelpCircle } from "lucide-react";
import { gameAudio } from "../../utils/gameAudio";
import { GameRewardModal } from "./GameRewardModal";

interface KidsSudokuProps {
  onBack: () => void;
  onComplete: (stars: number, score: number, coins: number, xp: number) => void;
  onNextGame?: () => void;
}

const EMOJI_MAP: Record<number, string> = {
  1: "🍎",
  2: "🍌",
  3: "🍇",
  4: "🍓"
};

interface SudokuLevel {
  name: string;
  initialGrid: number[][]; // 0 for empty
  solution: number[][];
}

const SUDOKU_LEVELS: SudokuLevel[] = [
  {
    name: "Tahap 1: Minda Cerdik Buah-buahan",
    initialGrid: [
      [1, 0, 3, 0],
      [0, 3, 0, 1],
      [0, 1, 0, 3],
      [3, 0, 1, 0]
    ],
    solution: [
      [1, 4, 3, 2],
      [2, 3, 4, 1],
      [4, 1, 2, 3],
      [3, 2, 1, 4]
    ]
  },
  {
    name: "Tahap 2: Logik 4 Kotak Seru",
    initialGrid: [
      [0, 2, 4, 0],
      [1, 0, 0, 3],
      [4, 0, 0, 2],
      [0, 1, 3, 0]
    ],
    solution: [
      [3, 2, 4, 1],
      [1, 4, 2, 3],
      [4, 3, 1, 2],
      [2, 1, 3, 4]
    ]
  }
];

export const KidsSudokuGame: React.FC<KidsSudokuProps> = ({ onBack, onComplete, onNextGame }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLvl = SUDOKU_LEVELS[levelIdx];

  const [useEmoji, setUseEmoji] = useState(true);
  const [grid, setGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [earnedScore, setEarnedScore] = useState(0);

  const initGrid = (lvl: number) => {
    setLevelIdx(lvl);
    const selected = SUDOKU_LEVELS[lvl];
    setGrid(selected.initialGrid.map((row) => [...row]));
    setSelectedCell(null);
    setMistakes(0);
    setHintsUsed(0);
    setSeconds(0);
    setTimerRunning(false);
    setShowRewardModal(false);
  };

  useEffect(() => {
    initGrid(levelIdx);
  }, [levelIdx]);

  useEffect(() => {
    let intv: any = null;
    if (timerRunning) {
      intv = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(intv);
  }, [timerRunning]);

  const handleCellClick = (r: number, c: number) => {
    // Only allow selecting editable cells
    if (currentLvl.initialGrid[r][c] !== 0) return;
    if (!timerRunning) setTimerRunning(true);
    gameAudio.playClick();
    setSelectedCell({ r, c });
  };

  const handleInputNumber = (val: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (currentLvl.initialGrid[r][c] !== 0) return;

    // Check if valid against solution
    const correctVal = currentLvl.solution[r][c];

    if (val === correctVal) {
      // CORRECT!
      gameAudio.playSuccess();
      const newGrid = grid.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? val : cell))
      );
      setGrid(newGrid);
      setSelectedCell(null);

      // Check if board complete
      const isComplete = newGrid.every((row, ri) =>
        row.every((cell, ci) => cell === currentLvl.solution[ri][ci])
      );

      if (isComplete) {
        setTimerRunning(false);

        let stars = 3;
        if (mistakes >= 4 || hintsUsed >= 2) stars = 1;
        else if (mistakes >= 2 || hintsUsed >= 1) stars = 2;

        const score = Math.max(140, 520 - mistakes * 30 - hintsUsed * 40 - seconds * 2);
        const coins = stars === 3 ? 45 : stars === 2 ? 30 : 20;
        const xp = stars === 3 ? 80 : stars === 2 ? 55 : 35;

        setEarnedStars(stars);
        setEarnedScore(score);
        onComplete(stars, score, coins, xp);

        setTimeout(() => setShowRewardModal(true), 500);
      }
    } else {
      // WRONG!
      gameAudio.playWrong();
      setMistakes((m) => m + 1);
    }
  };

  const handleUseHint = () => {
    // Find first empty cell
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) {
          gameAudio.playStar();
          const correctVal = currentLvl.solution[r][c];
          const newGrid = grid.map((row, ri) =>
            row.map((cell, ci) => (ri === r && ci === c ? correctVal : cell))
          );
          setGrid(newGrid);
          setHintsUsed((h) => h + 1);
          return;
        }
      }
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
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
              Permainan 7 • Sudoku Kanak-Kanak
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">{currentLvl.name}</h2>
          </div>
        </div>

        {/* Mode & Level Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseEmoji(!useEmoji)}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs transition-all cursor-pointer"
          >
            {useEmoji ? "🍎 Buah" : "🔢 Nombor"}
          </button>

          <button
            onClick={handleUseHint}
            className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-all cursor-pointer"
            title="Bantuan Petunjuk"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
          </button>

          <button
            onClick={() => initGrid(levelIdx)}
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Mula Semula"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stat Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-emerald-700">Masa</div>
          <div className="text-base font-black text-emerald-950">⏱️ {seconds}s</div>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-rose-700">Kesilapan</div>
          <div className="text-base font-black text-rose-950">{mistakes}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-amber-700">Petunjuk</div>
          <div className="text-base font-black text-amber-950">{hintsUsed}</div>
        </div>
      </div>

      {/* 4x4 Sudoku Grid */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm flex flex-col items-center">
        <div className="w-full max-w-[340px] aspect-square grid grid-cols-4 gap-2 p-3 bg-stone-200 rounded-3xl border-4 border-stone-400">
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isInitial = currentLvl.initialGrid[r][c] !== 0;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;

              // 2x2 box boundary styling
              const borderRight = c === 1 ? "border-r-4 border-stone-400" : "";
              const borderBottom = r === 1 ? "border-b-4 border-stone-400" : "";

              return (
                <button
                  key={`${r}-${c}`}
                  disabled={isInitial}
                  onClick={() => handleCellClick(r, c)}
                  className={`aspect-square rounded-2xl font-black text-2xl sm:text-3xl transition-all flex items-center justify-center cursor-pointer select-none ${borderRight} ${borderBottom} ${
                    isSelected
                      ? "bg-amber-300 text-stone-900 ring-4 ring-amber-400 scale-105 shadow-md"
                      : isInitial
                      ? "bg-stone-100 text-stone-800 font-extrabold cursor-default opacity-90 shadow-2xs"
                      : val !== 0
                      ? "bg-emerald-100 text-emerald-900 border-2 border-emerald-400 font-black"
                      : "bg-white hover:bg-amber-50 text-stone-300 border border-stone-200"
                  }`}
                >
                  {val !== 0 ? (useEmoji ? EMOJI_MAP[val] : val) : ""}
                </button>
              );
            })
          )}
        </div>

        {/* Input Selector Palette */}
        <div className="w-full max-w-[340px] mt-6 space-y-2">
          <div className="text-xs font-black uppercase text-stone-500 tracking-wider text-center">
            Pilih Simbol Untuk Dimasukkan
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                disabled={!selectedCell}
                onClick={() => handleInputNumber(num)}
                className="py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-400 border-2 border-amber-300 text-stone-900 font-black text-2xl flex items-center justify-center cursor-pointer disabled:opacity-40 transition-all shadow-xs"
              >
                {useEmoji ? EMOJI_MAP[num] : num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reward Modal */}
      <GameRewardModal
        isOpen={showRewardModal}
        gameTitle="Sudoku Kanak-Kanak"
        stars={earnedStars}
        score={earnedScore}
        coinsEarned={earnedStars === 3 ? 45 : earnedStars === 2 ? 30 : 20}
        xpEarned={earnedStars === 3 ? 80 : earnedStars === 2 ? 55 : 35}
        movesOrTimeText={`Menyelesaikan sudoku 4x4 dalam ${seconds} saat`}
        onPlayAgain={() => initGrid(levelIdx)}
        onNextGame={onNextGame}
        onBackToLobby={onBack}
      />
    </div>
  );
};
