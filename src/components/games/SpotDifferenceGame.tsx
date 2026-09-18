import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Sparkles, Check, Eye, HelpCircle, Trophy } from "lucide-react";
import { gameAudio } from "../../utils/gameAudio";
import { GameRewardModal } from "./GameRewardModal";

interface SpotDifferenceProps {
  onBack: () => void;
  onComplete: (stars: number, score: number, coins: number, xp: number) => void;
  onNextGame?: () => void;
}

interface DifferenceItem {
  id: string;
  name: string;
  xPercent: number; // 0 - 100%
  yPercent: number; // 0 - 100%
  radius: number; // click tolerance radius in percent
  hint: string;
}

const DIFFERENCES: DifferenceItem[] = [
  { id: "d1", name: "Awan Gebu di Langit Kiri", xPercent: 24, yPercent: 18, radius: 14, hint: "Lihat bahagian langit di sebelah kiri atas" },
  { id: "d2", name: "Bulan Sabit Dekat Matahari", xPercent: 72, yPercent: 16, radius: 14, hint: "Perhatikan langit berdekatan matahari di sebelah kanan" },
  { id: "d3", name: "Buah Epal Merah di Pokok", xPercent: 54, yPercent: 56, radius: 14, hint: "Lihat dahan pokok rendang di bahagian tengah" },
  { id: "d4", name: "Bunga Ros Merah di Rumput", xPercent: 16, yPercent: 84, radius: 14, hint: "Perhatikan warna bunga di bahagian bawah kiri" },
  { id: "d5", name: "Songkok Si Kucing Comel", xPercent: 82, yPercent: 82, radius: 15, hint: "Perhatikan kepala anak kucing comel di sudut kanan bawah" }
];

