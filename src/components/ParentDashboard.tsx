import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MissionCategory, MissionDifficulty } from "../types";
import {
  CheckCircle2,
  XCircle,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  Calendar,
  BarChart3,
  MessageSquare,
  Users,
  Brain,
  ShieldCheck,
  Coins,
  ChevronRight,
  Trash2,
  RefreshCw,
  UserPlus,
  Lock,
  LogIn
} from "lucide-react";

interface ParentDashboardProps {
  onOpenLoginModal?: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onOpenLoginModal }) => {
  const {
    language,
    user,
    childrenProfiles,
    activeChildId,
    setActiveChildId,
    activeChild,
    addChildProfile,
    deleteChildProfile,
    updateChildProfile,
    penalizeChild,
    missions,
    addMission,
    approveMission,
    approveMissionCustomRewards,
    rejectMission,
    parentPin,
    updateParentPin,
    resetToCleanData,
    loadDemoData,
    showToast
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // Rejection Reason State
  const [rejectingMissionId, setRejectingMissionId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Approval custom reward adjustment state (key: missionId)
  const [customXpMap, setCustomXpMap] = useState<Record<string, number>>({});
  const [customCoinsMap, setCustomCoinsMap] = useState<Record<string, number>>({});

  // PIN Settings State
  const [newPinInput, setNewPinInput] = useState("");

  // New Child Form State
  const [cName, setCName] = useState("");
  const [cAge, setCAge] = useState(7);
  const [cGender, setCGender] = useState<"boy" | "girl">("boy");
  const [cPetType, setCPetType] = useState<"cat" | "rabbit" | "bird" | "camel">("cat");
  const [cPetName, setCPetName] = useState("");

  // New Mission Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<MissionCategory>("Islamic");
  const [newDifficulty, setNewDifficulty] = useState<MissionDifficulty>("Mudah");
  const [newXp, setNewXp] = useState(40);
  const [newCoins, setNewCoins] = useState(15);
  const [newDesc, setNewDesc] = useState("");

  // Custom Reward Form State
  const [rewardTitle, setRewardTitle] = useState(activeChild?.customReward?.title || "Bercuti ke Legoland");
  const [rewardTargetXp, setRewardTargetXp] = useState(activeChild?.customReward?.targetXp || 500);

  React.useEffect(() => {
    if (activeChild?.customReward) {
      setRewardTitle(activeChild.customReward.title);
      setRewardTargetXp(activeChild.customReward.targetXp);
    } else {
      setRewardTitle("Bercuti ke Legoland");
      setRewardTargetXp(500);
    }
  }, [activeChildId]);

  const handleSaveCustomReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChild || !rewardTitle.trim()) return;
    updateChildProfile({
      customReward: {
        title: rewardTitle.trim(),
        targetXp: Number(rewardTargetXp),
        unlocked: activeChild.xp >= Number(rewardTargetXp)
      }
    });
    showToast(
      language === "en"
        ? `Special reward '${rewardTitle}' saved for ${activeChild.name}!`
        : `Ganjaran khas '${rewardTitle}' disimpan untuk ${activeChild.name}!`,
      "success"
    );
  };

  // Penalty / Disciplinary Form State
  const [penaltyReason, setPenaltyReason] = useState("");
  const [penaltyXp, setPenaltyXp] = useState(30);
  const [penaltyCoins, setPenaltyCoins] = useState(15);

  const PENALTY_PRESETS = [
    { label: "Meninggalkan Solat Fardhu", xp: 50, coins: 20, icon: "🕌" },
    { label: "Tidak Membuat Kerja Sekolah", xp: 30, coins: 15, icon: "📚" },
    { label: "Ponteng / Datang Lewat Sekolah", xp: 40, coins: 20, icon: "🏫" },
    { label: "Bercakap Kasar / Mengamuk", xp: 25, coins: 10, icon: "🗣️" },
    { label: "Terlebih Gunakan Gajet / Skrin", xp: 20, coins: 10, icon: "📱" },
    { label: "Sepahkan Rumah / Tidak Kemas Bilik", xp: 20, coins: 10, icon: "🧹" }
  ];

  const handleApplyPenalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChild || !penaltyReason.trim()) return;
    penalizeChild(activeChild.id, penaltyXp, penaltyCoins, penaltyReason.trim());
    setPenaltyReason("");
  };

  const handleApplyPresetPenalty = (preset: typeof PENALTY_PRESETS[0]) => {
    if (!activeChild) return;
    penalizeChild(activeChild.id, preset.xp, preset.coins, preset.label);
  };

  const MISSION_PRESETS = [
    { title: "Solat Subuh Berjemaah", category: "Islamic" as MissionCategory, difficulty: "Mudah" as MissionDifficulty, xp: 50, coins: 20, desc: "Tunaikan Solat Subuh tepat pada waktunya bersama keluarga." },
    { title: "Solat Zohor / Asar", category: "Islamic" as MissionCategory, difficulty: "Mudah" as MissionDifficulty, xp: 40, coins: 15, desc: "Tunaikan Solat Fardhu dan semak bacaan." },
    { title: "Membaca Iqra / Al-Quran (1 Muka)", category: "Islamic" as MissionCategory, difficulty: "Sederhana" as MissionDifficulty, xp: 60, coins: 25, desc: "Baca 1 muka surat Iqra atau Al-Quran dengan tajwid betul." },
    { title: "Membaca Surah Hafazan Short Surah", category: "Islamic" as MissionCategory, difficulty: "Mudah" as MissionDifficulty, xp: 45, coins: 15, desc: "Hafal atau ulang baca Surah Al-Ikhlas / Al-Falaq / An-Nas." },
    { title: "Kemas Tempat Tidur & Bilik", category: "Chores" as MissionCategory, difficulty: "Mudah" as MissionDifficulty, xp: 35, coins: 10, desc: "Susun bantal, selimut dan pastikan bilik kemas." },
    { title: "Bantu Basuh & Susun Pinggan", category: "Chores" as MissionCategory, difficulty: "Mudah" as MissionDifficulty, xp: 40, coins: 15, desc: "Bantu ibu di dapur selepas makan." },
    { title: "Menulis & Membaca Jawi", category: "Jawi" as MissionCategory, difficulty: "Sederhana" as MissionDifficulty, xp: 50, coins: 20, desc: "Selesaikan latihan menyebut dan mengeja huruf Jawi." }
  ];

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim()) return;
    addChildProfile({
      name: cName.trim(),
      age: Number(cAge),
      gender: cGender,
      petType: cPetType,
      petName: cPetName.trim() || undefined
    });
    setCName("");
    setCPetName("");
    setShowAddChildModal(false);
  };

  // Filter Missions for active child
  const childMissions = activeChildId ? missions.filter((m) => m.childId === activeChildId) : [];
  const pendingMissions = childMissions.filter((m) => m.status === "pending_approval");
  const approvedMissions = childMissions.filter((m) => m.status === "approved");

  const completionRate =
    childMissions.length > 0
      ? Math.round((approvedMissions.length / childMissions.length) * 100)
      : 0;

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addMission({
      title: newTitle,
      description: newDesc || "Tugasan khas daripada Ibu Bapa.",
      category: newCategory,
      difficulty: newDifficulty,
      xpReward: Number(newXp),
      coinReward: Number(newCoins)
    });

    setNewTitle("");
    setNewDesc("");
    setShowAddModal(false);
  };

  const handleApplyPreset = (p: typeof MISSION_PRESETS[0]) => {
    setNewTitle(p.title);
    setNewCategory(p.category);
    setNewDifficulty(p.difficulty);
    setNewXp(p.xp);
    setNewCoins(p.coins);
    setNewDesc(p.desc);
  };

  const handleGenerateAiSuggestions = async () => {
    if (!activeChild) return;
    setAiLoading(true);
    setAiSuggestions([]);

    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: activeChild.name,
          childAge: activeChild.age,
          focusArea: "Islamic & Jawi",
          language
        })
      });

      const data = await res.json();
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error(err);
      showToast("Gagal mendapatkan cadangan AI.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAdoptAiSuggestion = (s: any) => {
    addMission({
      title: s.title,
      description: s.reasoning || "Cadangan AI khusus mengikut umur.",
      category: s.category || "Islamic",
      difficulty: "Sederhana",
      xpReward: s.xp || 40,
      coinReward: s.coins || 15
    });
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-4 max-w-lg mx-auto my-12 shadow-md">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl font-black shadow-inner">
          🔒
        </div>
        <h2 className="text-xl font-black text-stone-900">
          {language === "en" ? "Parent Access Restricted" : "Akses Ibu Bapa Dihadkan"}
        </h2>
        <p className="text-xs text-stone-600 font-medium leading-relaxed">
          {language === "en"
            ? "Please log in with your registered email and password to view and manage children profiles, missions, and progress."
            : "Sila log masuk menggunakan emel dan kata laluan yang telah didaftarkan untuk melihat dan menguruskan profil anak, tugasan serta prestasi."}
        </p>
        <button
          onClick={onOpenLoginModal}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{language === "en" ? "Log In Parent Account" : "Log Masuk Akaun Ibu Bapa"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-stone-900">
                Assalamu'alaikum, {user?.name || "Ibu Bapa MudahKids"}! 👋
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Parent Portal
              </span>
            </div>
            <p className="text-stone-500 text-xs mt-1">
              Pantau perkembangan ibadah, pembelajaran Jawi dan tugasan anak-anak hari ini.
            </p>
          </div>

          {/* Controls: Add Child, Reset & Demo Load */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAddChildModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Profil Anak</span>
            </button>
            <button
              onClick={loadDemoData}
              title="Muat data contoh untuk pengujian"
              className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer border border-amber-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Data Demo</span>
            </button>
            <button
              onClick={async () => {
                if (window.confirm("Adakah anda pasti ingin mengosongkan semua data profil dan tugasan?")) {
                  await resetToCleanData();
                }
              }}
              title="Reset dan kosongkan semua data"
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Children Tabs */}
        {childrenProfiles.length > 0 && (
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl overflow-x-auto">
            <span className="text-xs font-bold text-stone-500 pl-2 shrink-0">Pilih Profil Anak:</span>
            {childrenProfiles.map((c) => (
              <div key={c.id} className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setActiveChildId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeChildId === c.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900 bg-white"
                  }`}
                >
                  <span>{c.gender === "boy" ? "👦" : "👧"}</span>
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-80">({c.age} thn)</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Padam profil ${c.name}?`)) {
                      deleteChildProfile(c.id);
                    }
                  }}
                  className="text-stone-400 hover:text-rose-600 p-1 rounded-lg hover:bg-stone-200 transition-all cursor-pointer"
                  title="Padam profil anak ini"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IF NO CHILDREN EXIST: Clean Starter State */}
      {childrenProfiles.length === 0 || !activeChild ? (
        <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-4 max-w-2xl mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-3xl mx-auto">
            👶
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-stone-900">Belum Ada Profil Anak</h3>
            <p className="text-stone-500 text-xs leading-relaxed max-w-md mx-auto">
              Aplikasi ini berada dalam keadaan bersih (tanpa data pemula). Sila tambah profil anak anda untuk memulakan tugasan solat, mengaji, dan aktiviti harian!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowAddChildModal(true)}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Profil Anak Pertama</span>
            </button>
            <button
              onClick={loadDemoData}
              className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs transition-all cursor-pointer border border-stone-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Muat Data Contoh Demo</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Progress Cards Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">Kadar Selesai</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-stone-900">{completionRate}%</div>
              <p className="text-[10px] text-stone-500 font-medium">
                {approvedMissions.length} daripada {childMissions.length} tugasan disahkan
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">Menunggu Kelulusan</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">
                {pendingMissions.length}
              </div>
              <p className="text-[10px] text-stone-500 font-medium">Memerlukan semakan 1-tap anda</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">Syiling Anak</span>
                <Coins className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-stone-900">🪙 {activeChild.coins}</div>
              <p className="text-[10px] text-stone-500 font-medium">Level {activeChild.level} • {activeChild.xp} XP</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold">Streak Disiplin</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">🔥 {activeChild.streak} Hari</div>
              <p className="text-[10px] text-stone-500 font-medium">Peningkatan tabiat yang konsisten</p>
            </div>
          </div>

          {/* Pending Approvals Section */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  ⏳
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    Kelulusan Tugasan {activeChild.name} ({pendingMissions.length})
                  </h3>
                  <p className="text-stone-500 text-xs">
                    Sahkan tugasan yang telah diselesaikan oleh {activeChild.name} dengan 1-Tap.
                  </p>
                </div>
              </div>
            </div>

            {pendingMissions.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto opacity-70" />
                <p className="text-xs font-bold text-stone-600">Tiada tugasan yang menunggu kelulusan.</p>
                <p className="text-[11px] text-stone-400">Semua tugasan {activeChild.name} yang dihantar telah disahkan!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingMissions.map((m) => {
                  const currentXp = customXpMap[m.id] !== undefined ? customXpMap[m.id] : (m.requestedXp || m.xpReward || 40);
                  const currentCoins = customCoinsMap[m.id] !== undefined ? customCoinsMap[m.id] : (m.requestedCoins || m.coinReward || 15);
                  const isRejectingThis = rejectingMissionId === m.id;

                  return (
                    <div
                      key={m.id}
                      className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-3 transition-all"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1 max-w-xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                              {m.category}
                            </span>
                            {m.createdByChild && (
                              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                                🌟 Inisiatif Anak
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-stone-900 text-base">{m.title}</h4>
                          <p className="text-xs text-stone-600">{m.description}</p>
                          {m.proofNote && (
                            <div className="text-xs bg-white p-2.5 rounded-xl border border-amber-200 text-amber-950 font-medium italic">
                              💬 Catatan/Bukti Anak: "{m.proofNote}"
                            </div>
                          )}
                        </div>

                        {/* Points & Coins Determination Box */}
                        <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-2xs space-y-2 min-w-[220px]">
                          <span className="text-[11px] font-extrabold text-stone-700 block">
                            Tentukan Hadiah XP & Syiling:
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">
                                Set XP
                              </label>
                              <input
                                type="number"
                                step="5"
                                value={currentXp}
                                onChange={(e) =>
                                  setCustomXpMap((prev) => ({
                                    ...prev,
                                    [m.id]: Number(e.target.value)
                                  }))
                                }
                                className="w-full px-2 py-1 rounded-lg border border-stone-300 font-bold text-emerald-700 text-xs text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">
                                Set Syiling 🪙
                              </label>
                              <input
                                type="number"
                                step="5"
                                value={currentCoins}
                                onChange={(e) =>
                                  setCustomCoinsMap((prev) => ({
                                    ...prev,
                                    [m.id]: Number(e.target.value)
                                  }))
                                }
                                className="w-full px-2 py-1 rounded-lg border border-stone-300 font-bold text-amber-600 text-xs text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rejection Reason Form or Main Action Buttons */}
                      {isRejectingThis ? (
                        <div className="pt-3 border-t border-amber-200/80 space-y-2.5 bg-rose-50/80 p-3 rounded-2xl border border-rose-200">
                          <label className="block text-xs font-extrabold text-rose-900">
                            Sebab Penolakan (Anak akan dapat baca catatan ini):
                          </label>
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Contoh: Perlu bukti foto / Sila dapatkan pengesahan guru dahulu..."
                            className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            required
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingMissionId(null);
                                setRejectReason("");
                              }}
                              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!rejectReason.trim()) {
                                  showToast("Sila tulis sebab penolakan.", "error");
                                  return;
                                }
                                rejectMission(m.id, rejectReason.trim());
                                setRejectingMissionId(null);
                                setRejectReason("");
                              }}
                              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-2xs"
                            >
                              Sahkan Tolak Aktiviti Ini
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-amber-200/60 flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRejectingMissionId(m.id)}
                            className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Tolak Aktiviti</span>
                          </button>

                          <button
                            onClick={() =>
                              approveMissionCustomRewards(
                                m.id,
                                currentXp,
                                currentCoins,
                                "Sangat bagus dan berinisiatif tinggi anakanda!"
                              )
                            }
                            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Luluskan & Beri +{currentXp} XP & +{currentCoins} 🪙</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Solat Progress Card for Parent */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl">
                  🕌
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    Rekod Solat 5 Waktu & Sunat ({activeChild.name})
                  </h3>
                  <p className="text-stone-500 text-xs">
                    Semak penyempurnaan solat fardhu dan solat sunat anak anda hari ini.
                  </p>
                </div>
              </div>
            </div>

            {(() => {
              const todayStr = new Date().toISOString().split("T")[0];
              const history = activeChild.solatProgress?.history || [];
              const todayLog = history.find((entry) => entry.date === todayStr);

              const subuh = todayLog?.fardhu?.subuh;
              const zohor = todayLog?.fardhu?.zohor;
              const asar = todayLog?.fardhu?.asar;
              const maghrib = todayLog?.fardhu?.maghrib;
              const isyak = todayLog?.fardhu?.isyak;

              const fardhuItems = [
                { name: "Subuh", data: subuh },
                { name: "Zohor", data: zohor },
                { name: "Asar", data: asar },
                { name: "Maghrib", data: maghrib },
                { name: "Isyak", data: isyak }
              ];

              const completedCount = fardhuItems.filter((item) => item.data?.completed).length;

              return (
                <div className="space-y-3">
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">
                        Solat Fardhu Hari Ini ({todayStr})
                      </span>
                      <div className="text-lg font-black text-stone-900 pt-1">
                        {completedCount}/5 Waktu Disempurnakan
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {fardhuItems.map((item) => (
                        <div
                          key={item.name}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 ${
                            item.data?.completed
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "bg-stone-200 text-stone-500"
                          }`}
                        >
                          <span>{item.data?.completed ? "✓" : "•"}</span>
                          <span>{item.name}</span>
                          {item.data?.berjemaah && <span title="Berjemaah">👥</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Reading Progress Card for Parent */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl">
                  📖
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    Diari Rekod Bacaan Al-Quran & Iqra ({activeChild.name})
                  </h3>
                  <p className="text-stone-500 text-xs">
                    Pantau dan semak kedudukan muka surat bacaan terkini anak anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Current reading badge */}
            {activeChild.quranIqraProgress ? (
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                    Kedudukan Terkini Ditanda Anak
                  </span>
                  <div className="text-lg font-black text-stone-900 flex items-center gap-2 pt-1">
                    {activeChild.quranIqraProgress.currentType === "iqra" ? (
                      <>
                        <span>📗 Iqra {activeChild.quranIqraProgress.currentIqraLevel || 1}</span>
                        <span>•</span>
                        <span className="text-emerald-700">
                          Muka Surat {activeChild.quranIqraProgress.currentIqraPage || 1}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>📖 Surah {activeChild.quranIqraProgress.currentQuranSurahName || "Al-Fatihah"}</span>
                        <span>•</span>
                        <span className="text-emerald-700">
                          Juz {activeChild.quranIqraProgress.currentQuranJuzuk || 1}, M/S {activeChild.quranIqraProgress.currentQuranPage || 1}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right text-xs text-stone-500 font-medium">
                  <div>Kemaskini Terakhir:</div>
                  <div className="font-bold text-stone-800">
                    {activeChild.quranIqraProgress.lastUpdated
                      ? new Date(activeChild.quranIqraProgress.lastUpdated).toLocaleDateString("ms-MY", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })
                      : "Hari ini"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-600 text-xs font-medium">
                Anak belum menanda rekod bacaan lagi.
              </div>
            )}

            {/* Recent history log */}
            {activeChild.quranIqraProgress?.history && activeChild.quranIqraProgress.history.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-extrabold text-stone-700 uppercase">Sejarah Rekod Terkini:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activeChild.quranIqraProgress.history.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-stone-900">{log.title}</span>
                        {log.parentNote && (
                          <p className="text-[11px] text-emerald-800 italic mt-0.5">💬 "{log.parentNote}"</p>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 font-semibold shrink-0">
                        {new Date(log.completedAt).toLocaleDateString("ms-MY")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Missions Management & Action Buttons */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg">
                  Pengurusan Tugasan & Misi ({childMissions.length})
                </h3>
                <p className="text-stone-500 text-xs">
                  Senarai tugasan aktif untuk {activeChild.name}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAiModal(true)}
                  className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Cadang Tugasan</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Tugasan Baru</span>
                </button>
              </div>
            </div>

            {/* List of Child Missions */}
            {childMissions.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-3">
                <p className="text-xs font-bold text-stone-600">Belum ada tugasan dicipta untuk {activeChild.name}.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer inline-block"
                >
                  + Cipta Tugasan Pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {childMissions.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 ${
                      m.status === "approved"
                        ? "bg-emerald-50/40 border-emerald-200"
                        : m.status === "pending_approval"
                        ? "bg-amber-50/40 border-amber-200"
                        : "bg-stone-50 border-stone-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                          {m.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : m.status === "pending_approval"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          {m.status === "approved"
                            ? "✓ Selesai"
                            : m.status === "pending_approval"
                            ? "⏳ Semakan"
                            : "Belum Dibuat"}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-stone-900 text-sm">{m.title}</h4>
                      <p className="text-xs text-stone-500">{m.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-stone-600 pt-2 border-t border-stone-200/60">
                      <span>Ganjaran: +{m.xpReward} XP</span>
                      <span className="text-amber-600">🪙 {m.coinReward} Syiling</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Family Reward (Target XP) Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center font-black text-xl shadow-2xs">
                🎁
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">
                  Ganjaran Khas Ibu Bapa (Sasaran XP)
                </h3>
                <p className="text-stone-600 text-xs">
                  Tetapkan ganjaran istimewa sekeluarga (contoh: Bercuti ke Legoland, Hadiah Mainan, Pizza Party) apabila {activeChild.name} mencapai XP tertentu.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCustomReward} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">
                  Nama Ganjaran Khas
                </label>
                <input
                  type="text"
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  placeholder="Contoh: Bercuti ke Legoland / Hari Pizza"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">
                  Sasaran XP Diperlukan
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={rewardTargetXp}
                  onChange={(e) => setRewardTargetXp(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>✨ Simpan Ganjaran {activeChild.name}</span>
              </button>
            </form>

            {activeChild.customReward && (
              <div className="p-3 bg-white/80 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between">
                <span>
                  📍 Ganjaran Aktif Sekarang: <strong>{activeChild.customReward.title}</strong>
                </span>
                <span className="bg-amber-200 px-3 py-1 rounded-full text-amber-900 font-extrabold">
                  {activeChild.xp} / {activeChild.customReward.targetXp} XP
                </span>
              </div>
            )}
          </div>

          {/* Disciplinary Penalty & Deduction Section */}
          <div className="bg-rose-50 rounded-3xl p-6 border border-rose-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-xl shadow-2xs">
                ⚠️
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">
                  Penolakan Point & Syiling (Teguran & Disiplin)
                </h3>
                <p className="text-stone-600 text-xs">
                  Ibu bapa boleh menolak XP & Syiling bagi memberi pengajaran jika {activeChild.name} membuat kesalahan seperti meninggalkan solat, tidak buat kerja sekolah, atau ponteng.
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-stone-700 block">
                Pilihan Pantas Perbuatan Tidak Baik:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {PENALTY_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPresetPenalty(preset)}
                    className="p-3 bg-white rounded-2xl border border-rose-200 hover:border-rose-400 text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs group space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                        -{preset.xp} XP | -{preset.coins} 🪙
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-stone-900 group-hover:text-rose-700 transition-colors">
                      {preset.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Penalty Form */}
            <form onSubmit={handleApplyPenalty} className="pt-3 border-t border-rose-200/60 space-y-3">
              <span className="text-xs font-extrabold text-stone-700 block">
                Atau Taip Sebab & Jumlah Penolakan Khas:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Sebab / Catatan Kesalahan
                  </label>
                  <input
                    type="text"
                    value={penaltyReason}
                    onChange={(e) => setPenaltyReason(e.target.value)}
                    placeholder="Contoh: Bermain gajet tanpa kebenaran"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Tolak XP
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={penaltyXp}
                    onChange={(e) => setPenaltyXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Tolak Syiling
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={penaltyCoins}
                    onChange={(e) => setPenaltyCoins(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚠️ Tolak Point & Syiling {activeChild.name}</span>
              </button>
            </form>
          </div>

          {/* Parent PIN Security Control */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center font-black text-xl shadow-2xs">
                🔒
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">
                  Kawalan Akses & PIN Ibu Bapa
                </h3>
                <p className="text-stone-600 text-xs">
                  Pastikan anak-anak tidak boleh menceroboh ke mod Ibu Bapa dengan menetapkan PIN 4-digit keselamatan.
                </p>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-stone-500">PIN Semasa Keselamatan:</div>
                <div className="text-lg font-black tracking-widest text-emerald-700 font-mono">
                  {parentPin ? "•••• (" + parentPin + ")" : "1234 (Defaulu)"}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newPinInput.length !== 4 || !/^\d+$/.test(newPinInput)) {
                    showToast("Sila masukkan 4 digit nombor sah.", "error");
                    return;
                  }
                  updateParentPin(newPinInput);
                  showToast("PIN Ibu Bapa berjaya dikemaskini!", "success");
                  setNewPinInput("");
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="password"
                  maxLength={4}
                  placeholder="PIN Baru 4 Digit"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-stone-300 font-mono text-center font-extrabold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs shadow-2xs transition-all cursor-pointer"
                >
                  Simpan PIN Baru
                </button>
              </form>
            </div>
          </div>

          {/* Parent AI Tips & Insights */}
          <div className="bg-amber-500/10 rounded-3xl p-6 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
              <Brain className="w-5 h-5 text-amber-600" />
              <span>Analisis Tingkah Laku & Panduan Didikan MudahKids</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {activeChild.name} menunjukkan perkembangan konsisten dengan streak {activeChild.streak} hari! Beliau sangat bermotivasi apabila tugasan Islamic dan Chores diberikan secara seimbang.
            </p>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-medium">
              💡 <strong>Saranan AI Ibu Bapa:</strong> Teruskan beri pujian secara lisan apabila {activeChild.name} menyelesaikan tugasan tanpa perlu disuruh.
            </div>
          </div>
        </>
      )}

      {/* Modal: Add Child Profile */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-lg">Tambah Profil Anak Baru</h3>
              <button
                onClick={() => setShowAddChildModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddChild} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">Nama Anak</label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Adam"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">Umur (Tahun)</label>
                  <input
                    type="number"
                    min={3}
                    max={17}
                    value={cAge}
                    onChange={(e) => setCAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">Jantina</label>
                  <select
                    value={cGender}
                    onChange={(e) => setCGender(e.target.value as "boy" | "girl")}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="boy">Lelaki (👦)</option>
                    <option value="girl">Perempuan (👧)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">Haiwan Peliharaan</label>
                  <select
                    value={cPetType}
                    onChange={(e) => setCPetType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="cat">🐱 Kucing</option>
                    <option value="rabbit">🐰 Arnab</option>
                    <option value="bird">🦜 Burung</option>
                    <option value="camel">🐪 Unta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">Nama Haiwan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Comel"
                    value={cPetName}
                    onChange={(e) => setCPetName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                + Simpan Profil Anak (+50 Syiling Bonus)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Quick Mission */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-lg">Tambah Tugasan Baharu</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets Bar */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-stone-700">💡 Template Tugasan Pantas:</label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {MISSION_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-[11px] font-bold shrink-0 transition-all cursor-pointer"
                  >
                    + {p.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-3 pt-2 border-t border-stone-200">
              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">Tajuk Tugasan</label>
                <input
                  type="text"
                  placeholder="Contoh: Solat Subuh berjemaah"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MissionCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Islamic">Islamic</option>
                    <option value="Jawi">Jawi</option>
                    <option value="Chores">Chores</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">Kesukaran</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as MissionDifficulty)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sederhana">Sederhana</option>
                    <option value="Cabar">Cabar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">Ganjaran XP</label>
                  <input
                    type="number"
                    value={newXp}
                    onChange={(e) => setNewXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">Ganjaran Syiling</label>
                  <input
                    type="number"
                    value={newCoins}
                    onChange={(e) => setNewCoins(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">Penerangan / Arahan</label>
                <textarea
                  placeholder="Keterangan tugasan untuk anak..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs h-16"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Cipta & Hantar Tugasan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gemini AI Suggestions */}
      {showAiModal && activeChild && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-stone-900 text-lg">AI Cadangan Tugasan Smart</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Disuaikan mengikut profil {activeChild.name} (Umur {activeChild.age} tahun).
            </p>

            {aiLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-stone-600">Jana cadangan AI Gemini...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {aiSuggestions.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-xs text-stone-500">Klik butang di bawah untuk menjana cadangan tugasan AI.</p>
                    <button
                      onClick={handleGenerateAiSuggestions}
                      className="px-4 py-2 bg-amber-400 text-stone-900 font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      Jana Cadangan Tugasan Sekarang
                    </button>
                  </div>
                ) : (
                  aiSuggestions.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            {s.category}
                          </span>
                          <h4 className="font-extrabold text-stone-900 text-xs">{s.title}</h4>
                        </div>
                        <p className="text-[11px] text-stone-500">{s.reasoning}</p>
                      </div>

                      <button
                        onClick={() => {
                          handleAdoptAiSuggestion(s);
                          setShowAiModal(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer"
                      >
                        + Gunakan
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
