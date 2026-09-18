import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Sparkles, Check, Lightbulb, HelpCircle, Trophy } from "lucide-react";
import { gameAudio } from "../../utils/gameAudio";
import { GameRewardModal } from "./GameRewardModal";

interface CrosswordProps {
  onBack: () => void;
  onComplete: (stars: number, score: number, coins: number, xp: number) => void;
  onNextGame?: () => void;
}

interface CrosswordClue {
  number: number;
  direction: "across" | "down";
  clue: string;
  answer: string;
  startR: number;
  startC: number;
  icon: string;
}

const CLUES: CrosswordClue[] = [
  {
    number: 1,
    direction: "across",
    clue: "Ibadah rukun Islam ketiga dengan menahan lapar & dahaga di bulan Ramadhan",
    answer: "PUASA",
    startR: 0,
    startC: 0,
    icon: "🌙"
  },
  {
    number: 2,
    direction: "down",
    clue: "Tiang agama yang wajib didirikan 5 kali sehari semalam (bersilang pada huruf S)",
    answer: "SOLAT",
    startR: 0,
    startC: 3,
    icon: "🤲"
  },
  {
    number: 3,
    direction: "across",
    clue: "Rumah ibadat umat Islam tempat azan dilaungkan (bersilang pada huruf A)",
    answer: "MASJID",
    startR: 3,
    startC: 2,
    icon: "🕌"
  },
  {
    number: 4,
    direction: "down",
    clue: "Permohonan hamba kepada Allah SWT & senjata orang mukmin (bersilang pada huruf D)",
    answer: "DOA",
    startR: 3,
    startC: 7,
    icon: "☝️"
  }
];

