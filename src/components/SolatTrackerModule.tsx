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
  Heart,
  AlertCircle,
  Plus,
  Minus,
  History,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  FlameKindling
} from "lucide-react";
import {
  SolatLogEntry,
  FardhuPrayerKey,
  FardhuPrayerStatus,
  FardhuPrayerItem,
  QadhaPrayerCount,
  QadhaHistoryEntry
} from "../types";

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

  const [activeTab, setActiveTab] = useState<"diary" | "fiqh">("diary");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [dailyNote, setDailyNote] = useState<string>("");

  // Filters for Missed Prayers Tracker By Date (Gabungan Tracker & Diari)
  const [missedFilterStatus, setMissedFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [missedPrayerFilter, setMissedPrayerFilter] = useState<"all" | FardhuPrayerKey>("all");

  // Modal / Inputs for Manual Qadha adjustment
  const [showManualQadhaModal, setShowManualQadhaModal] = useState<boolean>(false);
  const [manualCounts, setManualCounts] = useState<QadhaPrayerCount>({
    subuh: 0,
    zohor: 0,
    asar: 0,
    maghrib: 0,
    isyak: 0
  });

  if (!activeChild) {
    return null;
  }

  const solatHistory = activeChild.solatProgress?.history || [];

  // Default Qadha counts from profile or fallback
  const defaultQadha: QadhaPrayerCount = {
    subuh: 0,
    zohor: 0,
    asar: 0,
    maghrib: 0,
    isyak: 0
  };

  const qadhaPending: QadhaPrayerCount = {
    ...defaultQadha,
    ...(activeChild.solatProgress?.qadhaPending || {})
  };

  const qadhaCompleted: QadhaPrayerCount = {
    ...defaultQadha,
    ...(activeChild.solatProgress?.qadhaCompleted || {})
  };

  const qadhaHistory: QadhaHistoryEntry[] = activeChild.solatProgress?.qadhaHistory || [];

  const totalQadhaPending =
    qadhaPending.subuh +
    qadhaPending.zohor +
    qadhaPending.asar +
    qadhaPending.maghrib +
    qadhaPending.isyak;

  const totalQadhaCompleted =
    qadhaCompleted.subuh +
    qadhaCompleted.zohor +
    qadhaCompleted.asar +
    qadhaCompleted.maghrib +
    qadhaCompleted.isyak;

  // Find existing log for selectedDate or initialize clean state
  const rawLog = solatHistory.find((entry) => entry.date === selectedDate);
  const currentLog: SolatLogEntry = rawLog
    ? {
        ...rawLog,
        fardhu: {
          subuh: {
            completed: rawLog.fardhu.subuh?.completed || false,
            berjemaah: rawLog.fardhu.subuh?.berjemaah || false,
            status:
              rawLog.fardhu.subuh?.status ||
              (rawLog.isDayExcused
                ? "dimaafkan"
                : rawLog.fardhu.subuh?.completed
                ? "completed"
                : "none"),
            qadhaDone: rawLog.fardhu.subuh?.qadhaDone || false,
            qadhaDate: rawLog.fardhu.subuh?.qadhaDate
          },
          zohor: {
            completed: rawLog.fardhu.zohor?.completed || false,
            berjemaah: rawLog.fardhu.zohor?.berjemaah || false,
            status:
              rawLog.fardhu.zohor?.status ||
              (rawLog.isDayExcused
                ? "dimaafkan"
                : rawLog.fardhu.zohor?.completed
                ? "completed"
                : "none"),
            qadhaDone: rawLog.fardhu.zohor?.qadhaDone || false,
            qadhaDate: rawLog.fardhu.zohor?.qadhaDate
          },
          asar: {
            completed: rawLog.fardhu.asar?.completed || false,
            berjemaah: rawLog.fardhu.asar?.berjemaah || false,
            status:
              rawLog.fardhu.asar?.status ||
              (rawLog.isDayExcused
                ? "dimaafkan"
                : rawLog.fardhu.asar?.completed
                ? "completed"
                : "none"),
            qadhaDone: rawLog.fardhu.asar?.qadhaDone || false,
            qadhaDate: rawLog.fardhu.asar?.qadhaDate
          },
          maghrib: {
            completed: rawLog.fardhu.maghrib?.completed || false,
            berjemaah: rawLog.fardhu.maghrib?.berjemaah || false,
            status:
              rawLog.fardhu.maghrib?.status ||
              (rawLog.isDayExcused
                ? "dimaafkan"
                : rawLog.fardhu.maghrib?.completed
                ? "completed"
                : "none"),
            qadhaDone: rawLog.fardhu.maghrib?.qadhaDone || false,
            qadhaDate: rawLog.fardhu.maghrib?.qadhaDate
          },
          isyak: {
            completed: rawLog.fardhu.isyak?.completed || false,
            berjemaah: rawLog.fardhu.isyak?.berjemaah || false,
            status:
              rawLog.fardhu.isyak?.status ||
              (rawLog.isDayExcused
                ? "dimaafkan"
                : rawLog.fardhu.isyak?.completed
                ? "completed"
                : "none"),
            qadhaDone: rawLog.fardhu.isyak?.qadhaDone || false,
            qadhaDate: rawLog.fardhu.isyak?.qadhaDate
          }
        },
        sunat: rawLog.sunat || {
          dhuha: false,
          tahajjud: false,
          witir: false,
          rawatib: false,
          tarawih: false,
          hajat: false,
          taubat: false
        }
      }
    : {
        id: `solat-${selectedDate}`,
        date: selectedDate,
        isDayExcused: false,
        fardhu: {
          subuh: { completed: false, berjemaah: false, status: "none" },
          zohor: { completed: false, berjemaah: false, status: "none" },
          asar: { completed: false, berjemaah: false, status: "none" },
          maghrib: { completed: false, berjemaah: false, status: "none" },
          isyak: { completed: false, berjemaah: false, status: "none" }
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

  // Prayer metadata lists
  const fardhuList: {
    key: FardhuPrayerKey;
    nameBm: string;
    nameEn: string;
    rakaatBm: string;
    rakaatEn: string;
    timeBm: string;
    timeEn: string;
    icon: string;
    niatQadhaRumi: string;
    niatQadhaArab: string;
  }[] = [
    {
      key: "subuh",
      nameBm: "Subuh",
      nameEn: "Fajr",
      rakaatBm: "2 Rakaat",
      rakaatEn: "2 Rak'ahs",
      timeBm: "Fajar Sadiq - Terbit Matahari",
      timeEn: "Dawn - Sunrise",
      icon: "🌅",
      niatQadhaRumi: "Usolli fardhas-Subhi rak'ataini qadaan lillahi Ta'ala",
      niatQadhaArab: "أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ قَضَاءً لِلَّهِ تَعَالَى"
    },
    {
      key: "zohor",
      nameBm: "Zohor",
      nameEn: "Dhuhr",
      rakaatBm: "4 Rakaat",
      rakaatEn: "4 Rak'ahs",
      timeBm: "Gelincir Matahari - Bayang Sama Panjang",
      timeEn: "Midday - Afternoon",
      icon: "☀️",
      niatQadhaRumi: "Usolli fardhaz-Zuhri arba'a raka'atin qadaan lillahi Ta'ala",
      niatQadhaArab: "أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ قَضَاءً لِلَّهِ تَعَالَى"
    },
    {
      key: "asar",
      nameBm: "Asar",
      nameEn: "Asr",
      rakaatBm: "4 Rakaat",
      rakaatEn: "4 Rak'ahs",
      timeBm: "Bayang Lebih Panjang - Terbenam Matahari",
      timeEn: "Late Afternoon - Sunset",
      icon: "🌤️",
      niatQadhaRumi: "Usolli fardhal-'Asri arba'a raka'atin qadaan lillahi Ta'ala",
      niatQadhaArab: "أُصَلِّي فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ قَضَاءً لِلَّهِ تَعَالَى"
    },
    {
      key: "maghrib",
      nameBm: "Maghrib",
      nameEn: "Maghrib",
      rakaatBm: "3 Rakaat",
      rakaatEn: "3 Rak'ahs",
      timeBm: "Terbenam Matahari - Hilang Syafaq Merah",
      timeEn: "Sunset - Dusk",
      icon: "🌇",
      niatQadhaRumi: "Usolli fardhal-Maghribi thalatha raka'atin qadaan lillahi Ta'ala",
      niatQadhaArab: "أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ قَضَاءً لِلَّهِ تَعَالَى"
    },
    {
      key: "isyak",
      nameBm: "Isyak",
      nameEn: "Isha",
      rakaatBm: "4 Rakaat",
      rakaatEn: "4 Rak'ahs",
      timeBm: "Hilang Syafaq - Terbit Fajar",
      timeEn: "Night - Before Dawn",
      icon: "🌙",
      niatQadhaRumi: "Usolli fardhal-'Isya-i arba'a raka'atin qadaan lillahi Ta'ala",
      niatQadhaArab: "أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ قَضَاءً لِلَّهِ تَعَالَى"
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

  // Helper to persist updated Solat log + Qadha calculations
  const commitSolatChanges = (
    updatedLog: SolatLogEntry,
    additionalQadhaPendingDelta: Partial<QadhaPrayerCount> = {},
    messageSuccess?: string,
    celebrate = false
  ) => {
    const existingIndex = solatHistory.findIndex((entry) => entry.date === selectedDate);
    let newHistory: SolatLogEntry[] = [];

    if (existingIndex >= 0) {
      newHistory = [...solatHistory];
      newHistory[existingIndex] = updatedLog;
    } else {
      newHistory = [updatedLog, ...solatHistory];
    }

    // Recompute total fardhu & sunat counts
    let totalFardhu = 0;
    let totalSunat = 0;

    newHistory.forEach((entry) => {
      Object.values(entry.fardhu).forEach((f) => {
        if (f.completed) totalFardhu++;
      });
      Object.values(entry.sunat || {}).forEach((s) => {
        if (s) totalSunat++;
      });
    });

    // Update pending Qadha counts if changed
    const newPendingQadha: QadhaPrayerCount = {
      subuh: Math.max(0, qadhaPending.subuh + (additionalQadhaPendingDelta.subuh || 0)),
      zohor: Math.max(0, qadhaPending.zohor + (additionalQadhaPendingDelta.zohor || 0)),
      asar: Math.max(0, qadhaPending.asar + (additionalQadhaPendingDelta.asar || 0)),
      maghrib: Math.max(0, qadhaPending.maghrib + (additionalQadhaPendingDelta.maghrib || 0)),
      isyak: Math.max(0, qadhaPending.isyak + (additionalQadhaPendingDelta.isyak || 0))
    };

    const fardhuCountToday = Object.values(updatedLog.fardhu).filter((f) => f.completed).length;
    const isAll5Completed = fardhuCountToday === 5;

    updateChildProfile({
      solatProgress: {
        history: newHistory,
        totalFardhuCount: totalFardhu,
        totalSunatCount: totalSunat,
        currentStreak: isAll5Completed
          ? (activeChild.solatProgress?.currentStreak || 0) + 1
          : activeChild.solatProgress?.currentStreak || 0,
        qadhaPending: newPendingQadha,
        qadhaCompleted,
        qadhaHistory
      }
    });

    if (celebrate) {
      triggerCelebration();
    }
    if (messageSuccess) {
      showToast(messageSuccess, "success");
    }
  };

  // Change individual prayer status (Completed | Missed | Dimaafkan | None)
  const handleSetPrayerStatus = (
    prayerKey: FardhuPrayerKey,
    newStatus: FardhuPrayerStatus
  ) => {
    const currentItem = currentLog.fardhu[prayerKey];
    const prevStatus = currentItem.status || (currentItem.completed ? "completed" : "none");

    if (prevStatus === newStatus) return;

    let deltaPending = 0;
    // If transitioning TO missed, increment Qadha pending
    if (newStatus === "missed" && prevStatus !== "missed") {
      deltaPending = +1;
    }
    // If transitioning FROM missed, decrement Qadha pending
    if (prevStatus === "missed" && newStatus !== "missed") {
      deltaPending = -1;
    }

    const isCompleted = newStatus === "completed";

    const updatedItem: FardhuPrayerItem = {
      ...currentItem,
      completed: isCompleted,
      status: newStatus,
      berjemaah: isCompleted ? currentItem.berjemaah : false,
      qadhaDone: false
    };

    const updatedLog: SolatLogEntry = {
      ...currentLog,
      isDayExcused: false, // Individual manual change overrides entire-day excuse
      fardhu: {
        ...currentLog.fardhu,
        [prayerKey]: updatedItem
      },
      updatedAt: new Date().toISOString()
    };

    let msg = "";
    let celebrate = false;
    let xpGain = 0;
    let coinGain = 0;

    if (newStatus === "completed") {
      xpGain = updatedItem.berjemaah ? 50 : 30;
      coinGain = updatedItem.berjemaah ? 20 : 10;
      msg =
        language === "en"
          ? `✓ ${prayerKey.toUpperCase()} logged as Completed! (+${xpGain} XP)`
          : `✓ Solat ${prayerKey.toUpperCase()} telah ditunaikan! (+${xpGain} XP, +${coinGain} Syiling)`;
      celebrate = true;
    } else if (newStatus === "missed") {
      msg =
        language === "en"
          ? `⚠️ ${prayerKey.toUpperCase()} marked as Missed. Added to Qadha (Make-up) tracker.`
          : `⚠️ Solat ${prayerKey.toUpperCase()} ditanda Tertinggal. Dimasukkan ke dalam senarai Perlu Ganti (Qadha).`;
    } else if (newStatus === "dimaafkan") {
      msg =
        language === "en"
          ? `🌸 ${prayerKey.toUpperCase()} marked as Excused (Di Maafkan). Not counted as missed prayer.`
          : `🌸 Solat ${prayerKey.toUpperCase()} ditanda Di Maafkan (Uzur Syarie / Haid). Tidak dikira dalam hutang solat ganti.`;
    } else {
      msg = language === "en" ? "Prayer status reset." : "Status solat disetkan semula.";
    }

    // Award XP/Coin if completed
    if (xpGain > 0 || coinGain > 0) {
      updateChildProfile({
        xp: activeChild.xp + xpGain,
        coins: activeChild.coins + coinGain
      });
    }

    commitSolatChanges(
      updatedLog,
      { [prayerKey]: deltaPending },
      msg,
      celebrate
    );
  };

  // Toggle Berjemaah
  const handleToggleBerjemaah = (prayerKey: FardhuPrayerKey, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentItem = currentLog.fardhu[prayerKey];
    if (!currentItem.completed) return;

    const newBerjemaah = !currentItem.berjemaah;
    const updatedLog: SolatLogEntry = {
      ...currentLog,
      fardhu: {
        ...currentLog.fardhu,
        [prayerKey]: {
          ...currentItem,
          berjemaah: newBerjemaah
        }
      },
      updatedAt: new Date().toISOString()
    };

    if (newBerjemaah) {
      updateChildProfile({
        xp: activeChild.xp + 20,
        coins: activeChild.coins + 10
      });
      showToast(
        language === "en"
          ? "👥 Congregational prayer bonus! (+20 XP, +10 Coins)"
          : "👥 Solat berjemaah direkodkan! Ganjaran bonus 27 darjat (+20 XP, +10 Syiling)",
        "success"
      );
    }

    commitSolatChanges(updatedLog, {}, undefined, newBerjemaah);
  };

  // Toggle Whole Day as Excused (Haid / Uzur Syarie - Di Maafkan)
  const handleToggleDayExcused = () => {
    const willBeExcused = !currentLog.isDayExcused;

    // Calculate if any prayers were previously marked as "missed" so we remove them from Qadha pending
    const deltaPending: Partial<QadhaPrayerCount> = {};
    if (willBeExcused) {
      (Object.keys(currentLog.fardhu) as FardhuPrayerKey[]).forEach((k) => {
        if (currentLog.fardhu[k].status === "missed") {
          deltaPending[k] = -1;
        }
      });
    }

    const updatedLog: SolatLogEntry = {
      ...currentLog,
      isDayExcused: willBeExcused,
      excuseReason: willBeExcused ? "Haid / Uzur Syarie" : undefined,
      fardhu: {
        subuh: {
          completed: false,
          berjemaah: false,
          status: willBeExcused ? "dimaafkan" : "none"
        },
        zohor: {
          completed: false,
          berjemaah: false,
          status: willBeExcused ? "dimaafkan" : "none"
        },
        asar: {
          completed: false,
          berjemaah: false,
          status: willBeExcused ? "dimaafkan" : "none"
        },
        maghrib: {
          completed: false,
          berjemaah: false,
          status: willBeExcused ? "dimaafkan" : "none"
        },
        isyak: {
          completed: false,
          berjemaah: false,
          status: willBeExcused ? "dimaafkan" : "none"
        }
      },
      updatedAt: new Date().toISOString()
    };

    commitSolatChanges(
      updatedLog,
      deltaPending,
      willBeExcused
        ? language === "en"
          ? "🌸 Whole day marked as Excused (Di Maafkan - Haid / Uzur). No prayers will be added to Qadha."
          : "🌸 Hari ini ditanda sebagai Di Maafkan (Uzur Syarie / Haid). Solat tidak perlu diganti (0 Qadha)."
        : language === "en"
        ? "Status Di Maafkan dinyahaktifkan."
        : "Status Di Maafkan dinyahaktifkan.",
      false
    );
  };

  // Format Malay Date Helper
  const formatMalayDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const monthsBm = [
          "Januari", "Februari", "Mac", "April", "Mei", "Jun",
          "Julai", "Ogos", "September", "Oktober", "November", "Disember"
        ];
        const daysBm = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
        const d = new Date(year, monthIdx, day);
        const dayName = daysBm[d.getDay()] || "";
        return `${dayName}, ${day} ${monthsBm[monthIdx]} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Extract all missed prayers across all recorded dates in solatHistory
  interface RecordedMissedPrayer {
    date: string;
    prayerKey: FardhuPrayerKey;
    prayerName: string;
    rakaat: string;
    icon: string;
    qadhaDone: boolean;
    qadhaDate?: string;
  }

  const recordedMissedPrayers: RecordedMissedPrayer[] = [];
  solatHistory.forEach((log) => {
    if (log.isDayExcused) return;
    (Object.keys(log.fardhu) as FardhuPrayerKey[]).forEach((pKey) => {
      const item = log.fardhu[pKey];
      if (item && item.status === "missed") {
        const pMeta = fardhuList.find((f) => f.key === pKey);
        recordedMissedPrayers.push({
          date: log.date,
          prayerKey: pKey,
          prayerName: pMeta?.nameBm || pKey,
          rakaat: pMeta?.rakaatBm || "",
          icon: pMeta?.icon || "🕌",
          qadhaDone: !!item.qadhaDone,
          qadhaDate: item.qadhaDate
        });
      }
    });
  });

  // Sort descending by date (latest first)
  recordedMissedPrayers.sort((a, b) => b.date.localeCompare(a.date));

  const pendingMissedPrayers = recordedMissedPrayers.filter((item) => !item.qadhaDone);
  const completedMissedPrayers = recordedMissedPrayers.filter((item) => item.qadhaDone);

  const filteredMissedPrayers = recordedMissedPrayers.filter((item) => {
    if (missedFilterStatus === "pending" && item.qadhaDone) return false;
    if (missedFilterStatus === "completed" && !item.qadhaDone) return false;
    if (missedPrayerFilter !== "all" && item.prayerKey !== missedPrayerFilter) return false;
    return true;
  });

  // Replace Qadha Prayer for a SPECIFIC DATE (Telah Ganti Solat Tertinggal Bagi Tarikh Berkenaan)
  const handlePerformQadhaForDate = (targetDate: string, prayerKey: FardhuPrayerKey) => {
    const existingIndex = solatHistory.findIndex((entry) => entry.date === targetDate);
    const prayerInfo = fardhuList.find((f) => f.key === prayerKey);
    const prayerTitle = prayerInfo?.nameBm || prayerKey;
    const todayStr = getTodayString();

    let newHistory: SolatLogEntry[] = [...solatHistory];

    if (existingIndex >= 0) {
      const existingLog = solatHistory[existingIndex];
      const existingItem = existingLog.fardhu[prayerKey] || { completed: false, status: "missed" };
      const updatedLog: SolatLogEntry = {
        ...existingLog,
        fardhu: {
          ...existingLog.fardhu,
          [prayerKey]: {
            ...existingItem,
            status: "missed",
            qadhaDone: true,
            qadhaDate: todayStr
          }
        },
        updatedAt: new Date().toISOString()
      };
      newHistory[existingIndex] = updatedLog;
    } else {
      const newEntry: SolatLogEntry = {
        id: `solat-${targetDate}`,
        date: targetDate,
        isDayExcused: false,
        fardhu: {
          subuh: { completed: false, status: prayerKey === "subuh" ? "missed" : "none", qadhaDone: prayerKey === "subuh", qadhaDate: prayerKey === "subuh" ? todayStr : undefined },
          zohor: { completed: false, status: prayerKey === "zohor" ? "missed" : "none", qadhaDone: prayerKey === "zohor", qadhaDate: prayerKey === "zohor" ? todayStr : undefined },
          asar: { completed: false, status: prayerKey === "asar" ? "missed" : "none", qadhaDone: prayerKey === "asar", qadhaDate: prayerKey === "asar" ? todayStr : undefined },
          maghrib: { completed: false, status: prayerKey === "maghrib" ? "missed" : "none", qadhaDone: prayerKey === "maghrib", qadhaDate: prayerKey === "maghrib" ? todayStr : undefined },
          isyak: { completed: false, status: prayerKey === "isyak" ? "missed" : "none", qadhaDone: prayerKey === "isyak", qadhaDate: prayerKey === "isyak" ? todayStr : undefined }
        },
        sunat: {},
        updatedAt: new Date().toISOString()
      };
      newHistory = [newEntry, ...newHistory];
    }

    // Decrement pending, increment completed
    const newPendingCount = Math.max(0, (qadhaPending[prayerKey] || 0) - 1);
    const newCompletedCount = (qadhaCompleted[prayerKey] || 0) + 1;

    const newHistoryEntry: QadhaHistoryEntry = {
      id: `qadha-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      prayerKey,
      prayerName: prayerTitle,
      originalMissedDate: targetDate,
      dateReplaced: todayStr,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      note: `Solat ${prayerTitle} (Tertinggal pada: ${formatMalayDate(targetDate)}) telah selesai diqadha pada ${formatMalayDate(todayStr)}`,
      rewardEarned: { xp: 35, coins: 15 }
    };

    const newXp = activeChild.xp + 35;
    const newCoins = activeChild.coins + 15;

    updateChildProfile({
      xp: newXp,
      coins: newCoins,
      solatProgress: {
        ...(activeChild.solatProgress || {
          totalFardhuCount: 0,
          totalSunatCount: 0,
          currentStreak: 0
        }),
        history: newHistory,
        qadhaPending: {
          ...qadhaPending,
          [prayerKey]: newPendingCount
        },
        qadhaCompleted: {
          ...qadhaCompleted,
          [prayerKey]: newCompletedCount
        },
        qadhaHistory: [newHistoryEntry, ...qadhaHistory]
      }
    });

    triggerCelebration();
    showToast(
      language === "en"
        ? `🎉 Alhamdulillah! Solat ${prayerTitle} from ${targetDate} replaced today! (+35 XP, +15 Coins)`
        : `🎉 Alhamdulillah! Solat ${prayerTitle} bagi tarikh ${formatMalayDate(targetDate)} telah selesai digantikan hari ini! (+35 XP, +15 Syiling)`,
      "success"
    );
  };

  // Undo Qadha replacement for a specific date (Set Semula ke Belum Ganti)
  const handleUndoQadhaForDate = (targetDate: string, prayerKey: FardhuPrayerKey) => {
    const existingIndex = solatHistory.findIndex((entry) => entry.date === targetDate);
    if (existingIndex < 0) return;

    const existingLog = solatHistory[existingIndex];
    const existingItem = existingLog.fardhu[prayerKey];
    if (!existingItem) return;

    const updatedLog: SolatLogEntry = {
      ...existingLog,
      fardhu: {
        ...existingLog.fardhu,
        [prayerKey]: {
          ...existingItem,
          qadhaDone: false,
          qadhaDate: undefined
        }
      },
      updatedAt: new Date().toISOString()
    };

    const newHistory = [...solatHistory];
    newHistory[existingIndex] = updatedLog;

    const newPendingCount = (qadhaPending[prayerKey] || 0) + 1;
    const newCompletedCount = Math.max(0, (qadhaCompleted[prayerKey] || 0) - 1);

    const updatedQadhaHistory = qadhaHistory.filter(
      (h) => !(h.prayerKey === prayerKey && h.originalMissedDate === targetDate)
    );

    updateChildProfile({
      solatProgress: {
        ...(activeChild.solatProgress || {
          totalFardhuCount: 0,
          totalSunatCount: 0,
          currentStreak: 0
        }),
        history: newHistory,
        qadhaPending: {
          ...qadhaPending,
          [prayerKey]: newPendingCount
        },
        qadhaCompleted: {
          ...qadhaCompleted,
          [prayerKey]: newCompletedCount
        },
        qadhaHistory: updatedQadhaHistory
      }
    });

    showToast(
      language === "en"
        ? `Reset: ${prayerKey.toUpperCase()} from ${targetDate} set back to pending.`
        : `Status disetkan semula: Solat ${prayerKey.toUpperCase()} bagi tarikh ${formatMalayDate(targetDate)} dikembalikan sebagai belum diganti.`,
      "info"
    );
  };

  // Generic / Historical Qadha (Oldest Pending or Unassigned)
  const handlePerformGenericQadha = (prayerKey: FardhuPrayerKey) => {
    // Check if there is an unreplaced missed prayer in recorded history first!
    const oldestPending = [...solatHistory]
      .sort((a, b) => a.date.localeCompare(b.date))
      .find(
        (log) =>
          !log.isDayExcused &&
          log.fardhu[prayerKey]?.status === "missed" &&
          !log.fardhu[prayerKey]?.qadhaDone
      );

    if (oldestPending) {
      handlePerformQadhaForDate(oldestPending.date, prayerKey);
      return;
    }

    const currentPending = qadhaPending[prayerKey] || 0;
    if (currentPending <= 0) {
      showToast(
        language === "en"
          ? `No pending ${prayerKey.toUpperCase()} prayers need to be replaced!`
          : `Tiada baki solat ${prayerKey.toUpperCase()} yang perlu digantikan! Anda boleh tekan 'Laras Baki' jika ada hutang lama.`,
        "info"
      );
      return;
    }

    const newPendingCount = Math.max(0, currentPending - 1);
    const newCompletedCount = (qadhaCompleted[prayerKey] || 0) + 1;
    const prayerInfo = fardhuList.find((f) => f.key === prayerKey);
    const prayerTitle = prayerInfo?.nameBm || prayerKey;
    const todayStr = getTodayString();

    const newHistoryEntry: QadhaHistoryEntry = {
      id: `qadha-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      prayerKey,
      prayerName: prayerTitle,
      originalMissedDate: "Rekod Anggaran Silam",
      dateReplaced: todayStr,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      note: `Telah selesai qadha solat fardhu ${prayerTitle} (Rekod Anggaran Silam)`,
      rewardEarned: { xp: 35, coins: 15 }
    };

    const newXp = activeChild.xp + 35;
    const newCoins = activeChild.coins + 15;

    updateChildProfile({
      xp: newXp,
      coins: newCoins,
      solatProgress: {
        ...(activeChild.solatProgress || {
          history: solatHistory,
          totalFardhuCount: 0,
          totalSunatCount: 0,
          currentStreak: 0
        }),
        qadhaPending: {
          ...qadhaPending,
          [prayerKey]: newPendingCount
        },
        qadhaCompleted: {
          ...qadhaCompleted,
          [prayerKey]: newCompletedCount
        },
        qadhaHistory: [newHistoryEntry, ...qadhaHistory]
      }
    });

    triggerCelebration();
    showToast(
      language === "en"
        ? `🎉 Alhamdulillah! Successfully made up 1 ${prayerTitle} prayer! (+35 XP, +15 Coins)`
        : `🎉 Alhamdulillah! 1 Solat Qadha ${prayerTitle} (Rekod Anggaran Silam) telah selesai diganti! (+35 XP, +15 Syiling)`,
      "success"
    );
  };

  // Replace Qadha Prayer (With optional specific date parameter)
  const handlePerformQadha = (prayerKey: FardhuPrayerKey, optionalDate?: string) => {
    if (optionalDate) {
      handlePerformQadhaForDate(optionalDate, prayerKey);
    } else {
      handlePerformGenericQadha(prayerKey);
    }
  };

  // Add manual missed count to Qadha pending (e.g. +1 for a prayer)
  const handleAddPendingQadha = (prayerKey: FardhuPrayerKey, count = 1) => {
    const newPending = qadhaPending[prayerKey] + count;
    updateChildProfile({
      solatProgress: {
        ...(activeChild.solatProgress || {
          history: solatHistory,
          totalFardhuCount: 0,
          totalSunatCount: 0,
          currentStreak: 0
        }),
        qadhaPending: {
          ...qadhaPending,
          [prayerKey]: newPending
        },
        qadhaCompleted,
        qadhaHistory
      }
    });

    showToast(
      language === "en"
        ? `Added +${count} ${prayerKey.toUpperCase()} to Qadha tracker.`
        : `+${count} Solat ${prayerKey.toUpperCase()} ditambah ke dalam rekod Perlu Ganti.`,
      "info"
    );
  };

  // Save full manual adjustments
  const handleSaveManualQadha = (e: React.FormEvent) => {
    e.preventDefault();
    updateChildProfile({
      solatProgress: {
        ...(activeChild.solatProgress || {
          history: solatHistory,
          totalFardhuCount: 0,
          totalSunatCount: 0,
          currentStreak: 0
        }),
        qadhaPending: {
          subuh: Math.max(0, manualCounts.subuh),
          zohor: Math.max(0, manualCounts.zohor),
          asar: Math.max(0, manualCounts.asar),
          maghrib: Math.max(0, manualCounts.maghrib),
          isyak: Math.max(0, manualCounts.isyak)
        },
        qadhaCompleted,
        qadhaHistory
      }
    });

    setShowManualQadhaModal(false);
    showToast(
      language === "en"
        ? "Qadha pending counts updated successfully!"
        : "Baki solat perlu diganti berjaya dikemaskini!",
      "success"
    );
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

    if (newCompleted) {
      updateChildProfile({
        xp: activeChild.xp + 25,
        coins: activeChild.coins + 10
      });
    }

    commitSolatChanges(
      updatedLog,
      {},
      newCompleted
        ? language === "en"
          ? "✓ Sunnah prayer recorded! (+25 XP, +10 Coins)"
          : "✓ Solat Sunat direkodkan! (+25 XP, +10 Syiling Emas)"
        : undefined,
      newCompleted
    );
  };

  // Save Note Function
  const handleSaveNote = () => {
    const updatedLog: SolatLogEntry = {
      ...currentLog,
      note: dailyNote,
      updatedAt: new Date().toISOString()
    };

    commitSolatChanges(
      updatedLog,
      {},
      language === "en" ? "Prayer note saved!" : "Catatan harian solat berjaya disimpan!"
    );
  };

  // Count Fardhu for current selected date
  const completedFardhuCount = Object.values(currentLog.fardhu).filter(
    (f) => f.completed
  ).length;

  const missedFardhuCount = Object.values(currentLog.fardhu).filter(
    (f) => f.status === "missed"
  ).length;

  const excusedFardhuCount = Object.values(currentLog.fardhu).filter(
    (f) => f.status === "dimaafkan" || currentLog.isDayExcused
  ).length;

  const completedSunatCount = Object.values(currentLog.sunat || {}).filter((s) => s).length;

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

  // Check if active profile is female
  const isFemale = activeChild.gender === "girl";

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
                <span>{language === "en" ? "Prayer & Qadha Tracker" : "Solat 5 Waktu & Tracker Ganti Solat"}</span>
              </div>
              <h2 className="text-2xl font-black">
                {language === "en" ? "Daily Prayer & Qadha Tracker" : "Diari Solat & Tracker Ganti Solat (Qadha)"}
              </h2>
              <p className="text-xs text-emerald-100 max-w-lg mt-0.5 leading-relaxed">
                {language === "en"
                  ? "Track your 5 daily obligatory prayers, manage missed prayers (Qadha) when replaced, and easily mark excused days (Haid/Uzur) for girls with zero penalty!"
                  : "Rekod solat 5 waktu, jejaki solat yang tertinggal untuk digantikan (Qadha), serta fungsi khas 'Di Maafkan' bagi wanita/anak perempuan yang uzur syarie tanpa dikira sebagai hutang solat."}
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs">
            <div className="text-center px-3 border-r border-white/20">
              <span className="block text-[10px] uppercase font-bold text-emerald-200">
                {language === "en" ? "Today's Fardhu" : "Fardhu Hari Ini"}
              </span>
              <span className="text-xl font-black text-amber-300">
                {currentLog.isDayExcused ? "🌸 Uzur" : `${completedFardhuCount}/5`}
              </span>
            </div>
            <div className="text-center px-3 border-r border-white/20">
              <span className="block text-[10px] uppercase font-bold text-rose-200">
                {language === "en" ? "Need Qadha" : "Perlu Ganti"}
              </span>
              <span className={`text-xl font-black ${totalQadhaPending > 0 ? "text-rose-300" : "text-emerald-200"}`}>
                {totalQadhaPending} Waktu
              </span>
            </div>
            <div className="text-center px-3 border-r border-white/20">
              <span className="block text-[10px] uppercase font-bold text-amber-200">
                {language === "en" ? "Replaced" : "Telah Ganti"}
              </span>
              <span className="text-xl font-black text-amber-300">
                {totalQadhaCompleted}
              </span>
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

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/20">
          <button
            type="button"
            onClick={() => setActiveTab("diary")}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "diary"
                ? "bg-white text-emerald-900 shadow-md scale-102"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <span>🕌</span>
            <span>{language === "en" ? "Prayer Diary & Qadha Tracker" : "Diari & Tracker Ganti Solat (Gabungan)"}</span>
            {totalQadhaPending > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                {totalQadhaPending} Hutang
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                ✓ Selesai
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("fiqh")}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "fiqh"
                ? "bg-amber-400 text-stone-900 shadow-md scale-102"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <span>📖</span>
            <span>{language === "en" ? "JAKIM Fiqh & Niat Guide" : "Panduan & Fiqh Ganti Solat"}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: DIARI SOLAT HARIAN (5 WAKTU + STATUS + CUTI HAID)  */}
      {/* ======================================================== */}
      {activeTab === "diary" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Date Selector & Female Haid/Uzur Toggle Banner */}
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

            {/* SPECIAL BANNER: Cuti Solat (Haid / Uzur Syarie) for Female or General */}
            <div
              className={`rounded-2xl p-4 border transition-all ${
                currentLog.isDayExcused
                  ? "bg-rose-50/90 border-rose-300 text-rose-900 shadow-sm ring-2 ring-rose-200"
                  : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-900"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center text-xl shrink-0 font-black">
                    🌸
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-stone-900">
                        {language === "en"
                          ? "Excused from Prayer (Haid / Uzur Syarie)"
                          : "Status Uzur Syarie / Haid (Di Maafkan)"}
                      </span>
                      {isFemale && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-200 text-pink-900">
                          {activeChild.name} (Perempuan)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                      {currentLog.isDayExcused
                        ? "✨ Tarikh ini telah ditanda sebagai Di Maafkan. Mengikut hukum syarak, wanita yang uzur haid TIDAK WAJIB menggantikan (qadha) solat yang ditinggalkan sepanjang tempoh uzur."
                        : "Khas bagi pengguna perempuan: Jika sedang haid / uzur syarie, tekan butang di sebelah untuk tanda Di Maafkan bagi keseluruhan hari ini. Tiada solat perlu digantikan."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleDayExcused}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 shadow-xs flex items-center gap-2 ${
                    currentLog.isDayExcused
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-white hover:bg-rose-50 text-rose-800 border-2 border-rose-300"
                  }`}
                >
                  <span>🌸</span>
                  <span>
                    {currentLog.isDayExcused
                      ? language === "en"
                        ? "✓ Excused Active (Cancel)"
                        : "✓ Cuti Solat Aktif (Batal)"
                      : language === "en"
                      ? "Mark Entire Day as Excused"
                      : "Tanda Sepenuh Hari Ini Di Maafkan"}
                  </span>
                </button>
              </div>
            </div>

            {/* Daily Obligatory Prayer Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold">
                <span className="text-stone-700">
                  {language === "en" ? "Obligatory Prayer Progress (5 Times):" : "Kemajuan Solat Fardhu 5 Waktu:"}
                </span>
                <span className={currentLog.isDayExcused ? "text-purple-700" : "text-emerald-700"}>
                  {currentLog.isDayExcused ? (
                    "🌸 5 Waktu Di Maafkan (Tiada Qadha)"
                  ) : (
                    `${completedFardhuCount}/5 Ditunaikan (${Math.round((completedFardhuCount / 5) * 100)}%)`
                  )}
                </span>
              </div>
              <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                    currentLog.isDayExcused
                      ? "from-pink-400 to-purple-500 w-full"
                      : completedFardhuCount === 5
                      ? "from-emerald-500 to-teal-600"
                      : completedFardhuCount >= 3
                      ? "from-amber-400 to-emerald-500"
                      : "from-orange-400 to-amber-500"
                  }`}
                  style={{ width: currentLog.isDayExcused ? "100%" : `${(completedFardhuCount / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 1: Solat Fardhu 5 Waktu Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <span>🕌</span>
                  <span>
                    {language === "en" ? "5 Obligatory Daily Prayers" : "Solat Fardhu 5 Waktu Sehari"}
                  </span>
                </h3>
                <p className="text-stone-500 text-xs">
                  {language === "en"
                    ? "Choose status for each prayer: Completed, Missed (Need Qadha), or Excused (Di Maafkan)."
                    : "Pilih status setiap waktu: Ditunaikan, Tertinggal (Perlu Ganti), atau Di Maafkan (Haid/Uzur)."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {fardhuList.map((p) => {
                const prayerState = currentLog.fardhu[p.key];
                const isExcused = prayerState.status === "dimaafkan" || currentLog.isDayExcused;
                const isMissed = prayerState.status === "missed" && !isExcused;
                const isDone = prayerState.completed && !isExcused;
                const isJam = prayerState.berjemaah;

                return (
                  <div
                    key={p.key}
                    className={`relative rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 select-none ${
                      isExcused
                        ? "bg-gradient-to-b from-pink-50/80 to-purple-50/80 border-purple-300 ring-1 ring-purple-300/40"
                        : isDone
                        ? "bg-gradient-to-b from-emerald-50 to-teal-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                        : isMissed
                        ? "bg-gradient-to-b from-rose-50 to-orange-50 border-rose-400 shadow-xs ring-2 ring-rose-400/20"
                        : "bg-white border-stone-200 hover:border-emerald-300 hover:shadow-xs"
                    }`}
                  >
                    {/* Header: Icon & Current Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{p.icon}</span>

                      {isExcused ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-100 border border-pink-300 text-pink-900 text-[10px] font-black">
                          <span>🌸</span>
                          <span>Di Maafkan</span>
                        </span>
                      ) : isDone ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Ditunaikan</span>
                        </span>
                      ) : isMissed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                          <AlertCircle className="w-3 h-3" />
                          <span>Perlu Ganti</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-bold">
                          Belum ditanda
                        </span>
                      )}
                    </div>

                    {/* Prayer Info */}
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

                    {/* Status Toggle Buttons */}
                    <div className="pt-2 border-t border-stone-100 space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        {/* 1. Ditunaikan */}
                        <button
                          type="button"
                          onClick={() => handleSetPrayerStatus(p.key, isDone ? "none" : "completed")}
                          className={`py-1.5 px-1 rounded-xl text-[10px] font-black flex flex-col items-center justify-center transition-all cursor-pointer border ${
                            isDone
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : "bg-stone-50 hover:bg-emerald-50 text-stone-700 border-stone-200"
                          }`}
                          title="Tanda telah ditunaikan"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Solat</span>
                        </button>

                        {/* 2. Tertinggal / Perlu Ganti */}
                        <button
                          type="button"
                          onClick={() => handleSetPrayerStatus(p.key, isMissed ? "none" : "missed")}
                          className={`py-1.5 px-1 rounded-xl text-[10px] font-black flex flex-col items-center justify-center transition-all cursor-pointer border ${
                            isMissed
                              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                              : "bg-stone-50 hover:bg-rose-50 text-stone-700 border-stone-200"
                          }`}
                          title="Tanda tertinggal dan perlu diganti (Qadha)"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Ganti</span>
                        </button>

                        {/* 3. Di Maafkan (Haid/Uzur) */}
                        <button
                          type="button"
                          onClick={() =>
                            handleSetPrayerStatus(p.key, isExcused ? "none" : "dimaafkan")
                          }
                          className={`py-1.5 px-1 rounded-xl text-[10px] font-black flex flex-col items-center justify-center transition-all cursor-pointer border ${
                            isExcused
                              ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                              : "bg-stone-50 hover:bg-purple-50 text-stone-700 border-stone-200"
                          }`}
                          title="Di Maafkan (Haid / Uzur Syarie)"
                        >
                          <span>🌸</span>
                          <span>Maaf</span>
                        </button>
                      </div>

                      {/* Extra Action / Feedback per status */}
                      {isDone && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleBerjemaah(p.key, e)}
                          className={`w-full py-1.5 px-2 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            isJam
                              ? "bg-amber-400 hover:bg-amber-500 text-stone-900 border-amber-300 shadow-xs"
                              : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300"
                          }`}
                        >
                          {isJam ? (
                            <>
                              <Users className="w-3 h-3 text-stone-900 fill-stone-900" />
                              <span>Berjemaah (+50 XP)</span>
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 text-stone-600" />
                              <span>Bersendirian (+30 XP)</span>
                            </>
                          )}
                        </button>
                      )}

                      {isMissed && (
                        <div className="space-y-1.5">
                          {prayerState.qadhaDone ? (
                            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2 space-y-1 text-center">
                              <div className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Telah Selesai Diganti!</span>
                              </div>
                              <p className="text-[10px] text-emerald-700 font-semibold leading-tight">
                                Qadha pada: {formatMalayDate(prayerState.qadhaDate || getTodayString())}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleUndoQadhaForDate(selectedDate, p.key)}
                                className="text-[9px] text-stone-500 hover:text-rose-600 underline font-bold cursor-pointer pt-0.5 block mx-auto transition-colors"
                              >
                                Batal / Reset Status
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="text-[9px] font-extrabold text-rose-800 bg-rose-100/90 border border-rose-200 rounded-lg py-1 px-1.5 text-center leading-tight">
                                ⚠️ Tertinggal ({formatMalayDate(selectedDate)})
                              </div>
                              <button
                                type="button"
                                onClick={() => handlePerformQadhaForDate(selectedDate, p.key)}
                                className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[10px] font-black flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition-all active:scale-95"
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>✓ Ganti Solat Tarikh Ini</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {isExcused && (
                        <div className="text-[9px] font-extrabold text-purple-800 bg-purple-100/90 rounded-lg py-1 px-1 text-center leading-tight">
                          🌸 Bebas hutang solat (0 Qadha)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: TRACKER SOLAT TERTINGGAL MENGIKUT TARIKH (GABUNGAN BERSAMA DIARI) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-black mb-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === "en" ? "Missed Prayers by Date" : "Senarai Solat Tertinggal Mengikut Tarikh"}</span>
                </div>
                <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <span>📅</span>
                  <span>Tracker Solat Tertinggal & Rekod Penggantian Mengikut Tarikh</span>
                </h3>
                <p className="text-xs text-stone-500 max-w-2xl mt-0.5 leading-relaxed">
                  Ketahui dengan tepat pada tarikh mana solat ditinggalkan, semak status sama ada telah digantikan, dan tekan butang ganti untuk tarikh berkenaan secara langsung.
                </p>
              </div>

              {/* Action: Manual adjustment / Past records */}
              <button
                type="button"
                onClick={() => {
                  setManualCounts({ ...qadhaPending });
                  setShowManualQadhaModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 border border-stone-300"
              >
                <span>⚙️</span>
                <span>Laras Baki Hutang Silam</span>
              </button>
            </div>

            {/* Quick Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-stone-500 text-[11px] mr-1">Status:</span>
                <button
                  type="button"
                  onClick={() => setMissedFilterStatus("all")}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                    missedFilterStatus === "all"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-white text-stone-700 hover:bg-stone-200 border border-stone-200"
                  }`}
                >
                  Semua ({recordedMissedPrayers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMissedFilterStatus("pending")}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    missedFilterStatus === "pending"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-white text-rose-700 hover:bg-rose-50 border border-rose-200"
                  }`}
                >
                  <span>🔴 Belum Ganti ({pendingMissedPrayers.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMissedFilterStatus("completed")}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    missedFilterStatus === "completed"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200"
                  }`}
                >
                  <span>🟢 Selesai Diganti ({completedMissedPrayers.length})</span>
                </button>
              </div>

              {/* Prayer Filter (Subuh, Zohor, etc.) */}
              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold text-stone-500 text-[11px] mr-1">Waktu:</span>
                <select
                  value={missedPrayerFilter}
                  onChange={(e) => setMissedPrayerFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white font-bold text-xs text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Semua Waktu</option>
                  <option value="subuh">🌅 Subuh</option>
                  <option value="zohor">☀️ Zohor</option>
                  <option value="asar">🌤️ Asar</option>
                  <option value="maghrib">🌇 Maghrib</option>
                  <option value="isyak">🌙 Isyak</option>
                </select>
              </div>
            </div>

            {/* List of Missed Prayers by Date */}
            {filteredMissedPrayers.length === 0 ? (
              <div className="rounded-3xl p-8 bg-emerald-50/70 border border-emerald-200 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-xs">
                  ✨
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-base">
                    {missedFilterStatus === "pending"
                      ? "Alhamdulillah! Tiada Solat Tertinggal Yang Belum Diganti"
                      : "Tiada Rekod Solat Tertinggal Dijumpai"}
                  </h4>
                  <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
                    {missedFilterStatus === "pending"
                      ? "Semua solat fardhu dalam diari telah ditunaikan tepat waktu, dimaafkan (uzur), atau telah selesai digantikan!"
                      : "Tandakan status solat di diari harian sekiranya ada solat yang tertinggal untuk dimasukkan ke dalam tracker ini secara automatik."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredMissedPrayers.map((item, idx) => {
                  const isPending = !item.qadhaDone;

                  return (
                    <div
                      key={`${item.date}-${item.prayerKey}-${idx}`}
                      className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                        isPending
                          ? "bg-rose-50/50 border-rose-200 hover:border-rose-400 hover:shadow-xs"
                          : "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl shrink-0">{item.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-stone-900 text-sm">
                                Solat {item.prayerName}
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-stone-200 text-stone-700">
                                {item.rakaat}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-stone-700 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-stone-500" />
                              <span>Tertinggal pada:</span>
                              <span className="text-rose-900 underline font-black">
                                {formatMalayDate(item.date)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse shrink-0 shadow-2xs">
                            <AlertCircle className="w-3 h-3" />
                            <span>Belum Diganti</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black shrink-0 shadow-2xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Selesai Qadha</span>
                          </span>
                        )}
                      </div>

                      {/* Replacement Details & Actions */}
                      <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                        {isPending ? (
                          <div className="text-[11px] text-stone-500 font-medium">
                            Hutang solat fardhu wajib digantikan segera.
                          </div>
                        ) : (
                          <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                            <span>✅ Digantikan pada:</span>
                            <span className="font-black">{formatMalayDate(item.qadhaDate || getTodayString())}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                          {/* Jump to Diary Date */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDate(item.date);
                              showToast(`Memaparkan diari bagi tarikh ${formatMalayDate(item.date)}`, "info");
                              window.scrollTo({ top: 150, behavior: "smooth" });
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-[11px] border border-stone-300 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="Buka dan lihat rekod hari ini di diari"
                          >
                            <Calendar className="w-3 h-3 text-stone-600" />
                            <span>Buka di Diari</span>
                          </button>

                          {/* Perform / Undo Action */}
                          {isPending ? (
                            <button
                              type="button"
                              onClick={() => handlePerformQadhaForDate(item.date, item.prayerKey)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-xs active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Ganti Solat Ini</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUndoQadhaForDate(item.date, item.prayerKey)}
                              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 font-bold text-[10px] border border-stone-300 transition-all cursor-pointer"
                              title="Set semula ke belum ganti jika tersilap"
                            >
                              <span>Batal Ganti</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Unassigned / Historical Past Debts Box */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-sm flex items-center gap-1.5 text-stone-900">
                    <span>⏳</span>
                    <span>Solat Ganti Anggaran / Masa Lalu (Sebelum Penggunaan Aplikasi)</span>
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Jika mempunyai solat yang tertinggal pada masa lalu tanpa tarikh khusus di diari, anda boleh terus menekan butang 'Ganti 1 Waktu' di bawah:
                  </p>
                </div>

                <div className="text-xs font-black px-3 py-1 rounded-xl bg-amber-200 text-amber-900 shrink-0 self-start sm:self-center">
                  Baki Anggaran: {totalQadhaPending} Waktu
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {fardhuList.map((p) => {
                  const pCount = qadhaPending[p.key] || 0;
                  return (
                    <div
                      key={p.key}
                      className="p-2.5 rounded-xl bg-white border border-amber-200 flex flex-col justify-between space-y-2 text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{p.icon}</span>
                        <span className="font-extrabold text-xs text-stone-800">{p.nameBm}</span>
                      </div>
                      <div className="text-base font-black text-rose-700">
                        {pCount} <span className="text-[10px] text-stone-500 font-bold">waktu</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePerformGenericQadha(p.key)}
                        className="py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] shadow-2xs cursor-pointer transition-all active:scale-95"
                      >
                        ✓ Ganti 1 Waktu
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Log / Sejarah Penggantian Solat Qadha */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Sejarah Solat Yang Selesai Digantikan (Log Qadha):</span>
                </h4>
                <span className="text-[11px] font-bold text-stone-500">
                  {qadhaHistory.length} rekod penggantian
                </span>
              </div>

              {qadhaHistory.length === 0 ? (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500">
                  Belum ada solat qadha yang direkodkan selesai digantikan.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {qadhaHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 flex items-center justify-between text-xs transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                          ✓
                        </span>
                        <div>
                          <div className="font-black text-stone-900">
                            Solat {item.prayerName}
                          </div>
                          <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-1.5">
                            {item.originalMissedDate && (
                              <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                Asal Tertinggal: {formatMalayDate(item.originalMissedDate)}
                              </span>
                            )}
                            <span>➔ Selesai digantikan pada: {formatMalayDate(item.dateReplaced)} ({item.timestamp})</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-extrabold text-[11px] text-emerald-700">
                        +{item.rewardEarned?.xp || 35} XP • +{item.rewardEarned?.coins || 15} 🪙
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Solat Sunat & Voluntary Prayers */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <span>✨</span>
                <span>{language === "en" ? "Sunnah Prayers (Solat Sunat)" : "Rekod Solat-Solat Sunat"}</span>
              </h3>
              <p className="text-stone-500 text-xs">
                {language === "en"
                  ? "Record sunnah prayers performed to earn extra +25 XP and +10 Gold Coins per prayer!"
                  : "Tanda mana-mana solat sunat yang telah dilaksanakan untuk dapatkan bonus tambahan +25 XP & +10 Syiling Emas!"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sunatList.map((s) => {
                const isSunatDone = !!currentLog.sunat?.[s.key];

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

          {/* SECTION 3: Catatan Harian Solat */}
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
                {language === "en" ? "Past week status" : "Prestasi & Status Mingguan"}
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
                    <th className="py-2.5 px-3 text-center">Status Keseluruhan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {last7Days.map((dateStr) => {
                    const log = solatHistory.find((entry) => entry.date === dateStr);
                    const isExcusedDay = !!log?.isDayExcused;
                    const fardhuObj = log?.fardhu || {
                      subuh: { completed: false },
                      zohor: { completed: false },
                      asar: { completed: false },
                      maghrib: { completed: false },
                      isyak: { completed: false }
                    };

                    const count = Object.values(fardhuObj).filter(
                      (f: any) => f.completed
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
                          const isItemExcused = isExcusedDay || item?.status === "dimaafkan";
                          const isItemMissed = item?.status === "missed";

                          return (
                            <td key={pKey} className="py-3 px-2 text-center">
                              {isItemExcused ? (
                                <span
                                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs font-black"
                                  title="Di Maafkan (Haid/Uzur)"
                                >
                                  🌸
                                </span>
                              ) : item?.completed ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                                  {item.berjemaah ? "👥" : "✓"}
                                </span>
                              ) : isItemMissed ? (
                                <span
                                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black"
                                  title="Perlu Ganti (Qadha)"
                                >
                                  ⚠️
                                </span>
                              ) : (
                                <span className="text-stone-300 font-bold">•</span>
                              )}
                            </td>
                          );
                        })}

                        <td className="py-3 px-3 text-center">
                          {isExcusedDay ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-900 border border-pink-200">
                              🌸 Di Maafkan (Uzur)
                            </span>
                          ) : (
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
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PANDUAN FIQH & RUJUKAN JAKIM QADHA & HAID/UZUR    */}
      {/* ======================================================== */}
      {activeTab === "fiqh" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card 1: Fiqh Haid & Uzur Syarie (Penerangan Mengapa Di Maafkan) */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-white rounded-3xl p-6 md:p-8 border-2 border-pink-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-black text-2xl shadow-xs">
                🌸
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-pink-700 tracking-wider">
                  Rujukan Fiqh Wanita JAKIM
                </span>
                <h3 className="text-lg font-black text-stone-900">
                  Hukum Solat Bagi Wanita Semasa Haid & Uzur Syarie: Di Maafkan Sepenuhnya
                </h3>
              </div>
            </div>

            <div className="text-xs text-stone-700 space-y-3 leading-relaxed bg-white/80 p-5 rounded-2xl border border-pink-100">
              <p className="font-extrabold text-pink-950">
                📌 Mengapakah solat wanita yang ditinggalkan semasa haid tidak dikira dalam solat yang perlu digantikan?
              </p>
              <p>
                Berdasarkan kesepakatan (*ijmak*) seluruh ulama Islam dan dalil sahih daripada Saidatina Aisyah r.a., seorang wanita yang didatangi haid atau nifas <strong>gugur kewajipan solatnya</strong> sepanjang tempoh haid tersebut dan <strong>TIDAK WAJIB menggantikannya (tiada qadha solat)</strong>.
              </p>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 font-medium text-purple-900 text-[11px] italic">
                "Dahulu kami mengalami haid pada zaman Rasulullah SAW, maka kami diperintahkan untuk mengqadha puasa dan kami TIDAK diperintahkan untuk mengqadha solat."
                <span className="block not-italic font-bold mt-1 text-purple-950">— Hadis Riwayat Sahih Muslim (No. 335)</span>
              </div>

              <p>
                Oleh itu, dalam aplikasi MudahKids, sekiranya anak perempuan atau pengguna menandakan <strong>"Di Maafkan"</strong> pada rekod solat, sistem sama sekali tidak memasukkannya ke dalam jumlah solat perlu ganti, tidak menolak ganjaran streak, dan meraikan kepatuhan terhadap syariat Allah SWT.
              </p>
            </div>
          </div>

          {/* Card 2: Kaedah & Niat Solat Qadha Fardhu 5 Waktu */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-xs">
                📖
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                  Panduan Ibadah JAKIM
                </span>
                <h3 className="text-lg font-black text-stone-900">
                  Lafaz Niat Solat Qadha (Ganti) Fardhu 5 Waktu
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              Solat qadha boleh didirikan pada bila-bila masa (siang atau malam) di luar waktu solat fardhu berkenaan. Berikut adalah lafaz niat solat qadha bagi setiap waktu:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fardhuList.map((p) => (
                <div key={p.key} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-stone-900 flex items-center gap-1.5">
                      <span>{p.icon}</span>
                      <span>Solat Qadha {p.nameBm} ({p.rakaatBm})</span>
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Wajib Qadha
                    </span>
                  </div>

                  <div className="text-right font-serif text-base text-stone-800 font-bold leading-relaxed pt-1">
                    {p.niatQadhaArab}
                  </div>

                  <div className="text-[11px] font-semibold text-emerald-900 italic">
                    "{p.niatQadhaRumi}"
                  </div>

                  <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-200">
                    Ertinya: Sahaja aku solat fardhu {p.nameBm} {p.rakaatBm} tunai/qadha kerana Allah Ta'ala.
                  </div>
                </div>
              ))}
            </div>

            {/* Tips Menggantikan Solat */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <h5 className="font-black flex items-center gap-1.5 text-stone-900">
                <span>💡</span>
                <span>Tips Praktikal Menggantikan Solat Yang Banyak:</span>
              </h5>
              <ul className="list-disc list-inside space-y-1 text-[11px] font-medium text-stone-700">
                <li>
                  <strong>Kaedah Solat Berkembar:</strong> Lakukan 1 solat qadha setiap kali selepas menunaikan solat fardhu harian (contohnya selepas solat Subuh tunai, sambung dengan 1 kali solat Subuh qadha).
                </li>
                <li>
                  <strong>Disiplin Catatan:</strong> Setiap kali selesai menunaikan satu solat qadha, tekan butang <strong>"Telah Ganti (+1)"</strong> dalam aplikasi ini untuk menolak baki hutang.
                </li>
                <li>
                  <strong>Ketenangan Hati:</strong> Menggantikan solat fardhu yang tertinggal membina kebersihan jiwa dan mendidik anak-anak bertanggungjawab atas amanah ibadah.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TETAPKAN / LARAS BAKI HUTANG SILAM (MANUAL SETTER)  */}
      {/* ======================================================== */}
      {showManualQadhaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-base">
                    Laras Baki Solat Perlu Ganti
                  </h4>
                  <p className="text-stone-500 text-xs">
                    Masukkan anggaran bilangan solat yang tertinggal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManualQadhaModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManualQadha} className="space-y-4">
              <p className="text-xs text-stone-600">
                Sekiranya {activeChild.name} mempunyai solat masa lalu yang tertinggal dan ingin dijejaki, masukkan jumlah bilangan di bawah:
              </p>

              <div className="space-y-2.5">
                {fardhuList.map((p) => (
                  <div
                    key={p.key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.icon}</span>
                      <span className="font-black text-xs text-stone-800">{p.nameBm}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setManualCounts((prev) => ({
                            ...prev,
                            [p.key]: Math.max(0, prev[p.key] - 1)
                          }))
                        }
                        className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-black text-xs cursor-pointer"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={manualCounts[p.key]}
                        onChange={(e) =>
                          setManualCounts((prev) => ({
                            ...prev,
                            [p.key]: Math.max(0, parseInt(e.target.value) || 0)
                          }))
                        }
                        className="w-14 text-center py-1 rounded-lg border border-stone-300 bg-white font-black text-xs text-rose-800"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setManualCounts((prev) => ({
                            ...prev,
                            [p.key]: prev[p.key] + 1
                          }))
                        }
                        className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-black text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualQadhaModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
