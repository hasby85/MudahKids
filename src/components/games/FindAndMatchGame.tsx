import React, { useState, useEffect } from "react";
import { Sparkles, RotateCcw, ArrowLeft, Check, HelpCircle, Trophy } from "lucide-react";
import { gameAudio } from "../../utils/gameAudio";
import { GameRewardModal } from "./GameRewardModal";

interface FindAndMatchProps {
  onBack: () => void;
  onComplete: (stars: number, score: number, coins: number, xp: number) => void;
  onNextGame?: () => void;
}

interface MatchPair {
  id: string;
  leftText: string;
  leftSub?: string;
  rightText: string;
  rightSub?: string;
  icon: string;
}

const STAGES: { name: string; description: string; pairs: MatchPair[] }[] = [
  {
    name: "Tahap 1: Barangan & Ibadah Islamik",
    description: "Padankan barangan atau amalan dengan keterangannya yang tepat!",
    pairs: [
      { id: "p1", leftText: "Kaabah", leftSub: "Kiblat umat Islam", rightText: "Makkah Al-Mukarramah", icon: "🕋" },
      { id: "p2", leftText: "Sejadah", leftSub: "Alas untuk beribadat", rightText: "Digunakan Semasa Solat", icon: "🕌" },
      { id: "p3", leftText: "Al-Quran", leftSub: "Kitab suci petunjuk", rightText: "Kalamullah Mukjizat", icon: "📖" },
      { id: "p4", leftText: "Rehal", leftSub: "Papan kayu penyangga", rightText: "Tempat Letak Al-Quran", icon: "🪵" }
    ]
  },
  {
    name: "Tahap 2: Huruf Jawi & Padanan Rumi",
    description: "Padankan huruf Jawi tunggal dengan bunyi huruf Rumi!",
    pairs: [
      { id: "j1", leftText: "Alif ( ا )", rightText: "Bunyi Huruf 'A' / 'E'", icon: "✏️" },
      { id: "j2", leftText: "Ba ( ب )", rightText: "Bunyi Huruf 'B'", icon: "🖊️" },
      { id: "j3", leftText: "Ta ( ت )", rightText: "Bunyi Huruf 'T'", icon: "📝" },
      { id: "j4", leftText: "Jim ( ج )", rightText: "Bunyi Huruf 'J'", icon: "🖍️" },
      { id: "j5", leftText: "Mim ( م )", rightText: "Bunyi Huruf 'M'", icon: "🖌️" }
    ]
  },
  {
    name: "Tahap 3: Rukun Islam & Amalan",
    description: "Uji kefahaman 5 Rukun Islam dengan amalan yang sepadan!",
    pairs: [
      { id: "r1", leftText: "Mengucap Syahadah", rightText: "Rukun Islam Pertama", icon: "☝️" },
      { id: "r2", leftText: "Mendirikan Solat", rightText: "5 Waktu Sehari Semalam", icon: "🤲" },
      { id: "r3", leftText: "Menunaikan Zakat", rightText: "Menyucikan Harta & Jiwa", icon: "🪙" },
      { id: "r4", leftText: "Berpuasa di Ramadhan", rightText: "Menahan Lapar & Dahaga", icon: "🌙" },
      { id: "r5", leftText: "Menunaikan Haji", rightText: "Bagi Yang Berkemampuan", icon: "🕋" }
    ]
  }
];

