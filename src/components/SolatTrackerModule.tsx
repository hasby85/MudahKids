import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
  User,
  Clock,
  Award,
  Flame,
  Star,
  Info,
  Check,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  HeartHandshake
} from "lucide-react";
import { SolatLogEntry } from "../types";

export const SolatTrackerModule: React.FC = () => {
  const { language, activeChild, updateChildProfile, showToast } = useApp();

  // Helper for formatted today YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [dailyNote, setDailyNote] = useState<string>("");

  if (!activeChild) {
    return null;
  }

  const solatHistory = activeChild.solatProgress?.history || [];

  // Find existing log for selectedDate or create clean state
  const currentLog = solatHistory.find((entry) => entry.date === selectedDate) || {
    id: `solat-${selectedDate}`,
    date: selectedDate,
    fardhu: {
      subuh: { completed: false, berjemaah: false },
      zohor: { completed: false, berjemaah: false },
      asar: { completed: false, berjemaah: false },
      maghrib: { completed: false, berjemaah: false },
      isyak: { completed: false, berjemaah: false }
    },
    sunat: {
      dhuha: false,
      tahajjud: false,
      witir: false,
      rawatib: false,
      tarawih: false,
      hajat: false,
      taubat: false
    },
    note: "",
    updatedAt: new Date().toISOString()
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Toggle Fardhu Prayer
  const handleToggleFardhu = (prayerKey: "subuh" | "zohor" | "asar" | "maghrib" | "isyak") => {
    const isCurrentlyCompleted = currentLog.fardhu[prayerKey].completed;
    const isBerjemaah = currentLog.fardhu[prayerKey].berjemaah || false;

    const newCompleted = !isCurrentlyCompleted;

    const updatedLog: SolatLogEntry = {
      ...currentLog,
      fardhu: {
        ...currentLog.fardhu,
        [prayerKey]: {
          completed: newCompleted,
          berjemaah: newCompleted ? isBerjemaah : false
        }
      },
      updatedAt: new Date().toISOString()
    };

    saveSolatLog(updatedLog, prayerKey, newCompleted, isBerjemaah ? "berjemaah" : "bersendirian");
  };

  // Toggle Berjemaah Status
  const handleToggleBerjemaah = (
    prayerKey: "subuh" | "zohor" | "asar" | "maghrib" | "isyak",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!currentLog.fardhu[prayerKey].completed) return;

    const newBerjemaah = !currentLog.fardhu[prayerKey].berjemaah;

    const updatedLog: SolatLogEntry = {
      ...currentLog,
      fardhu: {
        ...currentLog.fardhu,
        [prayerKey]: {
          ...currentLog.fardhu[prayerKey],
          berjemaah: newBerjemaah
        }
      },
      updatedAt: new Date().toISOString()
    };

    saveSolatLog(updatedLog, prayerKey, true, newBerjemaah ? "berjemaah" : "bersendirian");
  };

  // Toggle Sunat Prayer
  const handleToggleSunat = (
    sunatKey: "dhuha" | "tahajjud" | "witir" | "rawatib" | "tarawih" | "hajat" | "taubat"
  ) => {
    const isCurrentlyCompleted = !!currentLog.sunat[sunatKey];
    const newCompleted = !isCurrentlyCompleted;

    const updatedLog: SolatLogEntry = {
      ...currentLog,
      sunat: {
        ...currentLog.sunat,
        [sunatKey]: newCompleted
      },
      updatedAt: new Date().toISOString()
    };

    saveSolatLog(updatedLog, sunatKey, newCompleted, "sunat");
  };

  // Save log function with rewards update
  const saveSolatLog = (
    updatedLog: SolatLogEntry,
    actionKey: string,
    isCompleted: boolean,
    mode: "berjemaah" | "bersendirian" | "sunat"
  ) => {
    // Check if entry exists in history
    const existingIndex = solatHistory.findIndex((entry) => entry.date === selectedDate);
    let newHistory: SolatLogEntry[] = [];

    if (existingIndex >= 0) {
      newHistory = [...solatHistory];
      newHistory[existingIndex] = updatedLog;
    } else {
      newHistory = [updatedLog, ...solatHistory];
    }

    // Calculate total count
    let totalFardhu = 0;
    let totalSunat = 0;

    newHistory.forEach((entry) => {
      Object.values(entry.fardhu).forEach((f) => {
        if (f.completed) totalFardhu++;
      });
      Object.values(entry.sunat).forEach((s) => {
        if (s) totalSunat++;
      });
    });

    // XP / Coins Calculation
    let xpGain = 0;
    let coinGain = 0;

    if (isCompleted) {
      if (mode === "berjemaah") {
        xpGain = 50;
        coinGain = 20;
      } else if (mode === "bersendirian") {
        xpGain = 30;
        coinGain = 10;
      } else {
        // Sunat
        xpGain = 25;
        coinGain = 10;
      }
    }

    const newXp = activeChild.xp + xpGain;
    const newCoins = activeChild.coins + coinGain;

    // Check if 5/5 fardhu completed for today
    const fardhuCountToday = Object.values(updatedLog.fardhu).filter((f) => f.completed).length;
    const isAll5Completed = fardhuCountToday === 5;

    updateChildProfile({
      xp: newXp,
      coins: newCoins,
      solatProgress: {
        history: newHistory,
        totalFardhuCount: totalFardhu,
        totalSunatCount: totalSunat,
        currentStreak: isAll5Completed ? (activeChild.solatProgress?.currentStreak || 0) + 1 : activeChild.solatProgress?.currentStreak || 0
      }
    });

    if (isCompleted) {
      if (isAll5Completed) {
        triggerCelebration();
        showToast(
          language === "en"
            ? "🎉 Subhanallah! All 5 obligatory prayers recorded today! (+100 XP Bonus)"
            : "🎉 Subhanallah! Lengkap 5 waktu solat fardhu hari ini! (+100 XP Bonus)",
          "success"
        );
      } else {
        showToast(
          language === "en"
            ? `✓ Prayer logged! (+${xpGain} XP, +${coinGain} Coins)`
            : `✓ Solat direkodkan! (+${xpGain} XP, +${coinGain} Syiling)`,
          "success"
        );
      }
    }
  };

  // Save Note Function
  const handleSaveNote = () => {
    const updatedLog: SolatLogEntry = {
      ...currentLog,
      note: dailyNote,
      updatedAt: new Date().toISOString()
    };

    const existingIndex = solatHistory.findIndex((entry) => entry.date === selectedDate);
    let newHistory: SolatLogEntry[] = [];

    if (existingIndex >= 0) {
      newHistory = [...solatHistory];
      newHistory[existingIndex] = updatedLog;
    } else {
      newHistory = [updatedLog, ...solatHistory];
    }

    updateChildProfile({
      solatProgress: {
        ...(activeChild.solatProgress || {
          totalFardhuCount: 0,
          totalSunatCount: 0,
          currentStreak: 0
        }),
        history: newHistory
      }
    });

    showToast(
      language === "en" ? "Catatan solat berjaya disimpan!" : "Catatan solat berjaya disimpan!",
      "success"
    );
  };

  // Count Fardhu for current selected date
  const completedFardhuCount = Object.values(currentLog.fardhu).filter(
    (f: { completed: boolean }) => f.completed
  ).length;
  const completedSunatCount = Object.values(currentLog.sunat).filter((s) => s).length;

  // Prayer metadata lists
  const fardhuList = [
    {
      key: "subuh" as const,
      nameBm: "Subuh",
      nameEn: "Fajr",
      rakaatBm: "2 Rakaat",
      rakaatEn: "2 Rak'ahs",
      timeBm: "Fajar Sadiq - Terbit Matahari",
      timeEn: "Dawn - Sunrise",
      icon: "🌅",
      colorBg: "from-sky-500 to-indigo-600",
      accentColor: "border-sky-300 text-sky-900 bg-sky-50"
    },
    {
      key: "zohor" as const,
      nameBm: "Zohor",
      nameEn: "Dhuhr",
      rakaatBm: "4 Rakaat",
      rakaatEn: "4 Rak'ahs",
      timeBm: "Gelincir Matahari - Bayang Sama Panjang",
      timeEn: "Midday - Afternoon",
      icon: "☀️",
      colorBg: "from-amber-400 to-amber-600",
      accentColor: "border-amber-300 text-amber-900 bg-amber-50"
    },
    {
      key: "asar" as const,
      nameBm: "Asar",
      nameEn: "Asr",
      rakaatBm: "4 Rakaat",
      rakaatEn: "4 Rak'ahs",
      timeBm: "Bayang Lebih Panjang - Terbenam Matahari",
      timeEn: "Late Afternoon - Sunset",
      icon: "🌤️",
      colorBg: "from-orange-400 to-orange-600",
      accentColor: "border-orange-300 text-orange-900 bg-orange-50"
    },
    {
      key: "maghrib" as const,
      nameBm: "Maghrib",
      nameEn: "Maghrib",
      rakaatBm: "3 Rakaat",
      rakaatEn: "3 Rak'ahs",
      timeBm: "Terbenam Matahari - Hilang Syafaq Merah",
      timeEn: "Sunset - Dusk",
      icon: "🌅",
      colorBg: "from-rose-500 to-pink-600",
      accentColor: "border-rose-300 text-rose-900 bg-rose-50"
    },
    {
      key: "isyak" as const,
      nameBm: "Isyak",
      nameEn: "Isha",
      rakaatBm: "4 Rakaat",
      rakaatEn: "4 Rak'ahs",
      timeBm: "Hilang Syafaq - Terbit Fajar",
      timeEn: "Night - Before Dawn",
      icon: "🌙",
      colorBg: "from-indigo-600 to-purple-800",
      accentColor: "border-purple-300 text-purple-900 bg-purple-50"
    }
  ];

  const sunatList = [
    {
      key: "dhuha" as const,
      nameBm: "Solat Sunat Dhuha",
      nameEn: "Dhuha Prayer",
      descBm: "2 atau 4 Rakaat • Murah rezeki & keberkatan pagi",
      icon: "☀️"
    },
    {
      key: "tahajjud" as const,
      nameBm: "Solat Sunat Tahajjud (Qiamullail)",
      nameEn: "Tahajjud Night Prayer",
      descBm: "Digalakkan bangun di 1/3 malam selepas tidur",
      icon: "🌌"
    },
    {
      key: "witir" as const,
      nameBm: "Solat Sunat Witir",
      nameEn: "Witir Prayer",
      descBm: "1, 3, atau 5 Rakaat Ganjil sebagai penutup malam",
      icon: "✨"
    },
    {
      key: "rawatib" as const,
      nameBm: "Solat Sunat Rawatib (Qobliyah & Ba'diyyah)",
      nameEn: "Rawatib Sunnah Prayer",
      descBm: "Sunat mengiringi sebelum/selepas Solat Fardhu",
      icon: "🕌"
    },
    {
      key: "tarawih" as const,
      nameBm: "Solat Sunat Tarawih (Bulan Ramadan)",
      nameEn: "Tarawih Night Prayer",
      descBm: "8 atau 20 Rakaat dalam bulan suci Ramadan",
      icon: "🌙"
    },
    {
      key: "hajat" as const,
      nameBm: "Solat Sunat Hajat",
      nameEn: "Hajat Request Prayer",
      descBm: "2 Rakaat mohon hajat dan bantuan daripada Allah",
      icon: "🤲"
    },
    {
      key: "taubat" as const,
      nameBm: "Solat Sunat Taubat",
      nameEn: "Taubat Repentance Prayer",
      descBm: "2 Rakaat mohon keampunan dosa daripada Allah",
      icon: "🤍"
    }
  ];

  // Helper for 7 days history
  const getLast7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  };

  const last7Days = getLast7Days();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 text-white p-6 md:p-8 shadow-xl border-2 border-emerald-400">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center font-black text-3xl shadow-lg shrink-0">
              🕌
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-stone-900 text-[10px] font-black uppercase mb-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-stone-900 fill-stone-900" />
                <span>{language === "en" ? "Daily Prayer Tracker" : "Rekod Solat Fardhu & Sunat"}</span>
              </div>
              <h2 className="text-2xl font-black">
                {language === "en" ? "Prayer Diary" : "Diari Solat Cilik MudahKids"}
              </h2>
              <p className="text-xs text-emerald-100 max-w-lg mt-0.5">
                {language === "en"
                  ? "Record your 5 daily obligatory prayers and sunnah prayers to earn XP, gold coins, and build good daily habits!"
                  : "Tanda solat 5 waktu dan solat sunat setiap hari untuk mengumpul XP, syiling emas, serta membentuk disiplin ibadah!"}
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-xs">
            <div className="text-center px-3 border-r border-white/20">
              <span className="block text-[10px] uppercase font-bold text-emerald-200">
                {language === "en" ? "Today's Fardhu" : "Fardhu Hari Ini"}
              </span>
              <span className="text-xl font-black text-amber-300">
                {completedFardhuCount} / 5
              </span>
            </div>
            <div className="text-center px-3 border-r border-white/20">
              <span className="block text-[10px] uppercase font-bold text-emerald-200">
                {language === "en" ? "Sunnat" : "Solat Sunat"}
              </span>
              <span className="text-xl font-black text-amber-300">{completedSunatCount}</span>
            </div>
            <div className="text-center px-2">
              <span className="block text-[10px] uppercase font-bold text-emerald-200">
                {language === "en" ? "Streak" : "Istiqamah"}
              </span>
              <span className="text-xl font-black text-amber-300">
                🔥 {activeChild.solatProgress?.currentStreak || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector & Today Progress Bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h3 className="font-extrabold text-stone-900 text-sm md:text-base">
                {language === "en" ? "Select Date to Record:" : "Pilih Tarikh Rekod Solat:"}
              </h3>
              <p className="text-stone-500 text-xs">
                {selectedDate === getTodayString()
                  ? language === "en"
                    ? "📅 Recording for TODAY"
                    : "📅 Merekod untuk HARI INI"
                  : `📅 Merekod tarikh: ${selectedDate}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            />
            {selectedDate !== getTodayString() && (
              <button
                type="button"
                onClick={() => setSelectedDate(getTodayString())}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer shadow-2xs"
              >
                {language === "en" ? "Today" : "Hari Ini"}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold">
            <span className="text-stone-700">
              {language === "en" ? "Obligatory Prayer Progress (5 Waktu):" : "Kemajuan Solat Fardhu 5 Waktu:"}
            </span>
            <span className="text-emerald-700">
              {completedFardhuCount}/5 ({Math.round((completedFardhuCount / 5) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                completedFardhuCount === 5
                  ? "from-emerald-500 to-teal-600"
                  : completedFardhuCount >= 3
                  ? "from-amber-400 to-emerald-500"
                  : "from-orange-400 to-amber-500"
              }`}
              style={{ width: `${(completedFardhuCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: Solat Fardhu 5 Waktu */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <span>🕌</span>
              <span>{language === "en" ? "5 Obligatory Daily Prayers (Solat Fardhu)" : "Solat Fardhu 5 Waktu Sehari"}</span>
            </h3>
            <p className="text-stone-500 text-xs">
              {language === "en"
                ? "Click to check as completed. Toggle 'Berjemaah' for extra bonus rewards!"
                : "Tekan kad untuk tanda selesai. Pilih 'Solat Berjemaah' untuk ganjaran bonus berganda!"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {fardhuList.map((p) => {
            const prayerState = currentLog.fardhu[p.key];
            const isDone = prayerState.completed;
            const isJam = prayerState.berjemaah;

            return (
              <div
                key={p.key}
                onClick={() => handleToggleFardhu(p.key)}
                className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 select-none ${
                  isDone
                    ? "bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20 scale-[1.02]"
                    : "bg-white border-stone-200 hover:border-emerald-300 hover:shadow-sm"
                }`}
              >
                {/* Checkbox Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{p.icon}</span>
                  <div
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
                        : "border-stone-300 bg-stone-50"
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                {/* Prayer Title & Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-stone-900 text-base">
                      {language === "en" ? p.nameEn : p.nameBm}
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {language === "en" ? p.rakaatEn : p.rakaatBm}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 font-medium leading-tight">
                    {language === "en" ? p.timeEn : p.timeBm}
                  </p>
                </div>

                {/* Berjemaah / Bersendirian Toggle Button */}
                <div className="pt-2 border-t border-stone-100 space-y-2" onClick={(e) => e.stopPropagation()}>
                  {isDone ? (
                    <button
                      type="button"
                      onClick={(e) => handleToggleBerjemaah(p.key, e)}
                      className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                        isJam
                          ? "bg-amber-400 hover:bg-amber-500 text-stone-900 border-amber-300 shadow-xs"
                          : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300"
                      }`}
                    >
                      {isJam ? (
                        <>
                          <Users className="w-3.5 h-3.5 text-stone-900 fill-stone-900" />
                          <span>Berjemaah 🔥 (+50 XP)</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5 text-stone-600" />
                          <span>Bersendirian (+30 XP)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-[10px] font-bold text-stone-400 text-center py-1 bg-stone-50 rounded-xl border border-stone-100">
                      Ganjaran: +30 to +50 XP
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Solat Sunat & Voluntary Prayers */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <span>✨</span>
            <span>{language === "en" ? "Sunnah & Voluntary Prayers (Solat Sunat)" : "Rekod Solat-Solat Sunat"}</span>
          </h3>
          <p className="text-stone-500 text-xs">
            {language === "en"
              ? "Optionally record sunnah prayers performed to earn extra +25 XP and +10 Gold Coins per prayer!"
              : "Tanda mana-mana solat sunat yang telah dilaksanakan untuk dapatkan bonus tambahan +25 XP & +10 Syiling Emas!"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sunatList.map((s) => {
            const isSunatDone = !!currentLog.sunat[s.key];

            return (
              <div
                key={s.key}
                onClick={() => handleToggleSunat(s.key)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                  isSunatDone
                    ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20"
                    : "bg-stone-50/60 border-stone-200 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0">{s.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-xs md:text-sm">
                      {language === "en" ? s.nameEn : s.nameBm}
                    </h4>
                    <p className="text-[10px] text-stone-500 font-medium">
                      {s.descBm}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSunatDone
                      ? "bg-amber-500 border-amber-500 text-stone-900 shadow-2xs font-bold"
                      : "border-stone-300 bg-white"
                  }`}
                >
                  {isSunatDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Catatan Harian & Parent Note */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 md:p-8 border border-stone-800 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center font-black text-xl shrink-0">
            ✍️
          </div>
          <div>
            <h3 className="font-extrabold text-sm md:text-base text-white">
              {language === "en" ? "Daily Prayer Notes & Remarks" : "Catatan Harian & Bimbingan Solat"}
            </h3>
            <p className="text-xs text-stone-400">
              {language === "en"
                ? "Write notes like 'Prayed in congregation at mosque with dad' or 'Learned surah during Isha'."
                : "Tulis catatan seperti 'Solat di masjid bersama Ayah' atau 'Solat bersama kawan di sekolah'."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={dailyNote || currentLog.note || ""}
            onChange={(e) => setDailyNote(e.target.value)}
            placeholder={
              language === "en"
                ? "e.g., Alhamdulillah prayed Fajr at mosque with family!"
                : "Contoh: Alhamdulillah solat Subuh berjemaah di masjid bersama keluarga!"
            }
            className="flex-1 px-4 py-3 rounded-2xl bg-stone-800 border border-stone-700 text-xs font-medium text-white placeholder-stone-500 outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="button"
            onClick={handleSaveNote}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-xs transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
          >
            {language === "en" ? "Save Note" : "Simpan Catatan"}
          </button>
        </div>
      </div>

      {/* SECTION 4: 7-Day History Overview Table */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
            <span>📊</span>
            <span>{language === "en" ? "7-Day Prayer Summary" : "Ringkasan Solat 7 Hari Terakhir"}</span>
          </h3>
          <span className="text-[11px] font-bold text-stone-500">
            {language === "en" ? "Past week performance" : "Prestasi mingguan"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px] font-black">
                <th className="py-2.5 px-3">Tarikh</th>
                <th className="py-2.5 px-2 text-center">Subuh</th>
                <th className="py-2.5 px-2 text-center">Zohor</th>
                <th className="py-2.5 px-2 text-center">Asar</th>
                <th className="py-2.5 px-2 text-center">Maghrib</th>
                <th className="py-2.5 px-2 text-center">Isyak</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {last7Days.map((dateStr) => {
                const log = solatHistory.find((entry) => entry.date === dateStr);
                const fardhuObj = log?.fardhu || {
                  subuh: { completed: false },
                  zohor: { completed: false },
                  asar: { completed: false },
                  maghrib: { completed: false },
                  isyak: { completed: false }
                };

                const count = Object.values(fardhuObj).filter(
                  (f: { completed: boolean }) => f.completed
                ).length;
                const isToday = dateStr === getTodayString();

                return (
                  <tr key={dateStr} className={isToday ? "bg-amber-50/60 font-bold" : "hover:bg-stone-50"}>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className="text-emerald-700 hover:underline font-bold cursor-pointer"
                      >
                        {dateStr} {isToday ? "(Hari Ini)" : ""}
                      </button>
                    </td>

                    {["subuh", "zohor", "asar", "maghrib", "isyak"].map((pKey) => {
                      const item = fardhuObj[pKey as keyof typeof fardhuObj];
                      return (
                        <td key={pKey} className="py-3 px-2 text-center">
                          {item?.completed ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                              {item.berjemaah ? "👥" : "✓"}
                            </span>
                          ) : (
                            <span className="text-stone-300 font-bold">•</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          count === 5
                            ? "bg-emerald-100 text-emerald-800"
                            : count >= 3
                            ? "bg-amber-100 text-amber-900"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {count}/5
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