export const CrosswordGame: React.FC<CrosswordProps> = ({ onBack, onComplete, onNextGame }) => {
  const GRID_ROWS = 6;
  const GRID_COLS = 8;

  // Active grid solution mapping (6 rows x 8 cols)
  const [gridValues, setGridValues] = useState<string[][]>(
    Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(""))
  );

  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>({ r: 0, c: 0 });
  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(CLUES[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [earnedScore, setEarnedScore] = useState(0);

  // Compute which cells belong to the crossword
  const validCellCoords = new Set<string>();
  const cellNumberMap = new Map<string, number>();

  CLUES.forEach((clue) => {
    cellNumberMap.set(`${clue.startR}-${clue.startC}`, clue.number);
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.direction === "across" ? clue.startR : clue.startR + i;
      const c = clue.direction === "across" ? clue.startC + i : clue.startC;
      validCellCoords.add(`${r}-${c}`);
    }
  });

  const isCellInClue = (r: number, c: number, clue: CrosswordClue) => {
    for (let i = 0; i < clue.answer.length; i++) {
      const cr = clue.direction === "across" ? clue.startR : clue.startR + i;
      const cc = clue.direction === "across" ? clue.startC + i : clue.startC;
      if (cr === r && cc === c) return true;
    }
    return false;
  };

  const resetCrossword = () => {
    setGridValues(Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill("")));
    setActiveCell({ r: 0, c: 0 });
    setSelectedClue(CLUES[0]);
    setIsCompleted(false);
    setHintsUsed(0);
    setSeconds(0);
    setTimerRunning(false);
    setShowRewardModal(false);
  };

  useEffect(() => {
    let intv: any = null;
    if (timerRunning) {
      intv = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(intv);
  }, [timerRunning]);

  const handleCellChange = (r: number, c: number, char: string) => {
    if (!timerRunning) setTimerRunning(true);
    const upper = char.toUpperCase().slice(-1);
    gameAudio.playClick();

    const newGrid = gridValues.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? upper : cell))
    );
    setGridValues(newGrid);

    // Auto advance to next cell in current clue direction
    if (upper && selectedClue) {
      const clueCells: { r: number; c: number }[] = [];
      for (let i = 0; i < selectedClue.answer.length; i++) {
        const cr = selectedClue.direction === "across" ? selectedClue.startR : selectedClue.startR + i;
        const cc = selectedClue.direction === "across" ? selectedClue.startC + i : selectedClue.startC;
        clueCells.push({ r: cr, c: cc });
      }
      const currIdx = clueCells.findIndex((cell) => cell.r === r && cell.c === c);
      if (currIdx >= 0 && currIdx < clueCells.length - 1) {
        setActiveCell(clueCells[currIdx + 1]);
      }
    }

    // Auto validate
    checkCompletion(newGrid);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    if (e.key === "Backspace" && !gridValues[r][c] && selectedClue) {
      const clueCells: { r: number; c: number }[] = [];
      for (let i = 0; i < selectedClue.answer.length; i++) {
        const cr = selectedClue.direction === "across" ? selectedClue.startR : selectedClue.startR + i;
        const cc = selectedClue.direction === "across" ? selectedClue.startC + i : selectedClue.startC;
        clueCells.push({ r: cr, c: cc });
      }
      const currIdx = clueCells.findIndex((cell) => cell.r === r && cell.c === c);
      if (currIdx > 0) {
        setActiveCell(clueCells[currIdx - 1]);
      }
    }
  };

  const handleCellFocus = (r: number, c: number) => {
    setActiveCell({ r, c });
    if (selectedClue && isCellInClue(r, c, selectedClue)) {
      return;
    }
    const matchingClue = CLUES.find((clue) => isCellInClue(r, c, clue));
    if (matchingClue) {
      setSelectedClue(matchingClue);
    }
  };

  const checkCompletion = (currentGrid: string[][]) => {
    let allValid = true;

    for (const clue of CLUES) {
      for (let i = 0; i < clue.answer.length; i++) {
        const r = clue.direction === "across" ? clue.startR : clue.startR + i;
        const c = clue.direction === "across" ? clue.startC + i : clue.startC;
        if (currentGrid[r][c] !== clue.answer[i]) {
          allValid = false;
          break;
        }
      }
      if (!allValid) break;
    }

    if (allValid) {
      setIsCompleted(true);
      setTimerRunning(false);
      gameAudio.playSuccess();

      let stars = 3;
      if (hintsUsed >= 2 || seconds > 90) stars = 1;
      else if (hintsUsed >= 1 || seconds > 60) stars = 2;

      const score = Math.max(150, 560 - seconds * 2 - hintsUsed * 35);
      const coins = stars === 3 ? 45 : stars === 2 ? 30 : 20;
      const xp = stars === 3 ? 80 : stars === 2 ? 55 : 35;

      setEarnedStars(stars);
      setEarnedScore(score);
      onComplete(stars, score, coins, xp);

      setTimeout(() => setShowRewardModal(true), 600);
    }
  };

  const handleSelectClue = (clue: CrosswordClue) => {
    gameAudio.playClick();
    setSelectedClue(clue);
    setActiveCell({ r: clue.startR, c: clue.startC });
  };

  const handleHint = () => {
    if (!selectedClue) return;
    // Reveal first missing letter in selected clue
    for (let i = 0; i < selectedClue.answer.length; i++) {
      const r = selectedClue.direction === "across" ? selectedClue.startR : selectedClue.startR + i;
      const c = selectedClue.direction === "across" ? selectedClue.startC + i : selectedClue.startC;

      if (gridValues[r][c] !== selectedClue.answer[i]) {
        gameAudio.playStar();
        const newGrid = gridValues.map((row, ri) =>
          row.map((cell, ci) => (ri === r && ci === c ? selectedClue.answer[i] : cell))
        );
        setGridValues(newGrid);
        setHintsUsed((h) => h + 1);
        checkCompletion(newGrid);
        return;
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black uppercase">
              Permainan 8 • Silang Kata
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Silang Kata Nilai & Ibadah Islamik
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-stone-100 px-3 py-1.5 rounded-2xl font-black text-stone-700 text-xs">
            ⏱️ {seconds}s
          </div>
          <button
            onClick={handleHint}
            className="px-3 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Isi 1 Huruf"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Petunjuk</span>
          </button>
          <button
            onClick={resetCrossword}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Mula Semula"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Crossword Arena: Grid & Clues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 8 cols x 6 rows Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-full max-w-[420px] aspect-[8/6] grid grid-cols-8 gap-1 sm:gap-1.5 p-2 sm:p-2.5 bg-stone-900 rounded-3xl border-4 border-stone-800 shadow-inner">
            {Array.from({ length: GRID_ROWS }).map((_, r) =>
              Array.from({ length: GRID_COLS }).map((_, c) => {
                const isValid = validCellCoords.has(`${r}-${c}`);
                const clueNumber = cellNumberMap.get(`${r}-${c}`);
                const isSelected = activeCell?.r === r && activeCell?.c === c;
                const isInSelectedClue = selectedClue ? isCellInClue(r, c, selectedClue) : false;

                if (!isValid) {
                  return <div key={`${r}-${c}`} className="aspect-square bg-stone-950/70 rounded-xl" />;
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square rounded-xl relative border transition-all flex items-center justify-center ${
                      isSelected
                        ? "bg-amber-300 border-amber-500 ring-2 ring-amber-400 scale-105 z-10 shadow-sm"
                        : isInSelectedClue
                        ? "bg-rose-50 border-rose-300"
                        : "bg-white border-stone-300"
                    }`}
                  >
                    {clueNumber && (
                      <span className="absolute top-0.5 left-1 text-[9px] font-black text-stone-600 pointer-events-none">
                        {clueNumber}
                      </span>
                    )}
                    <input
                      type="text"
                      maxLength={1}
                      value={gridValues[r][c]}
                      onFocus={() => handleCellFocus(r, c)}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      className="w-full h-full text-center font-black text-base sm:text-lg text-stone-900 uppercase bg-transparent outline-none cursor-pointer"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clues Accordion List */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-stone-500 tracking-wider">
              Petunjuk Soalan
            </h3>
            <span className="text-[11px] font-bold text-stone-400">Klik untuk pilih</span>
          </div>

          <div className="space-y-2.5">
            {CLUES.map((clue) => {
              const isSelected = selectedClue?.number === clue.number && selectedClue?.direction === clue.direction;
              return (
                <div
                  key={`${clue.direction}-${clue.number}`}
                  onClick={() => handleSelectClue(clue)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-rose-50 border-rose-400 shadow-xs ring-1 ring-rose-200"
                      : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{clue.icon}</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-[10px] font-black uppercase">
                      {clue.number} • {clue.direction === "across" ? "Melintang" : "Menegak"} ({clue.answer.length} Huruf)
                    </span>
                  </div>
                  <p className="text-xs font-bold text-stone-700 leading-relaxed pl-7">
                    {clue.clue}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reward Modal */}
      <GameRewardModal
        isOpen={showRewardModal}
        gameTitle="Silang Kata"
        stars={earnedStars}
        score={earnedScore}
        coinsEarned={earnedStars === 3 ? 45 : earnedStars === 2 ? 30 : 20}
        xpEarned={earnedStars === 3 ? 80 : earnedStars === 2 ? 55 : 35}
        movesOrTimeText={`Berjaya menyelesaikan silang kata dalam ${seconds} saat`}
        onPlayAgain={resetCrossword}
        onNextGame={onNextGame}
        onBackToLobby={onBack}
      />
    </div>
  );
};