export const FindAndMatchGame: React.FC<FindAndMatchProps> = ({ onBack, onComplete, onNextGame }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const currentStage = STAGES[stageIndex];

  const [leftItems, setLeftItems] = useState<{ id: string; text: string; sub?: string; icon: string }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: string; text: string; sub?: string; icon: string }[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [earnedScore, setEarnedScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeSpentSec, setTimeSpentSec] = useState(0);

  // Setup Stage
  const initializeStage = (sIdx: number) => {
    const stage = STAGES[sIdx];
    const lefts = stage.pairs.map((p) => ({ id: p.id, text: p.leftText, sub: p.leftSub, icon: p.icon }));
    const rights = stage.pairs.map((p) => ({ id: p.id, text: p.rightText, sub: p.rightSub, icon: p.icon }));

    // Shuffle both lists
    setLeftItems([...lefts].sort(() => Math.random() - 0.5));
    setRightItems([...rights].sort(() => Math.random() - 0.5));

    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setAttempts(0);
    setMistakes(0);
    setWrongPair(null);
    setShowRewardModal(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    initializeStage(stageIndex);
  }, [stageIndex]);

  // Handle clicking an item
  const handleSelectLeft = (id: string) => {
    if (matchedIds.includes(id)) return;
    gameAudio.playClick();
    setSelectedLeft(id);

    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleSelectRight = (id: string) => {
    if (matchedIds.includes(id)) return;
    gameAudio.playClick();
    setSelectedRight(id);

    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    setAttempts((prev) => prev + 1);

    if (leftId === rightId) {
      // MATCH SUCCESS!
      gameAudio.playSuccess();
      const updatedMatches = [...matchedIds, leftId];
      setMatchedIds(updatedMatches);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all matched
      if (updatedMatches.length === currentStage.pairs.length) {
        const timeSec = Math.floor((Date.now() - startTime) / 1000);
        setTimeSpentSec(timeSec);

        // Stars calculation
        let stars = 3;
        if (mistakes >= 3) stars = 1;
        else if (mistakes >= 1) stars = 2;

        const score = Math.max(100, 500 - mistakes * 40 - timeSec * 3);
        const coins = stars === 3 ? 35 : stars === 2 ? 25 : 15;
        const xp = stars === 3 ? 60 : stars === 2 ? 45 : 30;

        setEarnedStars(stars);
        setEarnedScore(score);
        onComplete(stars, score, coins, xp);

        setTimeout(() => {
          setShowRewardModal(true);
        }, 500);
      }
    } else {
      // WRONG MATCH
      gameAudio.playWrong();
      setMistakes((prev) => prev + 1);
      setWrongPair({ left: leftId, right: rightId });

      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Header */}
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black uppercase">
              Permainan 1 • Cari & Padan
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">{currentStage.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stage Selector Chips */}
          <div className="flex bg-stone-100 p-1 rounded-2xl gap-1">
            {STAGES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setStageIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  stageIndex === idx
                    ? "bg-sky-500 text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-200"
                }`}
              >
                Tahap {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => initializeStage(stageIndex)}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            title="Ulang Semula"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Stat Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-sky-700">Padanan</div>
          <div className="text-lg font-black text-sky-950">
            {matchedIds.length} / {currentStage.pairs.length}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-amber-700">Percubaan</div>
          <div className="text-lg font-black text-amber-950">{attempts}</div>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-center">
          <div className="text-[10px] uppercase font-black text-rose-700">Kesilapan</div>
          <div className="text-lg font-black text-rose-950">{mistakes}</div>
        </div>
      </div>

      {/* Instruction Tip */}
      <div className="bg-sky-100/70 border border-sky-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-sky-900 text-xs font-bold">
        <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
        <span>Pilih satu item di sebelah kiri, kemudian klik padanan yang betul di sebelah kanan!</span>
      </div>

      {/* Two Column Matching Arena */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Items Column */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase text-stone-500 tracking-wider px-1">
            Bahagian A (Pilihan)
          </div>
          <div className="space-y-2.5">
            {leftItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedLeft === item.id;
              const isWrong = wrongPair?.left === item.id;

              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleSelectLeft(item.id)}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isMatched
                      ? "bg-emerald-50 border-emerald-400 text-emerald-900 opacity-80 cursor-default"
                      : isWrong
                      ? "bg-rose-100 border-rose-400 text-rose-900 animate-shake"
                      : isSelected
                      ? "bg-sky-500 text-white border-sky-600 shadow-md scale-102"
                      : "bg-white hover:bg-sky-50 border-stone-200 text-stone-800 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="font-black text-sm sm:text-base leading-tight">{item.text}</div>
                      {item.sub && (
                        <div
                          className={`text-xs mt-0.5 truncate ${
                            isSelected ? "text-sky-100" : "text-stone-500"
                          }`}
                        >
                          {item.sub}
                        </div>
                      )}
                    </div>
                  </div>

                  {isMatched && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Items Column */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase text-stone-500 tracking-wider px-1">
            Bahagian B (Padanan)
          </div>
          <div className="space-y-2.5">
            {rightItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedRight === item.id;
              const isWrong = wrongPair?.right === item.id;

              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleSelectRight(item.id)}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isMatched
                      ? "bg-emerald-50 border-emerald-400 text-emerald-900 opacity-80 cursor-default"
                      : isWrong
                      ? "bg-rose-100 border-rose-400 text-rose-900 animate-shake"
                      : isSelected
                      ? "bg-indigo-600 text-white border-indigo-700 shadow-md scale-102"
                      : "bg-white hover:bg-indigo-50 border-stone-200 text-stone-800 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <div className="font-black text-sm sm:text-base leading-tight">{item.text}</div>
                      {item.sub && (
                        <div
                          className={`text-xs mt-0.5 truncate ${
                            isSelected ? "text-indigo-100" : "text-stone-500"
                          }`}
                        >
                          {item.sub}
                        </div>
                      )}
                    </div>
                  </div>

                  {isMatched && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reward Modal */}
      <GameRewardModal
        isOpen={showRewardModal}
        gameTitle="Cari & Padan"
        stars={earnedStars}
        score={earnedScore}
        coinsEarned={earnedStars === 3 ? 35 : earnedStars === 2 ? 25 : 15}
        xpEarned={earnedStars === 3 ? 60 : earnedStars === 2 ? 45 : 30}
        movesOrTimeText={`${matchedIds.length} padanan dalam ${timeSpentSec}s • ${mistakes} kesilapan`}
        onPlayAgain={() => initializeStage(stageIndex)}
        onNextGame={onNextGame}
        onBackToLobby={onBack}
      />
    </div>
  );
};
