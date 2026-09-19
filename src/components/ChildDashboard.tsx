import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Heart,
  Smile,
  Moon,
  Coins,
  Crown,
  Gift,
  Compass,
  ShoppingBag,
  Trophy,
  Hammer,
  BookOpen
} from "lucide-react";
import { HourlyScheduleModule } from "./HourlyScheduleModule";

interface ChildDashboardProps {
  onNavigateToWorld: () => void;
  onNavigateToShop: () => void;
  onNavigateToLeaderboard: () => void;
  onNavigateToJawi?: () => void;
  onNavigateToHafazan?: () => void;
  onNavigateToGames?: () => void;
  onNavigateToSolat?: () => void;
  onNavigateToDiari?: () => void;
}

export const ChildDashboard: React.FC<ChildDashboardProps> = ({
  onNavigateToWorld,
  onNavigateToShop,
  onNavigateToLeaderboard,
  onNavigateToJawi,
  onNavigateToHafazan,
  onNavigateToGames,
  onNavigateToSolat,
  onNavigateToDiari
}) => {
  const {
    language,
    activeChild,
    setRole,
    feedPet,
    playWithPet,
    sleepPet,
    updateChildProfile,
    showToast
  } = useApp();

  // Determine today's date key (YYYY-MM-DD)
  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayDateStr();
  const isDailyClaimed = Boolean(activeChild?.lastDailyRewardDate === todayStr);

  if (!activeChild) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-4 max-w-xl mx-auto shadow-2xs my-8">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-3xl mx-auto">
          👦
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-stone-900">
            {language === "en" ? "No Child Profile Yet" : "Belum Ada Profil Anak"}
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            {language === "en"
              ? "Please switch to Parent mode to add a child profile first."
              : "Sila bertukar ke mod Ibu Bapa untuk menambah profil anak anda terlebih dahulu."}
          </p>
        </div>
        <button
          onClick={() => setRole("parent")}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
        >
          {language === "en" ? "Switch to Parent Mode" : "Tukar ke Mod Ibu Bapa"}
        </button>
      </div>
    );
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleClaimDailyReward = () => {
    if (isDailyClaimed) {
      showToast(
        language === "en"
          ? "Daily reward has already been claimed today! Come back tomorrow."
          : "Ganjaran harian telah dituntut hari ini! Sila kembali esok untuk ganjaran seterusnya.",
        "info"
      );
      return;
    }
    updateChildProfile({
      coins: activeChild.coins + 50,
      diamonds: activeChild.diamonds + 2,
      streak: activeChild.streak + 1,
      lastDailyRewardDate: todayStr
    });
    triggerConfetti();
    showToast(
      language === "en"
        ? "Congratulations! +50 Coins & +2 Diamonds claimed for today!"
        : "Tahniah! +50 Syiling & +2 Berlian dituntut untuk hari ini!",
      "success"
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Interactive Card: Big Avatar & Pet Care */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-emerald-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
          
          {/* Column 1: Big Avatar & Outfit */}
          <div className="flex flex-col items-center text-center space-y-3 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
            <div className="relative w-28 h-28 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-5xl shadow-lg">
              {activeChild.gender === "boy" ? "👦🏻" : "👧🏽"}
              <span className="absolute -bottom-2 bg-amber-400 text-stone-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                {activeChild.avatar.clothing}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black">{activeChild.name}</h2>
              <p className="text-xs text-emerald-200">
                {language === "en" ? "Young Hero" : "Pahlawan Muda"} • Level {activeChild.level}
              </p>
            </div>

            {/* Streak Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/90 text-stone-900 text-xs font-black shadow-2xs">
              <Flame className="w-4 h-4 text-orange-600 fill-orange-600" />
              <span>
                🔥 {activeChild.streak} {language === "en" ? "Day Streak!" : "Hari Berturut-turut!"}
              </span>
            </div>
          </div>

          {/* Column 2: Pet Care Widget */}
          {(() => {
            const pet = activeChild.pet;
            const stage = pet.evolutionStage || 1;
            const level = pet.level || 1;
            const xpForNext = level * 50;

            let petEmoji = "🐱";
            let stageLabel = "Bayi 🐣";

            if (stage === 1) stageLabel = "Bayi 🐣";
            else if (stage === 2) stageLabel = "Remaja 🐥";
            else if (stage === 3) stageLabel = "Dewasa 🦅";
            else if (stage >= 4) stageLabel = "Mistik 🌟";

            if (pet.type === "cat") {
              petEmoji = stage === 1 ? "🐱" : stage === 2 ? "🐈" : stage === 3 ? "🐅" : "🦁";
            } else if (pet.type === "rabbit") {
              petEmoji = stage === 1 ? "🐰" : stage === 2 ? "🐇" : stage === 3 ? "🐇👑" : "🐰🌟";
            } else if (pet.type === "camel") {
              petEmoji = stage === 1 ? "🐪" : stage === 2 ? "🐫" : stage === 3 ? "🐪👑" : "🐫✨";
            } else {
              petEmoji = stage === 1 ? "🐤" : stage === 2 ? "🦜" : stage === 3 ? "🦅" : "🦅🌟";
            }

            let moodBadge = "😊 Ceria";
            if (pet.hunger < 40) moodBadge = "😋 Lapar!";
            else if (pet.happiness < 40) moodBadge = "😢 Bosan";
            else if ((pet.sleep || 100) < 40) moodBadge = "😴 Ngantuk";

            return (
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      {language === "en" ? "Virtual Pet" : "Haiwan Peliharaan"}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full shadow-2xs">
                      {moodBadge}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/20">
                    Lvl {level} • {stageLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-stone-900 flex items-center justify-center text-3xl shadow-md shrink-0 border-2 border-amber-300/50 relative">
                    <span>{petEmoji}</span>
                    <span className="absolute -bottom-1 -right-1 text-[9px] bg-stone-900 text-amber-300 font-black px-1.5 py-0.2 rounded-md">
                      P{stage}
                    </span>
                  </div>

                  <div className="space-y-1.5 w-full text-xs">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-sm text-white">{pet.name}</h4>
                      <span className="text-[10px] font-bold text-amber-300">
                        {pet.xp}/{xpForNext} XP
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-emerald-200">
                        <span>{language === "en" ? "Fullness" : "Kenyang"}</span>
                        <span>{pet.hunger}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pet.hunger < 40 ? "bg-rose-400 animate-pulse" : "bg-amber-400"
                          }`}
                          style={{ width: `${pet.hunger}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-emerald-200">
                        <span>{language === "en" ? "Happiness" : "Gembira"}</span>
                        <span>{pet.happiness}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pet.happiness < 40 ? "bg-rose-400 animate-pulse" : "bg-pink-400"
                          }`}
                          style={{ width: `${pet.happiness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={feedPet}
                    className="py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-[11px] shadow-2xs cursor-pointer flex items-center justify-center gap-1 border border-amber-300 active:scale-95 transition-all"
                  >
                    <span>{language === "en" ? "🥩 Feed" : "🥩 Makan (-2🪙)"}</span>
                  </button>
                  <button
                    onClick={playWithPet}
                    className="py-1.5 rounded-xl bg-sky-400 hover:bg-sky-500 text-stone-900 font-extrabold text-[11px] shadow-2xs cursor-pointer flex items-center justify-center gap-1 border border-sky-300 active:scale-95 transition-all"
                  >
                    <span>{language === "en" ? "🎾 Play" : "🎾 Main (+XP)"}</span>
                  </button>
                  <button
                    onClick={sleepPet}
                    className="py-1.5 rounded-xl bg-purple-400 hover:bg-purple-500 text-stone-900 font-extrabold text-[11px] shadow-2xs cursor-pointer flex items-center justify-center gap-1 border border-purple-300 active:scale-95 transition-all"
                  >
                    <span>{language === "en" ? "💤 Sleep" : "💤 Tidur"}</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Column 3: Daily Reward & Quick Nav Buttons */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-1">
                <Gift className="w-4 h-4" />
                <span>{language === "en" ? "Daily Reward" : "Ganjaran Harian"} ({activeChild.name})</span>
              </h3>
              <p className="text-[11px] text-emerald-100">
                {language === "en"
                  ? "Claim +50 Coins & +2 Diamonds (once per child every day)!"
                  : "Tuntut +50 Syiling & +2 Berlian (1x sehari untuk setiap anak)!"}
              </p>
            </div>

            <button
              onClick={handleClaimDailyReward}
              disabled={isDailyClaimed}
              className={`w-full py-2.5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                isDailyClaimed
                  ? "bg-white/20 text-emerald-100 cursor-not-allowed border border-white/20"
                  : "bg-amber-400 hover:bg-amber-500 text-stone-900 cursor-pointer hover:scale-102"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>
                {isDailyClaimed
                  ? language === "en"
                    ? "✓ Claimed Today (Ready Tomorrow)"
                    : "✓ Selesai Dituntut (Kembali Esok)"
                  : language === "en"
                  ? "Tuntut Ganjaran Hari Ini (+50 🪙 +2 💎)"
                  : "Tuntut Ganjaran Hari Ini (+50 🪙 +2 💎)"}
              </span>
            </button>

            {/* Hub Quick Links */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 text-[10px] font-bold">
              <button
                onClick={onNavigateToWorld}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-center transition-colors cursor-pointer"
              >
                {language === "en" ? "🗺️ World" : "🗺️ Dunia"}
              </button>
              <button
                onClick={onNavigateToShop}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-center transition-colors cursor-pointer"
              >
                {language === "en" ? "🛍️ Shop" : "🛍️ Kedai"}
              </button>
              <button
                onClick={onNavigateToLeaderboard}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-center transition-colors cursor-pointer"
              >
                {language === "en" ? "🏆 Ranks" : "🏆 Carta"}
              </button>
              {onNavigateToGames && (
                <button
                  onClick={onNavigateToGames}
                  className="p-1.5 rounded-xl bg-amber-400 text-stone-950 font-black text-center shadow-xs hover:bg-amber-300 transition-all cursor-pointer"
                >
                  🎮 Game
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Hourly Schedule & Routines (Arranged Hour by Hour & Linked with Modules) */}
      <HourlyScheduleModule
        onNavigateToSolat={onNavigateToSolat}
        onNavigateToJawi={onNavigateToJawi}
        onNavigateToHafazan={onNavigateToHafazan}
        onNavigateToDiari={onNavigateToDiari}
        onNavigateToGames={onNavigateToGames}
        onNavigateToWorld={onNavigateToWorld}
      />
    </div>
  );
};
