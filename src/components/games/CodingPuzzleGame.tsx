import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Play, Sparkles, Trash2, ArrowUp, ArrowRight, ArrowLeft as TurnLeft, Award, Check } from "lucide-react";
import { gameAudio } from "../../utils/gameAudio";
import { GameRewardModal } from "./GameRewardModal";

interface CodingPuzzleProps {
  onBack: () => void;
  onComplete: (stars: number, score: number, coins: number, xp: number) => void;
  onNextGame?: () => void;
}

type CommandType = "FORWARD" | "TURN_LEFT" | "TURN_RIGHT" | "COLLECT";
type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";

interface LevelConfig {
  name: string;
  gridSize: number; // 5x5
  start: { r: number; c: number; dir: Direction };
  goal: { r: number; c: number };
  stars: { r: number; c: number }[];
  obstacles: { r: number; c: number }[];
  maxCommands: number;
}

const CODING_LEVELS: LevelConfig[] = [
  {
    name: "Misi 1: Langkah Pertama Si Robot",
    gridSize: 5,
    start: { r: 4, c: 0, dir: "UP" },
    goal: { r: 1, c: 0 },
    stars: [{ r: 3, c: 0 }],
    obstacles: [{ r: 2, c: 1 }],
    maxCommands: 6
  },
  {
    name: "Misi 2: Belok Menuju Bintang",
    gridSize: 5,
    start: { r: 4, c: 1, dir: "UP" },
    goal: { r: 1, c: 3 },
    stars: [{ r: 2, c: 1 }, { r: 1, c: 2 }],
    obstacles: [{ r: 3, c: 2 }, { r: 2, c: 2 }],
    maxCommands: 10
  },
  {
    name: "Misi 3: Cabaran Melepasi Halangan",
    gridSize: 5,
    start: { r: 4, c: 0, dir: "UP" },
    goal: { r: 0, c: 4 },
    stars: [{ r: 3, c: 1 }, { r: 2, c: 3 }],
    obstacles: [{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 1, c: 3 }],
    maxCommands: 12
  }
];