export const SpotDifferenceGame: React.FC<SpotDifferenceProps> = ({ onBack, onComplete, onNextGame }) => {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [lastWrongClick, setLastWrongClick] = useState<{ x: number; y: number; panel: "A" | "B" } | null>(null);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [earnedScore, setEarnedScore] = useState(0);

  const resetGame = () => {
    setFoundIds([]);
    setMistakes(0);
    setSeconds(0);
    setTimerRunning(false);
    setLastWrongClick(null);
    setShowRewardModal(false);
  };

  useEffect(() => {
    let intv: any = null;
    if (timerRunning) {
      intv = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(intv);
  }, [timerRunning]);

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>, panel: "A" | "B") => {
    if (!timerRunning) setTimerRunning(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check against un-found differences
    const hit = DIFFERENCES.find((d) => {
      if (foundIds.includes(d.id)) return false;
      const dx = clickX - d.xPercent;
      const dy = clickY - d.yPercent;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist <= d.radius;
    });

    if (hit) {
      // SUCCESS!
      gameAudio.playSuccess();
      const updatedFound = [...foundIds, hit.id];
      setFoundIds(updatedFound);

      if (updatedFound.length === DIFFERENCES.length) {
        setTimerRunning(false);

        let stars = 3;
        if (mistakes >= 5 || seconds > 75) stars = 1;
        else if (mistakes >= 2 || seconds > 45) stars = 2;

        const score = Math.max(150, 550 - mistakes * 25 - seconds * 3);
        const coins = stars === 3 ? 45 : stars === 2 ? 30 : 20;
        const xp = stars === 3 ? 80 : stars === 2 ? 55 : 35;

        setEarnedStars(stars);
        setEarnedScore(score);
        onComplete(stars, score, coins, xp);

        setTimeout(() => {
          setShowRewardModal(true);
        }, 500);
      }
    } else {
      // WRONG CLICK
      gameAudio.playWrong();
      setMistakes((prev) => prev + 1);
      setLastWrongClick({ x: clickX, y: clickY, panel });
      setTimeout(() => setLastWrongClick(null), 600);
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black uppercase">
              Permainan 5 • Kenalpasti Perbezaan
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Taman Indah Kampung Damai (Cari 5 Perbezaan)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-2xl font-black text-rose-950 text-xs">
            Ditemui: {foundIds.length} / {DIFFERENCES.length}
          </div>
          <div className="bg-stone-100 px-3 py-1.5 rounded-2xl font-black text-stone-700 text-xs">
            ⏱️ {seconds}s
          </div>
          <button
            onClick={resetGame}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Mula Semula"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instruction Tip */}
      <div className="bg-amber-100/70 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between gap-2.5 text-amber-900 text-xs font-bold">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Bandingkan gambar A dan B. Klik terus pada bahagian yang berbeza!</span>
        </div>
        <div className="text-[11px] bg-white px-2.5 py-1 rounded-xl text-stone-600 shadow-2xs">
          Kesilapan: {mistakes}
        </div>
      </div>

      {/* Side-by-side Illustrated Comparison Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Panel A (Original Scene) */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-stone-500 tracking-wider text-center flex items-center justify-center gap-1.5">
            <span>Gambar A (Asal)</span>
          </div>

          <div
            onClick={(e) => handleSceneClick(e, "A")}
            className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100 border-4 border-stone-200 shadow-md relative overflow-hidden cursor-crosshair select-none"
          >
            {/* Background Hills */}
            <div className="absolute -bottom-10 -left-10 w-3/4 h-36 bg-emerald-600/30 rounded-full blur-xs" />
            <div className="absolute -bottom-10 -right-10 w-3/4 h-40 bg-emerald-700/30 rounded-full blur-xs" />

            {/* Sun in Sky (Identical in both) */}
            <div
              className="absolute text-4xl select-none"
              style={{ left: "86%", top: "16%", transform: "translate(-50%, -50%)" }}
            >
              ☀️
            </div>

            {/* Mosque Silhouette in Far Background (Center-Left) */}
            <div
              className="absolute text-5xl opacity-85 select-none"
              style={{ left: "38%", top: "42%", transform: "translate(-50%, -50%)" }}
            >
              🕌
            </div>

            {/* Big Shade Tree in Center */}
            <div
              className="absolute text-7xl select-none pointer-events-none"
              style={{ left: "54%", top: "54%", transform: "translate(-50%, -50%)" }}
            >
              🌳
            </div>

            {/* Grass Lawn Layer */}
            <div className="absolute bottom-0 w-full h-[32%] bg-emerald-500/40 border-t-2 border-emerald-400 pointer-events-none" />

            {/* Small Fence */}
            <div
              className="absolute text-2xl opacity-75 select-none pointer-events-none"
              style={{ left: "28%", top: "74%", transform: "translate(-50%, -50%)" }}
            >
              🪵
            </div>

            {/* --- DIFFERENCE LOCATIONS IN PANEL A --- */}
            {/* Diff 1: Cloud - None in Panel A (clear blue sky) */}

            {/* Diff 2: Moon - None in Panel A */}

            {/* Diff 3: Apple on Tree - None in Panel A (just green leaves) */}

            {/* Diff 4: Flower on grass - Yellow flower in Panel A */}
            <div
              className="absolute text-3xl select-none"
              style={{ left: "16%", top: "84%", transform: "translate(-50%, -50%)" }}
            >
              🌼
            </div>

            {/* Diff 5: Cat on Grass - Plain cute kitten in Panel A */}
            <div
              className="absolute text-4xl select-none"
              style={{ left: "82%", top: "82%", transform: "translate(-50%, -50%)" }}
            >
              🐱
            </div>

            {/* Render Circles on Found Differences */}
            {foundIds.map((id) => {
              const diff = DIFFERENCES.find((d) => d.id === id);
              if (!diff) return null;
              return (
                <div
                  key={id}
                  className="absolute w-14 h-14 -ml-7 -mt-7 rounded-full border-4 border-emerald-500 bg-emerald-400/25 animate-pulse flex items-center justify-center pointer-events-none z-10 shadow-md"
                  style={{ left: `${diff.xPercent}%`, top: `${diff.yPercent}%` }}
                >
                  <Check className="w-6 h-6 text-emerald-700 drop-shadow-md font-black" />
                </div>
              );
            })}

            {/* Wrong click feedback marker on Panel A */}
            {lastWrongClick && lastWrongClick.panel === "A" && (
              <div
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-rose-600 bg-rose-500/30 animate-ping pointer-events-none z-20"
                style={{ left: `${lastWrongClick.x}%`, top: `${lastWrongClick.y}%` }}
              />
            )}
          </div>
        </div>

        {/* Panel B (Modified Scene with 5 Differences) */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-rose-600 tracking-wider text-center flex items-center justify-center gap-1.5">
            <span>Gambar B (Cari 5 Perbezaan)</span>
          </div>

          <div
            onClick={(e) => handleSceneClick(e, "B")}
            className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100 border-4 border-rose-300 shadow-md relative overflow-hidden cursor-crosshair select-none"
          >
            {/* Background Hills */}
            <div className="absolute -bottom-10 -left-10 w-3/4 h-36 bg-emerald-600/30 rounded-full blur-xs" />
            <div className="absolute -bottom-10 -right-10 w-3/4 h-40 bg-emerald-700/30 rounded-full blur-xs" />

            {/* Sun in Sky (Identical in both) */}
            <div
              className="absolute text-4xl select-none"
              style={{ left: "86%", top: "16%", transform: "translate(-50%, -50%)" }}
            >
              ☀️
            </div>

            {/* Mosque Silhouette in Far Background (Center-Left) */}
            <div
              className="absolute text-5xl opacity-85 select-none"
              style={{ left: "38%", top: "42%", transform: "translate(-50%, -50%)" }}
            >
              🕌
            </div>

            {/* Big Shade Tree in Center */}
            <div
              className="absolute text-7xl select-none pointer-events-none"
              style={{ left: "54%", top: "54%", transform: "translate(-50%, -50%)" }}
            >
              🌳
            </div>

            {/* Grass Lawn Layer */}
            <div className="absolute bottom-0 w-full h-[32%] bg-emerald-500/40 border-t-2 border-emerald-400 pointer-events-none" />

            {/* Small Fence */}
            <div
              className="absolute text-2xl opacity-75 select-none pointer-events-none"
              style={{ left: "28%", top: "74%", transform: "translate(-50%, -50%)" }}
            >
              🪵
            </div>

            {/* --- DIFFERENCE 1: Fluffy white cloud at (24%, 18%) --- */}
            <div
              className="absolute text-4xl select-none transition-transform hover:scale-110"
              style={{ left: "24%", top: "18%", transform: "translate(-50%, -50%)" }}
            >
              ☁️
            </div>

            {/* --- DIFFERENCE 2: Golden Crescent Moon near Sun at (72%, 16%) --- */}
            <div
              className="absolute text-3xl select-none animate-pulse transition-transform hover:scale-110"
              style={{ left: "72%", top: "16%", transform: "translate(-50%, -50%)" }}
            >
              🌙
            </div>

            {/* --- DIFFERENCE 3: Red Apple on Tree at (54%, 56%) --- */}
            <div
              className="absolute text-3xl select-none drop-shadow-sm transition-transform hover:scale-110"
              style={{ left: "54%", top: "56%", transform: "translate(-50%, -50%)" }}
            >
              🍎
            </div>

            {/* --- DIFFERENCE 4: Red Rose on grass at (16%, 84%) --- */}
            <div
              className="absolute text-3xl select-none transition-transform hover:scale-110"
              style={{ left: "16%", top: "84%", transform: "translate(-50%, -50%)" }}
            >
              🌹
            </div>

            {/* --- DIFFERENCE 5: Cat with Songkok at (82%, 82%) --- */}
            <div
              className="absolute select-none transition-transform hover:scale-110"
              style={{ left: "82%", top: "82%", transform: "translate(-50%, -50%)" }}
            >
              <div className="relative text-4xl">
                🐱
                {/* Cute green Songkok on Cat's head */}
                <span className="absolute -top-3 left-1 text-lg drop-shadow-xs">
                  🎩
                </span>
              </div>
            </div>

            {/* Render Circles on Found Differences */}
            {foundIds.map((id) => {
              const diff = DIFFERENCES.find((d) => d.id === id);
              if (!diff) return null;
              return (
                <div
                  key={id}
                  className="absolute w-14 h-14 -ml-7 -mt-7 rounded-full border-4 border-emerald-500 bg-emerald-400/25 animate-pulse flex items-center justify-center pointer-events-none z-10 shadow-md"
                  style={{ left: `${diff.xPercent}%`, top: `${diff.yPercent}%` }}
                >
                  <Check className="w-6 h-6 text-emerald-700 drop-shadow-md font-black" />
                </div>
              );
            })}

            {/* Wrong click feedback marker on Panel B */}
            {lastWrongClick && lastWrongClick.panel === "B" && (
              <div
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-rose-600 bg-rose-500/30 animate-ping pointer-events-none z-20"
                style={{ left: `${lastWrongClick.x}%`, top: `${lastWrongClick.y}%` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Difference Checklist items */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-stone-200 shadow-sm space-y-3">
        <div className="text-xs font-black uppercase text-stone-500 tracking-wider">
          Kemajuan Perbezaan Ditemui
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {DIFFERENCES.map((d, idx) => {
            const isDone = foundIds.includes(d.id);
            return (
              <div
                key={d.id}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                  isDone
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-black"
                    : "bg-stone-50 border-stone-200 text-stone-500 font-bold"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isDone ? "bg-emerald-500 text-white" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="text-xs truncate">{isDone ? d.name : "Belum Ditemui"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reward Modal */}
      <GameRewardModal
        isOpen={showRewardModal}
        gameTitle="Kenalpasti Perbezaan"
        stars={earnedStars}
        score={earnedScore}
        coinsEarned={earnedStars === 3 ? 45 : earnedStars === 2 ? 30 : 20}
        xpEarned={earnedStars === 3 ? 80 : earnedStars === 2 ? 55 : 35}
        movesOrTimeText={`Berjaya menemui semua 5 perbezaan dalam ${seconds} saat`}
        onPlayAgain={resetGame}
        onNextGame={onNextGame}
        onBackToLobby={onBack}
      />
    </div>
  );
};
