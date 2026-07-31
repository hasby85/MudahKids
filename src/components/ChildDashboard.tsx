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
  Hammer
} from "lucide-react";

interface ChildDashboardProps {
  onNavigateToWorld: () => void;
  onNavigateToShop: () => void;
  onNavigateToLeaderboard: () => void;
  onNavigateToJawi: () => void;
  onNavigateToHafazan?: () => void;
}

export const ChildDashboard: React.FC<ChildDashboardProps> = ({
  onNavigateToWorld,
  onNavigateToShop,
  onNavigateToLeaderboard,
  onNavigateToJawi,
  onNavigateToHafazan
}) => {
  const {
    language,
    activeChild,
    setRole,
    missions,
    completeMission,
    submitChildCustomMission,
    feedPet,
    playWithPet,
    sleepPet,
    updateChildProfile,
    showToast
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<"Islamic" | "Jawi" | "Hafazan" | "Chores">("Islamic");
  const [showProofModal, setShowProofModal] = useState<string | null>(null);
  const [proofNote, setProofNote] = useState("");
  const [dailyClaimed, setDailyClaimed] = useState(false);

  // Custom task proposal state
  const [showCustomTaskModal, setShowCustomTaskModal] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customCategory, setCustomCategory] = useState<"Islamic" | "Jawi" | "Chores">("Chores");
  const [customReqXp, setCustomReqXp] = useState(40);
  const [customReqCoins, setCustomReqCoins] = useState(15);

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

  // Filter Missions
  const childMissions = missions.filter((m) => m.childId === activeChild.id);
  const categoryMissions = childMissions.filter((m) => m.category === activeCategory);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleClaimDailyReward = () => {
    if (dailyClaimed) {
      showToast(
        language === "en"
          ? "Daily reward has already been claimed today!"
          : "Ganjaran harian telah dituntut hari ini!",
        "info"
      );
      return;
    }
    updateChildProfile({
      coins: activeChild.coins + 50,
      diamonds: activeChild.diamonds + 2,
      streak: activeChild.streak + 1
    });
    setDailyClaimed(true);
    triggerConfetti();
    showToast(
      language === "en"
        ? "Congratulations! +50 Coins & +2 Diamonds claimed!"
        : "Tahniah! +50 Syiling & +2 Berlian dituntut!",
      "success"
    );
  };

  const handleSubmitProof = (missionId: string) => {
    completeMission(
      missionId,
      undefined,
      proofNote || (language === "en" ? "Mission completed!" : "Selesai disiapkan!")
    );
    setShowProofModal(null);
    setProofNote("");
    triggerConfetti();
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
                <span>{language === "en" ? "MudahKids Daily Reward" : "Ganjaran Harian MudahKids"}</span>
              </h3>
              <p className="text-[11px] text-emerald-100">
                {language === "en"
                  ? "Claim +50 Coins & +2 Diamonds free daily!"
                  : "Tuntut +50 Syiling & +2 Berlian percuma setiap hari!"}
              </p>
            </div>

            <button
              onClick={handleClaimDailyReward}
              disabled={dailyClaimed}
              className={`w-full py-2.5 rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                dailyClaimed
                  ? "bg-white/20 text-stone-300 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-500 text-stone-900"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>
                {dailyClaimed
                  ? language === "en"
                    ? "✓ Reward Claimed"
                    : "✓ Ganjaran Dituntut"
                  : language === "en"
                  ? "Claim Today's Reward"
                  : "Tuntut Ganjaran Hari Ini"}
              </span>
            </button>

            {/* Hub Quick Links */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-bold">
              <button
                onClick={onNavigateToWorld}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-center transition-colors cursor-pointer"
              >
                {language === "en" ? "🗺️ World" : "🗺️ Dunia"}
              </button>
              <button
                onClick={onNavigateToShop}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-center transition-colors cursor-pointer"
              >
                {language === "en" ? "🛍️ Shop" : "🛍️ Kedai"}
              </button>
              <button
                onClick={onNavigateToLeaderboard}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-center transition-colors cursor-pointer"
              >
                {language === "en" ? "🏆 Ranks" : "🏆 Carta"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Family Target Reward Banner (e.g. Legoland Trip) */}
      {activeChild.customReward && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-3xl p-6 text-stone-900 shadow-lg border-2 border-amber-300 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-stone-900 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                🎁
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-stone-900 text-amber-300 px-2.5 py-0.5 rounded-full">
                  {language === "en" ? "Parent's Special Reward Target" : "Ganjaran Khas Ibu Bapa"}
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  {activeChild.customReward.title}
                </h3>
                <p className="text-xs font-semibold text-stone-800">
                  {language === "en"
                    ? `Reach ${activeChild.customReward.targetXp} XP to unlock this special family reward!`
                    : `Kumpul sehingga ${activeChild.customReward.targetXp} XP untuk membuka ganjaran istimewa ini!`}
                </p>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shrink-0 text-center space-y-1 min-w-[160px] shadow-sm">
              <span className="text-[10px] font-extrabold text-stone-500 uppercase">
                {language === "en" ? "XP Progress" : "Kemajuan XP"}
              </span>
              <div className="text-lg font-black text-emerald-700">
                {activeChild.xp} / {activeChild.customReward.targetXp} XP
              </div>
              <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((activeChild.xp / activeChild.customReward.targetXp) * 100)
                    )}%`
                  }}
                />
              </div>
              {activeChild.xp >= activeChild.customReward.targetXp && (
                <span className="block text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  🎉 {language === "en" ? "Target Unlocked!" : "Sasaran Tercapai!"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Missions Section Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-stone-900">
              {language === "en" ? "Today's Missions 🎯" : "Misi Hari Ini 🎯"}
            </h3>
            <p className="text-stone-500 text-xs">
              {language === "en"
                ? "Complete missions to earn coins and build your Nusantara world!"
                : "Selesaikan misi untuk mengumpul syiling dan membina dunia Nusantara anda!"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Child Custom Activity Proposal CTA Button */}
            <button
              onClick={() => setShowCustomTaskModal(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-900 font-extrabold text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300"
            >
              <span>🌟 {language === "en" ? "+ Propose Custom Activity" : "+ Cadang Aktiviti Luar Aplikasi"}</span>
            </button>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1.5 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setActiveCategory("Islamic")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategory === "Islamic"
                    ? "bg-emerald-600 text-white shadow-2xs font-extrabold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {language === "en" ? "🕌 Daily Habits" : "🕌 Solat & Ibadah"}
              </button>
              <button
                onClick={() => setActiveCategory("Jawi")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategory === "Jawi"
                    ? "bg-emerald-600 text-white shadow-2xs font-extrabold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {language === "en" ? "✏️ Learn Jawi" : "✏️ Belajar Jawi"}
              </button>
              <button
                onClick={() => setActiveCategory("Hafazan")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategory === "Hafazan"
                    ? "bg-emerald-600 text-white shadow-2xs font-extrabold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {language === "en" ? "📜 Hafazan Module" : "📜 Modul Hafazan"}
              </button>
              <button
                onClick={() => setActiveCategory("Chores")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategory === "Chores"
                    ? "bg-emerald-600 text-white shadow-2xs font-extrabold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {language === "en" ? "🧹 House Chores" : "🧹 Tugasan Rumah"}
              </button>
            </div>
          </div>
        </div>

        {/* If Hafazan category is selected, offer direct launch into Hafazan Module */}
        {activeCategory === "Hafazan" && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-extrabold text-teal-950 text-sm">
                {language === "en" ? "Interactive Hafazan Module" : "Modul Hafazan Surah-Surah Pilihan"}
              </h4>
              <p className="text-xs text-teal-800">
                {language === "en"
                  ? "Memorize 10 selected Surahs with audio recitations, hide-and-reveal practice, and verse quizzes!"
                  : `Hafal 10 Surah Pilihan (Al-Fatihah, 3 Qul, dll.) & dapatkan gelaran eksklusif ${
                      activeChild.gender === "boy" ? "Hafiz Cilik" : "Hafizah Cilik"
                    }!`}
              </p>
            </div>
            {onNavigateToHafazan && (
              <button
                onClick={onNavigateToHafazan}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-2xs cursor-pointer shrink-0"
              >
                {language === "en" ? "Open Hafazan Module →" : "Buka Modul Hafazan →"}
              </button>
            )}
          </div>
        )}

        {/* If Jawi is selected, offer direct launch into Jawi Module */}
        {activeCategory === "Jawi" && (
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-extrabold text-sky-900 text-sm">
                {language === "en" ? "Interactive Jawi Module" : "Modul Latihan Jawi Interaktif"}
              </h4>
              <p className="text-xs text-sky-700">
                {language === "en"
                  ? "Trace letters, play quizzes, and build words interactively."
                  : "Tekap huruf, main kuiz dan bina perkataan Jawi secara langsung."}
              </p>
            </div>
            <button
              onClick={onNavigateToJawi}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-2xs cursor-pointer"
            >
              {language === "en" ? "Open Jawi Module →" : "Buka Modul Jawi →"}
            </button>
          </div>
        )}

        {/* Mission Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryMissions.map((m) => (
            <div
              key={m.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                m.status === "approved"
                  ? "bg-emerald-50/60 border-emerald-200 opacity-90"
                  : m.status === "pending_approval"
                  ? "bg-amber-50/60 border-amber-200"
                  : "bg-white border-stone-200 hover:border-emerald-300"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    {m.difficulty === "Mudah"
                      ? language === "en"
                        ? "Easy"
                        : "Mudah"
                      : m.difficulty === "Sederhana"
                      ? language === "en"
                        ? "Medium"
                        : "Sederhana"
                      : language === "en"
                      ? "Challenging"
                      : "Cabar"}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-stone-800">
                    <span>+{m.xpReward} XP</span>
                    <span>•</span>
                    <span className="text-amber-600">+{m.coinReward} 🪙</span>
                  </div>
                </div>

                <h4 className="font-extrabold text-stone-900 text-base">{m.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{m.description}</p>

                {m.parentComment && (
                  <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-900 text-xs font-semibold italic">
                    💬 {language === "en" ? "Parent" : "Ibu Bapa"}: "{m.parentComment}"
                  </div>
                )}

                {m.status === "rejected" && m.rejectionReason && (
                  <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-200 text-rose-900 text-xs font-bold space-y-0.5">
                    <div>❌ {language === "en" ? "Task Declined by Parent" : "Tugasan Ditolak Ibu Bapa"}:</div>
                    <div className="italic text-[11px] font-medium text-rose-800">
                      "{m.rejectionReason}"
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                {m.status === "approved" ? (
                  <div className="w-full py-2.5 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xs text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {language === "en" ? "✓ Completed & Approved" : "✓ Selesai & Disahkan Ibu Bapa"}
                    </span>
                  </div>
                ) : m.status === "pending_approval" ? (
                  <div className="w-full py-2.5 rounded-2xl bg-amber-100 text-amber-900 font-extrabold text-xs text-center flex items-center justify-center gap-1.5">
                    <span>
                      {language === "en" ? "⏳ Pending Parent Approval" : "⏳ Menunggu Kelulusan Ibu Bapa"}
                    </span>
                  </div>
                ) : m.status === "rejected" ? (
                  <button
                    onClick={() => setShowProofModal(m.id)}
                    className="w-full py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{language === "en" ? "Hantar Semula Tugasan" : "Hantar Semula Tugasan"}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowProofModal(m.id)}
                    className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{language === "en" ? "Submit Completed Task" : "Hantar Tugasan Selesai"}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proof Submission Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-lg">
                {language === "en" ? "Submit Task Proof" : "Hantar Bukti Tugasan"}
              </h3>
              <button
                onClick={() => setShowProofModal(null)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500">
              {language === "en"
                ? "Add a note or small message for your parents."
                : "Tambah ucapan atau catatan kecil untuk disampaikan kepada ibu bapa anda."}
            </p>

            <div>
              <label className="block text-xs font-extrabold text-stone-700 mb-1">
                {language === "en" ? "Child Mission Note" : "Catatan Misi Anak"}
              </label>
              <textarea
                placeholder={
                  language === "en"
                    ? "E.g., I completed my morning chores on time!"
                    : "Contoh: Saya dah solat Subuh bersama ayah tepat waktu!"
                }
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs h-24 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleSubmitProof(showProofModal)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
            >
              {language === "en" ? "Submit for Parent Approval" : "Hantar untuk Kelulusan Ibu Bapa"}
            </button>
          </div>
        </div>
      )}

      {/* Child Custom Task Proposal Modal */}
      {showCustomTaskModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌟</span>
                <h3 className="font-extrabold text-stone-900 text-base">
                  Cadang Aktiviti Luar Aplikasi
                </h3>
              </div>
              <button
                onClick={() => setShowCustomTaskModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Anakanda boleh masukkan aktiviti atau kebaikan yang dilakukan di luar aplikasi (seperti membantu cikgu di sekolah, membantu jiran, atau membersihkan kelas). Ibu bapa akan menyemak dan menentukan ganjaran XP & Syiling!
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customTitle.trim()) {
                  showToast("Sila masukkan tajuk aktiviti.", "error");
                  return;
                }
                submitChildCustomMission({
                  title: customTitle.trim(),
                  description: customDesc.trim() || "Aktiviti/kebaikan inisiatif sendiri oleh anak.",
                  category: customCategory,
                  requestedXp: Number(customReqXp),
                  requestedCoins: Number(customReqCoins)
                });
                setShowCustomTaskModal(false);
                setCustomTitle("");
                setCustomDesc("");
                triggerConfetti();
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-extrabold text-stone-700 mb-1">
                  Tajuk Aktiviti / Kebaikan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Membantu cikgu menyusun buku di sekolah"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-extrabold text-stone-700 mb-1">
                  Penerangan Ringkas
                </label>
                <textarea
                  placeholder="Contoh: Saya tolong cikgu angkat buku latihan dan kemaskan bilik guru selepas waktu persekolahan."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium h-20 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-stone-700 mb-1">
                    Cadangan XP
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={customReqXp}
                    onChange={(e) => setCustomReqXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-stone-700 mb-1">
                    Cadangan Syiling 🪙
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={customReqCoins}
                    onChange={(e) => setCustomReqCoins(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-amber-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md cursor-pointer mt-2"
              >
                Hantar kepada Ibu Bapa untuk Semakan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