export const CodingPuzzleGame: React.FC<CodingPuzzleProps> = ({ onBack, onComplete, onNextGame }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLvl = CODING_LEVELS[levelIdx];

  const [commands, setCommands] = useState<CommandType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const [robotPos, setRobotPos] = useState<{ r: number; c: number; dir: Direction }>(currentLvl.start);
  const [collectedStars, setCollectedStars] = useState<{ r: number; c: number }[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("Susun arahan blok untuk membawa Robot ke Peti Emas!");

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [earnedScore, setEarnedScore] = useState(0);
  const [attempts, setAttempts] = useState(1);

  const resetLevel = (lvl: number) => {
    setLevelIdx(lvl);
    const selected = CODING_LEVELS[lvl];
    setCommands([]);
    setIsRunning(false);
    setActiveStep(null);
    setRobotPos(selected.start);
    setCollectedStars([]);
    setStatusMessage("Susun arahan blok untuk membawa Robot ke Peti Emas!");
    setShowRewardModal(false);
    setAttempts(1);
  };

  useEffect(() => {
    resetLevel(levelIdx);
  }, [levelIdx]);

  const addCommand = (cmd: CommandType) => {
    if (isRunning || commands.length >= currentLvl.maxCommands) return;
    gameAudio.playClick();
    setCommands([...commands, cmd]);
  };

  const removeCommand = (idx: number) => {
    if (isRunning) return;
    gameAudio.playClick();
    setCommands(commands.filter((_, i) => i !== idx));
  };

  const clearCommands = () => {
    if (isRunning) return;
    gameAudio.playClick();
    setCommands([]);
    setRobotPos(currentLvl.start);
    setCollectedStars([]);
    setStatusMessage("Arahan dikosongkan. Sedia menyusun blok semula!");
  };

  // Run the code commands sequence step-by-step
  const handleRunCode = async () => {
    if (isRunning || commands.length === 0) return;
    setIsRunning(true);
    setRobotPos(currentLvl.start);
    setCollectedStars([]);
    setStatusMessage("Menjalankan kod...");

    let currentPos = { ...currentLvl.start };
    let starsTaken: { r: number; c: number }[] = [];

    const dirs: Direction[] = ["UP", "RIGHT", "DOWN", "LEFT"];

    for (let i = 0; i < commands.length; i++) {
      setActiveStep(i);
      gameAudio.playFlip();

      await new Promise((resolve) => setTimeout(resolve, 600));

      const cmd = commands[i];

      if (cmd === "TURN_LEFT") {
        const curIdx = dirs.indexOf(currentPos.dir);
        currentPos.dir = dirs[(curIdx + 3) % 4];
      } else if (cmd === "TURN_RIGHT") {
        const curIdx = dirs.indexOf(currentPos.dir);
        currentPos.dir = dirs[(curIdx + 1) % 4];
      } else if (cmd === "FORWARD") {
        let nr = currentPos.r;
        let nc = currentPos.c;
        if (currentPos.dir === "UP") nr--;
        if (currentPos.dir === "DOWN") nr++;
        if (currentPos.dir === "LEFT") nc--;
        if (currentPos.dir === "RIGHT") nc++;

        // Check grid boundary
        if (nr < 0 || nr >= currentLvl.gridSize || nc < 0 || nc >= currentLvl.gridSize) {
          gameAudio.playWrong();
          setStatusMessage("Aduhai! Robot terkeluar dari grid sempadan! Cuba semak semula arahan anda.");
          setIsRunning(false);
          setActiveStep(null);
          setAttempts((a) => a + 1);
          return;
        }

        // Check obstacles
        if (currentLvl.obstacles.some((obs) => obs.r === nr && obs.c === nc)) {
          gameAudio.playWrong();
          setStatusMessage("Robot terlanggar halangan batu/air! Tukar laluan arahan.");
          setIsRunning(false);
          setActiveStep(null);
          setAttempts((a) => a + 1);
          return;
        }

        currentPos.r = nr;
        currentPos.c = nc;

        // Auto-check if stepped on star
        const foundStar = currentLvl.stars.find(
          (s) => s.r === nr && s.c === nc && !starsTaken.some((st) => st.r === s.r && st.c === s.c)
        );
        if (foundStar) {
          gameAudio.playStar();
          starsTaken = [...starsTaken, foundStar];
          setCollectedStars(starsTaken);
        }
      }

      setRobotPos({ ...currentPos });
    }

    setActiveStep(null);
    setIsRunning(false);

    // Check if reached goal
    if (currentPos.r === currentLvl.goal.r && currentPos.c === currentLvl.goal.c) {
      gameAudio.playSuccess();
      const starsPct = starsTaken.length / currentLvl.stars.length;
      let finalStars = 3;
      if (starsPct < 0.5 || attempts > 3) finalStars = 1;
      else if (starsPct < 1 || attempts > 1) finalStars = 2;

      const score = Math.max(160, 600 - attempts * 30 + starsTaken.length * 50);
      const coins = finalStars === 3 ? 50 : finalStars === 2 ? 35 : 25;
      const xp = finalStars === 3 ? 90 : finalStars === 2 ? 60 : 40;

      setEarnedStars(finalStars);
      setEarnedScore(score);
      onComplete(finalStars, score, coins, xp);

      setStatusMessage("Tahniah! Robot berjaya sampai ke Peti Emas!");
      setTimeout(() => setShowRewardModal(true), 600);
    } else {
      gameAudio.playWrong();
      setStatusMessage("Robot belum sampai ke Peti Emas! Tambah arahan lagi.");
      setAttempts((a) => a + 1);
    }
  };

  const getDirArrow = (dir: Direction) => {
    switch (dir) {
      case "UP":
        return "⬆️";
      case "RIGHT":
        return "➡️";
      case "DOWN":
        return "⬇️";
      case "LEFT":
        return "⬅️";
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-black uppercase">
              Permainan 6 • Teka-teki Berkod
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">{currentLvl.name}</h2>
          </div>
        </div>

        {/* Level Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-2xl gap-1">
            {CODING_LEVELS.map((lvl, idx) => (
              <button
                key={idx}
                onClick={() => resetLevel(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  levelIdx === idx ? "bg-cyan-600 text-white shadow-xs" : "text-stone-600 hover:bg-stone-200"
                }`}
              >
                Misi {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => resetLevel(levelIdx)}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Mula Semula"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Arena & Coding Blocks Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Map Grid Display */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-full max-w-[360px] aspect-square grid grid-cols-5 gap-2 p-2 bg-stone-100 rounded-2xl border-2 border-stone-200">
            {Array.from({ length: currentLvl.gridSize }).map((_, r) =>
              Array.from({ length: currentLvl.gridSize }).map((_, c) => {
                const isRobot = robotPos.r === r && robotPos.c === c;
                const isGoal = currentLvl.goal.r === r && currentLvl.goal.c === c;
                const hasStar = currentLvl.stars.some(
                  (s) => s.r === r && s.c === c && !collectedStars.some((cs) => cs.r === r && cs.c === c)
                );
                const isObstacle = currentLvl.obstacles.some((obs) => obs.r === r && obs.c === c);

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`aspect-square rounded-xl border flex items-center justify-center text-2xl relative transition-all ${
                      isObstacle
                        ? "bg-stone-300 border-stone-400 text-xl"
                        : isGoal
                        ? "bg-amber-100 border-amber-300 animate-pulse"
                        : "bg-white border-stone-200"
                    }`}
                  >
                    {isObstacle && "🪨"}
                    {isGoal && !isRobot && "🏆"}
                    {hasStar && !isRobot && "⭐"}

                    {isRobot && (
                      <div className="flex flex-col items-center justify-center animate-bounce z-10">
                        <span className="text-3xl">🤖</span>
                        <span className="text-[10px] -mt-1">{getDirArrow(robotPos.dir)}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 text-xs font-black text-stone-600 text-center bg-cyan-50 p-2.5 rounded-xl border border-cyan-200 w-full">
            {statusMessage}
          </div>
        </div>

        {/* Command Workspace Panel */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-5">
          <div>
            <div className="text-xs font-black uppercase text-stone-500 tracking-wider mb-2">
              Pilih Blok Arahan (Maks: {currentLvl.maxCommands})
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                disabled={isRunning || commands.length >= currentLvl.maxCommands}
                onClick={() => addCommand("FORWARD")}
                className="p-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-300 text-cyan-900 font-black text-xs flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
              >
                <ArrowUp className="w-5 h-5 text-cyan-600" />
                <span>Maju 1 Langkah</span>
              </button>

              <button
                disabled={isRunning || commands.length >= currentLvl.maxCommands}
                onClick={() => addCommand("TURN_LEFT")}
                className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-300 text-indigo-900 font-black text-xs flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
              >
                <TurnLeft className="w-5 h-5 text-indigo-600" />
                <span>Belok Kiri</span>
              </button>

              <button
                disabled={isRunning || commands.length >= currentLvl.maxCommands}
                onClick={() => addCommand("TURN_RIGHT")}
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 text-purple-900 font-black text-xs flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
              >
                <ArrowRight className="w-5 h-5 text-purple-600" />
                <span>Belok Kanan</span>
              </button>
            </div>
          </div>

          {/* Sequence Queue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase text-stone-500 tracking-wider">
              <span>Urutan Blok ({commands.length}/{currentLvl.maxCommands})</span>
              <button
                disabled={isRunning || commands.length === 0}
                onClick={clearCommands}
                className="text-rose-600 hover:text-rose-800 flex items-center gap-1 text-[11px] font-bold cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Padam Semua</span>
              </button>
            </div>

            <div className="min-h-[110px] p-3 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 flex flex-wrap gap-2 items-center content-start">
              {commands.length === 0 && (
                <div className="w-full text-center text-xs font-bold text-stone-400 py-6">
                  Tekan butang blok di atas untuk menambah arahan perjalanan!
                </div>
              )}

              {commands.map((cmd, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => removeCommand(idx)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs ${
                      isActive
                        ? "bg-amber-400 text-stone-950 border-amber-500 scale-110 shadow-md ring-2 ring-amber-300"
                        : "bg-white text-stone-800 border-stone-200 hover:bg-rose-50 hover:border-rose-300"
                    }`}
                    title="Klik untuk buang blok ini"
                  >
                    <span>{idx + 1}.</span>
                    <span>
                      {cmd === "FORWARD" && "⬆️ Maju"}
                      {cmd === "TURN_LEFT" && "⬅️ Kiri"}
                      {cmd === "TURN_RIGHT" && "➡️ Kanan"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Run Code Button */}
          <button
            disabled={isRunning || commands.length === 0}
            onClick={handleRunCode}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{isRunning ? "Kod Sedang Berjalan..." : "Jalankan Kod ▶️"}</span>
          </button>
        </div>
      </div>

      {/* Reward Modal */}
      <GameRewardModal
        isOpen={showRewardModal}
        gameTitle="Teka-teki Berkod"
        stars={earnedStars}
        score={earnedScore}
        coinsEarned={earnedStars === 3 ? 50 : earnedStars === 2 ? 35 : 25}
        xpEarned={earnedStars === 3 ? 90 : earnedStars === 2 ? 60 : 40}
        movesOrTimeText={`${commands.length} blok arahan • ${collectedStars.length} bintang dikutip`}
        onPlayAgain={() => resetLevel(levelIdx)}
        onNextGame={onNextGame}
        onBackToLobby={onBack}
      />
    </div>
  );
};
