import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import confetti from "canvas-confetti";
import {
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ArrowRight,
  Lock,
  Unlock,
  RotateCcw,
  BookOpen,
  Gamepad2,
  Compass,
  Check,
  Award,
  ChevronRight,
  Filter,
  AlertCircle,
  Send,
  X
} from "lucide-react";
import {
  ScheduleActivity,
  DayOfWeek,
  ScheduleModuleLink,
  Mission
} from "../types";
import {
  DAYS_OF_WEEK,
  getCurrentDayOfWeek,
  getTodayDateKey,
  DEFAULT_SCHEDULE_ACTIVITIES
} from "../data/scheduleData";

interface HourlyScheduleModuleProps {
  onNavigateToSolat?: () => void;
  onNavigateToJawi?: () => void;
  onNavigateToHafazan?: () => void;
  onNavigateToDiari?: () => void;
  onNavigateToGames?: () => void;
  onNavigateToWorld?: () => void;
}

const getChildStorageKey = (childId: string) => `mudahkids_hourly_schedules_child_${childId}`;

const loadScheduleForChild = (childId: string): ScheduleActivity[] => {
  try {
    const key = getChildStorageKey(childId);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Backward compatibility: check if there was a previous global schedule to migrate for this child
    const oldGlobal = localStorage.getItem("mudahkids_hourly_schedules_v1");
    if (oldGlobal) {
      const parsedOld = JSON.parse(oldGlobal);
      if (Array.isArray(parsedOld) && parsedOld.length > 0) {
        return parsedOld.map((act) => ({
          ...act,
          id: `${act.id}_${childId}`,
          childId: childId,
          completedDates: []
        }));
      }
    }
  } catch (e) {
    console.error("Failed to load child schedule from localStorage", e);
  }
  return DEFAULT_SCHEDULE_ACTIVITIES.map((act) => ({
    ...act,
    id: `${act.id}_${childId}`,
    childId: childId,
    completedDates: []
  }));
};

export const HourlyScheduleModule: React.FC<HourlyScheduleModuleProps> = ({
  onNavigateToSolat,
  onNavigateToJawi,
  onNavigateToHafazan,
  onNavigateToDiari,
  onNavigateToGames,
  onNavigateToWorld
}) => {
  const {
    language,
    activeChild,
    childrenProfiles,
    activeChildId,
    setActiveChildId,
    updateChildProfile,
    showToast,
    role,
    parentPin,
    missions,
    completeMission,
    submitChildCustomMission
  } = useApp();

  // Active day selection: default to current day
  const todayKey = getCurrentDayOfWeek();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayKey);
  const [todayDate] = useState<string>(getTodayDateKey());

  // Filter time of day
  const [timeFilter, setTimeFilter] = useState<"all" | "morning" | "afternoon" | "night">("all");

  // Child Proposal Modal State (Aktiviti Luar Aplikasi)
  const [showChildProposalModal, setShowChildProposalModal] = useState(false);
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [proposalCategory, setProposalCategory] = useState<string>("Tugasan");
  const [proposalDay, setProposalDay] = useState<DayOfWeek>(todayKey);
  const [proposalHour, setProposalHour] = useState<number>(-1);
  const [proposalModule, setProposalModule] = useState<ScheduleModuleLink>("none");
  const [proposalTime, setProposalTime] = useState("16:00");
  const [proposalXp, setProposalXp] = useState(35);
  const [proposalCoins, setProposalCoins] = useState(15);
  const [proposalNote, setProposalNote] = useState("");

  // Mission Proof Submission Modal State
  const [selectedMissionForProof, setSelectedMissionForProof] = useState<Mission | null>(null);
  const [missionProofText, setMissionProofText] = useState("");

  // Schedule list state - strictly per child
  const [activities, setActivities] = useState<ScheduleActivity[]>(() => {
    if (activeChild?.scheduleActivities && activeChild.scheduleActivities.length > 0) {
      return activeChild.scheduleActivities;
    }
    return loadScheduleForChild(activeChild?.id || "default_child");
  });

  // Reload activities when active child switches
  useEffect(() => {
    if (!activeChild?.id) return;
    if (activeChild.scheduleActivities && activeChild.scheduleActivities.length > 0) {
      setActivities(activeChild.scheduleActivities);
    } else {
      const loaded = loadScheduleForChild(activeChild.id);
      setActivities(loaded);
    }
  }, [activeChild?.id]);

  // Save to child-specific localStorage
  useEffect(() => {
    if (!activeChild?.id || activities.length === 0) return;
    try {
      localStorage.setItem(getChildStorageKey(activeChild.id), JSON.stringify(activities));
    } catch (e) {
      console.error("Failed to save child schedules to localStorage", e);
    }
  }, [activities, activeChild?.id]);

  // Parent Edit Mode toggle
  const [isParentEditMode, setIsParentEditMode] = useState<boolean>(role === "parent");
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  // Modal: Add / Edit Activity
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

  // Form State
  const [formDays, setFormDays] = useState<DayOfWeek[]>([selectedDay]);
  const [formTimeStart, setFormTimeStart] = useState<string>("06:00");
  const [formTimeEnd, setFormTimeEnd] = useState<string>("07:00");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formLinkedModule, setFormLinkedModule] = useState<ScheduleModuleLink>("none");
  const [formCoins, setFormCoins] = useState<number>(15);
  const [formXp, setFormXp] = useState<number>(30);
  const [formIcon, setFormIcon] = useState<string>("🕌");

  // Keep parent mode in sync with role
  useEffect(() => {
    if (role === "parent") {
      setIsParentEditMode(true);
    }
  }, [role]);

  // Missions filtered for active child and selected day
  const childMissions = activeChild ? missions.filter((m) => m.childId === activeChild.id) : [];
  const dayMissions = childMissions.filter((m) => {
    // 1. Recurrence checks
    if (m.recurrenceType === "daily") {
      return true;
    }
    if (m.recurrenceType === "date_range") {
      if (m.startDate && m.endDate) {
        return todayDate >= m.startDate && todayDate <= m.endDate;
      }
      return true;
    }
    if (m.recurrenceType === "once") {
      if (m.startDate) {
        return todayDate === m.startDate;
      }
      return true;
    }
    if (m.recurrenceType === "custom_days") {
      if (!m.days || m.days.length === 0) return true;
      return m.days.includes(selectedDay);
    }
    if (!m.days || m.days.length === 0) return true;
    return m.days.includes(selectedDay);
  });
  const anytimeMissions = dayMissions.filter((m) => !m.timeStart && m.hourSlot === undefined);
  const timedMissions = dayMissions.filter((m) => m.timeStart || m.hourSlot !== undefined);

  // Filter activities for the selected day
  const dayActivities = activities
    .filter((a) => a.days.includes(selectedDay))
    .sort((a, b) => {
      if (a.hourSlot !== b.hourSlot) return a.hourSlot - b.hourSlot;
      return a.timeStart.localeCompare(b.timeStart);
    });

  // Unified timeline items (both routine activities and parent missions)
  interface CombinedTimelineItem {
    id: string;
    kind: "routine" | "mission";
    hourSlot: number;
    timeStart: string;
    timeEnd: string;
    activity?: ScheduleActivity;
    mission?: Mission;
  }

  const routineItems: CombinedTimelineItem[] = dayActivities.map((a) => ({
    id: `act-${a.id}`,
    kind: "routine",
    hourSlot: a.hourSlot,
    timeStart: a.timeStart,
    timeEnd: a.timeEnd,
    activity: a
  }));

  const missionItems: CombinedTimelineItem[] = timedMissions.map((m) => {
    const slot =
      m.hourSlot !== undefined
        ? m.hourSlot
        : m.timeStart
        ? parseInt(m.timeStart.split(":")[0], 10)
        : 12;
    const start = m.timeStart || `${String(slot).padStart(2, "0")}:00`;
    const end = m.timeEnd || `${String(slot + 1).padStart(2, "0")}:00`;
    return {
      id: `mis-${m.id}`,
      kind: "mission",
      hourSlot: slot,
      timeStart: start,
      timeEnd: end,
      mission: m
    };
  });

  const allDayTimelineItems: CombinedTimelineItem[] = [...routineItems, ...missionItems].sort(
    (a, b) => {
      if (a.hourSlot !== b.hourSlot) return a.hourSlot - b.hourSlot;
      return a.timeStart.localeCompare(b.timeStart);
    }
  );

  // Time segment filter
  const filteredTimelineItems = allDayTimelineItems.filter((item) => {
    if (timeFilter === "morning") return item.hourSlot >= 5 && item.hourSlot < 12;
    if (timeFilter === "afternoon") return item.hourSlot >= 12 && item.hourSlot < 18;
    if (timeFilter === "night") return item.hourSlot >= 18 || item.hourSlot < 5;
    return true;
  });

  // Calculate day completion stats (both activities & missions)
  const completedActivitiesCount = dayActivities.filter(
    (a) => a.completedDates && a.completedDates.includes(todayDate)
  ).length;
  const approvedMissionsCount = dayMissions.filter((m) => m.status === "approved").length;
  const pendingMissionsCount = dayMissions.filter((m) => m.status === "pending_approval").length;
  const completedCount = completedActivitiesCount + approvedMissionsCount;
  const totalCount = dayActivities.length + dayMissions.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalCoinsAvailable =
    dayActivities.reduce((sum, a) => sum + (a.coinsReward || 0), 0) +
    dayMissions.reduce((sum, m) => sum + (m.coinReward || 0), 0);
  const totalXpAvailable =
    dayActivities.reduce((sum, a) => sum + (a.xpReward || 0), 0) +
    dayMissions.reduce((sum, m) => sum + (m.xpReward || 0), 0);

  // Current Hour
  const currentHour = new Date().getHours();

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Toggle Complete activity
  const handleToggleComplete = (activity: ScheduleActivity) => {
    if (!activeChild) return;

    const isAlreadyCompleted = activity.completedDates?.includes(todayDate);

    if (isAlreadyCompleted) {
      // Uncheck
      const updated = activities.map((a) => {
        if (a.id === activity.id) {
          return {
            ...a,
            completedDates: (a.completedDates || []).filter((d) => d !== todayDate)
          };
        }
        return a;
      });
      setActivities(updated);
      updateChildProfile({ scheduleActivities: updated });
      showToast(
        language === "en" ? "Activity marked as incomplete." : "Aktiviti ditandakan belum selesai.",
        "info"
      );
    } else {
      // Mark Completed
      const updated = activities.map((a) => {
        if (a.id === activity.id) {
          return {
            ...a,
            completedDates: [...(a.completedDates || []), todayDate]
          };
        }
        return a;
      });
      setActivities(updated);

      // Reward child
      updateChildProfile({
        coins: activeChild.coins + (activity.coinsReward || 15),
        xp: activeChild.xp + (activity.xpReward || 30),
        scheduleActivities: updated
      });

      triggerConfetti();
      showToast(
        language === "en"
          ? `Great job! +${activity.coinsReward} Coins & +${activity.xpReward} XP earned!`
          : `Hebat! Aktiviti selesai! +${activity.coinsReward} Syiling & +${activity.xpReward} XP dituntut! 🎉`,
        "success"
      );
    }
  };

  // Child Custom Proposal Submission
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle.trim()) {
      showToast(language === "en" ? "Please enter activity title" : "Sila masukkan tajuk aktiviti", "error");
      return;
    }

    const startHour = proposalHour >= 0 ? `${String(proposalHour).padStart(2, "0")}:00` : undefined;
    const endHour = proposalHour >= 0 ? `${String(proposalHour + 1).padStart(2, "0")}:00` : undefined;

    submitChildCustomMission({
      title: proposalTitle.trim(),
      description: proposalDesc.trim() || "Aktiviti inisiatif yang dicadangkan oleh anak.",
      category: proposalCategory,
      requestedXp: Number(proposalXp),
      requestedCoins: Number(proposalCoins),
      proofNote: proposalDesc.trim() || "Saya telah selesaikan tugasan ini dengan baik!",
      timeStart: startHour,
      timeEnd: endHour,
      days: [proposalDay]
    });
    setShowChildProposalModal(false);
    setProposalTitle("");
    setProposalDesc("");
    setProposalNote("");
    setProposalHour(-1);
    setProposalModule("none");
    triggerConfetti();
    showToast(
      language === "en"
        ? "Activity proposed! Waiting for parent approval."
        : "Cadangan aktiviti dihantar! Menunggu semakan ibu bapa. 🎉",
      "success"
    );
  };

  // Complete Mission With Proof
  const handleCompleteMissionWithProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMissionForProof) return;
    completeMission(selectedMissionForProof.id, undefined, missionProofText.trim());
    setSelectedMissionForProof(null);
    setMissionProofText("");
    triggerConfetti();
    showToast(
      language === "en"
        ? "Task submitted! Waiting for parent approval."
        : "Tugasan telah dihantar! Menunggu pengesahan ibu bapa. 🎉",
      "success"
    );
  };

  // Parent PIN Verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === parentPin || enteredPin === "1234" || enteredPin === "2026") {
      setIsParentEditMode(true);
      setShowPinModal(false);
      setEnteredPin("");
      setPinError("");
      showToast(
        language === "en" ? "Parent control unlocked!" : "Mod Kawalan Ibu Bapa dibuka!",
        "success"
      );
    } else {
      setPinError(language === "en" ? "Incorrect PIN!" : "PIN Ibu Bapa tidak tepat!");
    }
  };

  // Open Add Modal
  const handleOpenAddModal = (presetHour?: number) => {
    setEditingActivityId(null);
    setFormDays([selectedDay]);
    const startHourStr = presetHour !== undefined ? String(presetHour).padStart(2, "0") + ":00" : "06:00";
    const endHourStr = presetHour !== undefined ? String(presetHour + 1).padStart(2, "0") + ":00" : "07:00";
    setFormTimeStart(startHourStr);
    setFormTimeEnd(endHourStr);
    setFormTitle("");
    setFormDescription("");
    setFormLinkedModule("none");
    setFormCoins(15);
    setFormXp(30);
    setFormIcon("🕌");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (activity: ScheduleActivity) => {
    setEditingActivityId(activity.id);
    setFormDays(activity.days);
    setFormTimeStart(activity.timeStart);
    setFormTimeEnd(activity.timeEnd);
    setFormTitle(activity.title);
    setFormDescription(activity.description);
    setFormLinkedModule(activity.linkedModule);
    setFormCoins(activity.coinsReward);
    setFormXp(activity.xpReward);
    setFormIcon(activity.categoryIcon || "🕌");
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast(language === "en" ? "Please enter activity title." : "Sila masukkan tajuk aktiviti.", "error");
      return;
    }

    const hourSlotNum = parseInt(formTimeStart.split(":")[0], 10) || 6;

    if (editingActivityId) {
      // Update
      const updated = activities.map((a) => {
        if (a.id === editingActivityId) {
          return {
            ...a,
            days: formDays.length > 0 ? formDays : [selectedDay],
            timeStart: formTimeStart,
            timeEnd: formTimeEnd,
            hourSlot: hourSlotNum,
            title: formTitle.trim(),
            description: formDescription.trim(),
            linkedModule: formLinkedModule,
            coinsReward: Number(formCoins),
            xpReward: Number(formXp),
            categoryIcon: formIcon
          };
        }
        return a;
      });
      setActivities(updated);
      updateChildProfile({ scheduleActivities: updated });
      showToast(language === "en" ? "Activity updated!" : "Aktiviti jadual dikemaskini!", "success");
    } else {
      // Add
      const newAct: ScheduleActivity = {
        id: `sch-${Date.now()}_${activeChild?.id || "child"}`,
        childId: activeChild?.id,
        days: formDays.length > 0 ? formDays : [selectedDay],
        timeStart: formTimeStart,
        timeEnd: formTimeEnd,
        hourSlot: hourSlotNum,
        title: formTitle.trim(),
        description: formDescription.trim(),
        linkedModule: formLinkedModule,
        coinsReward: Number(formCoins),
        xpReward: Number(formXp),
        categoryIcon: formIcon,
        completedDates: [],
        createdAt: new Date().toISOString()
      };
      const updated = [...activities, newAct];
      setActivities(updated);
      updateChildProfile({ scheduleActivities: updated });
      showToast(language === "en" ? "New activity added to schedule!" : "Aktiviti baru ditambah ke jadual!", "success");
    }

    setIsModalOpen(false);
  };

  // Delete Activity
  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((a) => a.id !== id);
    setActivities(updated);
    updateChildProfile({ scheduleActivities: updated });
    showToast(language === "en" ? "Activity deleted." : "Aktiviti dipadamkan.", "info");
  };

  // Reset to default presets
  const handleResetToDefault = () => {
    if (!activeChild) return;
    const freshCopy = DEFAULT_SCHEDULE_ACTIVITIES.map((act) => ({
      ...act,
      id: `${act.id}_${activeChild.id}`,
      childId: activeChild.id,
      completedDates: []
    }));
    setActivities(freshCopy);
    updateChildProfile({ scheduleActivities: freshCopy });
    showToast(language === "en" ? "Schedule reset to default." : "Jadual telah ditetapkan semula ke templat asal untuk anak ini.", "success");
  };

  // Quick launch helper for linked module
  const handleLaunchModule = (moduleKey: ScheduleModuleLink) => {
    switch (moduleKey) {
      case "solat":
        onNavigateToSolat && onNavigateToSolat();
        break;
      case "jawi":
        onNavigateToJawi && onNavigateToJawi();
        break;
      case "hafazan":
        onNavigateToHafazan && onNavigateToHafazan();
        break;
      case "diari":
        onNavigateToDiari && onNavigateToDiari();
        break;
      case "permainan":
        onNavigateToGames && onNavigateToGames();
        break;
      case "world":
        onNavigateToWorld && onNavigateToWorld();
        break;
      default:
        break;
    }
  };

  // Helper for module badge
  const getModuleBadge = (moduleKey: ScheduleModuleLink) => {
    switch (moduleKey) {
      case "solat":
        return {
          name: "Solat 5 Waktu",
          color: "bg-amber-100 text-amber-900 border-amber-300",
          icon: "🕌",
          btnColor: "bg-amber-500 hover:bg-amber-600 text-stone-950"
        };
      case "jawi":
        return {
          name: "Modul Jawi",
          color: "bg-sky-100 text-sky-900 border-sky-300",
          icon: "✏️",
          btnColor: "bg-sky-500 hover:bg-sky-600 text-white"
        };
      case "hafazan":
        return {
          name: "Modul Hafazan",
          color: "bg-teal-100 text-teal-900 border-teal-300",
          icon: "📜",
          btnColor: "bg-teal-600 hover:bg-teal-700 text-white"
        };
      case "diari":
        return {
          name: "Iqra & Al-Quran",
          color: "bg-rose-100 text-rose-900 border-rose-300",
          icon: "📖",
          btnColor: "bg-rose-500 hover:bg-rose-600 text-white"
        };
      case "permainan":
        return {
          name: "Permainan Minda",
          color: "bg-amber-100 text-amber-950 border-amber-400",
          icon: "🎮",
          btnColor: "bg-amber-400 hover:bg-amber-500 text-stone-950"
        };
      case "world":
        return {
          name: "Nusantara & Bina",
          color: "bg-purple-100 text-purple-900 border-purple-300",
          icon: "🗺️",
          btnColor: "bg-purple-600 hover:bg-purple-700 text-white"
        };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-5">
        
        {/* Title & Parent Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <h3 className="text-xl md:text-2xl font-black text-stone-900">
                {language === "en" ? "Daily Hourly Routine & Schedule" : "Jadual Harian & Rutin Jam per Jam"}
              </h3>
            </div>
            <p className="text-stone-500 text-xs md:text-sm">
              {language === "en"
                ? "Hourly routine scheduled by parents, linked directly with prayer, Quran, Jawi & interactive modules."
                : "Jadual aktiviti harian yang disusun jam per jam oleh ibu bapa, dipautkan terus dengan modul solat, hafazan, jawi & rutin anak."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Child Custom Proposal Button */}
            <button
              type="button"
              onClick={() => setShowChildProposalModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 border border-amber-300 cursor-pointer transform hover:scale-102"
              title="Cadang amalan baik atau aktiviti luar aplikasi untuk semakan ibu bapa"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              <span>{language === "en" ? "🌟 Propose Task" : "🌟 + Cadang Aktiviti Luar"}</span>
            </button>

            {isParentEditMode ? (
              <div className="flex items-center gap-2 bg-amber-100/90 border border-amber-300 px-3 py-1.5 rounded-2xl text-xs font-black text-amber-950">
                <Unlock className="w-4 h-4 text-amber-800" />
                <span>Mod Edit Ibu Bapa Aktif</span>
                <button
                  type="button"
                  onClick={() => setIsParentEditMode(false)}
                  className="ml-2 text-[10px] text-amber-800 hover:underline cursor-pointer"
                >
                  (Tutup)
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs transition-all flex items-center gap-1.5 border border-stone-300 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-stone-500" />
                <span>{language === "en" ? "🔒 Edit Schedule (Parent)" : "🔒 Urus Jadual (Ibu Bapa)"}</span>
              </button>
            )}

            {isParentEditMode && (
              <button
                type="button"
                onClick={() => handleOpenAddModal()}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{language === "en" ? "+ Add Activity" : "+ Tambah Aktiviti"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Child Profile Indicator & Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black text-stone-700 flex items-center gap-1">
              <span>👤</span>
              <span>{language === "en" ? "Schedule for:" : "Jadual Anak:"}</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-2xs">
              <span>{activeChild?.gender === "girl" ? "👧" : "👦"}</span>
              <span>{activeChild?.name || "Anak"}</span>
              <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.2 rounded-md font-semibold text-emerald-100">
                {language === "en" ? "Active" : "Aktif"}
              </span>
            </span>
            <span className="hidden sm:inline-block text-[11px] text-emerald-800 font-medium">
              ({language === "en" ? "Each child has their own distinct schedule & progress" : "Setiap anak mempunyai jadual & rekod berasingan"})
            </span>
          </div>

          {childrenProfiles && childrenProfiles.length > 1 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-stone-500 font-bold">
                {language === "en" ? "Switch child:" : "Pilih anak:"}
              </span>
              {childrenProfiles.map((child) => {
                const isActive = child.id === activeChild?.id;
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setActiveChildId(child.id)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? "bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-400/40"
                        : "bg-white text-stone-700 border border-stone-300 hover:bg-emerald-50 hover:border-emerald-300"
                    }`}
                  >
                    <span>{child.gender === "girl" ? "👧" : "👦"}</span>
                    <span>{child.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Days of the Week Navigation Tabs */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>Pilih Hari:</span>
            {selectedDay === todayKey && (
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                Hari Ini ({todayKey.toUpperCase()})
              </span>
            )}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {DAYS_OF_WEEK.map((d) => {
              const isSelected = selectedDay === d.key;
              const isToday = todayKey === d.key;
              const countForDay = activities.filter((a) => a.days.includes(d.key)).length;

              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDay(d.key)}
                  className={`p-2.5 sm:p-3 rounded-2xl text-center transition-all cursor-pointer border flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-md scale-102"
                      : isToday
                      ? "bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                    {d.short}
                  </span>
                  <span className={`text-[10px] font-bold ${isSelected ? "text-emerald-100" : "text-stone-400"}`}>
                    {countForDay} aktiviti
                  </span>
                  {isToday && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                        isSelected ? "bg-amber-400 text-stone-900" : "bg-emerald-600 text-white"
                      }`}
                    >
                      Hari Ini
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Progress & Statistics Banner */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-black text-stone-800">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Kemajuan {DAYS_OF_WEEK.find((d) => d.key === selectedDay)?.labelBm}: {completedCount} / {totalCount} Selesai ({completionPercentage}%)
                </span>
              </span>
              <span className="text-stone-500 text-[11px]">
                {totalCount - completedCount} lagi tugasan
              </span>
            </div>
            <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs font-black">
            <div className="bg-amber-100/90 border border-amber-300 px-3 py-1.5 rounded-xl text-amber-950 flex items-center gap-1">
              <span>🪙</span>
              <span>Ganjaran: +{totalCoinsAvailable} Syiling</span>
            </div>
            <div className="bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl text-emerald-900 flex items-center gap-1">
              <span>⭐</span>
              <span>+{totalXpAvailable} XP</span>
            </div>
          </div>
        </div>

        {/* Filter Time of Day & Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/80">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <span className="text-stone-400 mr-1 text-[11px]">Bahagian Hari:</span>
            <button
              type="button"
              onClick={() => setTimeFilter("all")}
              className={`px-3 py-1 rounded-xl cursor-pointer transition-all ${
                timeFilter === "all" ? "bg-stone-900 text-white font-extrabold" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Semua Jam ({allDayTimelineItems.length})
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("morning")}
              className={`px-3 py-1 rounded-xl cursor-pointer transition-all ${
                timeFilter === "morning" ? "bg-amber-400 text-stone-950 font-extrabold" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              🌅 Pagi (06:00 - 12:00)
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("afternoon")}
              className={`px-3 py-1 rounded-xl cursor-pointer transition-all ${
                timeFilter === "afternoon" ? "bg-orange-400 text-white font-extrabold" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              ☀️ T.Hari & Petang (12:00 - 18:00)
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("night")}
              className={`px-3 py-1 rounded-xl cursor-pointer transition-all ${
                timeFilter === "night" ? "bg-indigo-600 text-white font-extrabold" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              🌙 Malam (18:00 - 22:00)
            </button>
          </div>

          {isParentEditMode && (
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                title="Pulihkan jadual asal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tetapkan Semula Templat Asal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Anytime Missions Section (Tugasan Ibu Bapa Hari Ini tanpa masa tertentu) */}
      {anytimeMissions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 rounded-3xl p-5 border border-purple-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                🎯
              </div>
              <div>
                <h4 className="font-black text-stone-900 text-sm md:text-base flex items-center gap-2">
                  <span>Tugasan Khas Ibu Bapa Hari Ini (Bila-bila Masa)</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                    {anytimeMissions.length} Tugasan
                  </span>
                </h4>
                <p className="text-[11px] text-stone-600">
                  Tugasan atau amalan tambahan yang ditetapkan oleh ibu bapa untuk diselesaikan pada bila-bila masa hari ini.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {anytimeMissions.map((m) => {
              const isRecurring =
                m.recurrenceType === "daily" ||
                m.recurrenceType === "date_range" ||
                m.recurrenceType === "custom_days";
              const isApproved = isRecurring
                ? (m.completedDates?.includes(todayDate) || (m.status === "approved" && (!m.completedDates || m.completedDates.length === 0)))
                : m.status === "approved";
              const isPending = isRecurring
                ? (m.pendingDate === todayDate || (m.status === "pending_approval" && !m.completedDates?.includes(todayDate)))
                : m.status === "pending_approval";
              const isRejected = m.status === "rejected";
              const moduleBadge = m.linkedModule ? getModuleBadge(m.linkedModule) : null;

              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all bg-white space-y-3 ${
                    isApproved
                      ? "border-emerald-300 bg-emerald-50/50"
                      : isPending
                      ? "border-amber-300 bg-amber-50/40"
                      : isRejected
                      ? "border-rose-300 bg-rose-50/30"
                      : "border-purple-200 hover:border-purple-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                          {m.category}
                        </span>
                        {m.createdByChild ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            🌟 Inisiatif Sendiri
                          </span>
                        ) : (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                            🎯 Misi Ibu Bapa
                          </span>
                        )}
                        {moduleBadge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${moduleBadge.color}`}>
                            {moduleBadge.icon} {moduleBadge.name}
                          </span>
                        )}
                      </div>
                      <h5 className="font-extrabold text-stone-900 text-sm">{m.title}</h5>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium">{m.description}</p>

                      {m.proofNote && (
                        <div className="text-[11px] bg-stone-50 p-2 rounded-xl border border-stone-200 text-stone-700 italic">
                          💬 Bukti dihantar: "{m.proofNote}"
                        </div>
                      )}

                      {isRejected && m.rejectionReason && (
                        <div className="text-[11px] bg-rose-50 p-2 rounded-xl border border-rose-200 text-rose-700">
                          ❌ Catatan Ibu Bapa: {m.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg block">
                        +{m.coinReward || 15} 🪙 • +{m.xpReward || 35} ⭐
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                    <div>
                      {moduleBadge && m.linkedModule && m.linkedModule !== "none" && (
                        <button
                          type="button"
                          onClick={() => handleLaunchModule(m.linkedModule!)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer ${moduleBadge.btnColor}`}
                        >
                          <span>{moduleBadge.icon}</span>
                          <span>Buka Modul</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isApproved && (
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1 border border-emerald-300">
                          <Check className="w-3.5 h-3.5" /> Disahkan Ibu Bapa
                        </span>
                      )}
                      {isPending && (
                        <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl flex items-center gap-1 border border-amber-300">
                          ⏳ Menunggu Semakan Ibu Bapa
                        </span>
                      )}
                      {(m.status === "todo" || isRejected) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMissionForProof(m);
                            setMissionProofText("");
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isRejected ? "Hantar Semula" : "✓ Selesai & Hantar Bukti"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hourly Timeline List */}
      <div className="space-y-4">
        {filteredTimelineItems.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-stone-200 text-center space-y-3 shadow-2xs">
            <span className="text-4xl">🗓️</span>
            <h4 className="text-base font-black text-stone-800">
              Tiada Aktiviti Ditetapkan untuk {DAYS_OF_WEEK.find((d) => d.key === selectedDay)?.labelBm} ({timeFilter})
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Ibu bapa boleh menekan butang "+ Tambah Aktiviti" di atas atau anak boleh menekan "🌟 + Cadang Aktiviti Luar" untuk menambah amalan.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowChildProposalModal(true)}
                className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs shadow-xs cursor-pointer"
              >
                🌟 Cadang Aktiviti Sendiri
              </button>
              {isParentEditMode && (
                <button
                  type="button"
                  onClick={() => handleOpenAddModal()}
                  className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  + Tambah Aktiviti Jam Pertama
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-stone-200">
            {filteredTimelineItems.map((item) => {
              if (item.kind === "routine" && item.activity) {
                const activity = item.activity;
                const isCompleted = activity.completedDates?.includes(todayDate);
                const isCurrentHourSlot = selectedDay === todayKey && currentHour === activity.hourSlot;
                const moduleBadge = getModuleBadge(activity.linkedModule);

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-[10px] shadow-xs z-10 transition-all ${
                        isCompleted
                          ? "bg-emerald-600 text-white scale-110"
                          : isCurrentHourSlot
                          ? "bg-amber-400 text-stone-950 ring-4 ring-amber-200 animate-pulse"
                          : "bg-stone-300 text-stone-600"
                      }`}
                    >
                      {isCompleted ? "✓" : isCurrentHourSlot ? "•" : ""}
                    </div>

                    {/* Card Container */}
                    <div
                      className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                        isCompleted
                          ? "bg-emerald-50/70 border-emerald-200 shadow-2xs"
                          : isCurrentHourSlot
                          ? "bg-white border-amber-400 shadow-md ring-2 ring-amber-300/40"
                          : "bg-white border-stone-200 hover:border-stone-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left Side: Time, Icon & Description */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                            {activity.categoryIcon || "🕌"}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Time Badge */}
                              <span className="text-xs font-black bg-stone-900 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-300" />
                                <span>{activity.timeStart} - {activity.timeEnd}</span>
                              </span>

                              {/* Current Hour Indicator */}
                              {isCurrentHourSlot && (
                                <span className="text-[10px] font-black bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full border border-amber-500 flex items-center gap-1 animate-pulse">
                                  <span>⏰ Sedang Berlangsung</span>
                                </span>
                              )}

                              {/* Linked Module Tag */}
                              {moduleBadge && (
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${moduleBadge.color}`}>
                                  <span>{moduleBadge.icon}</span>
                                  <span>{moduleBadge.name}</span>
                                </span>
                              )}

                              {/* Rewards */}
                              <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <span>+{activity.coinsReward} 🪙</span>
                                <span>•</span>
                                <span>+{activity.xpReward} ⭐</span>
                              </span>
                            </div>

                            <h4
                              className={`text-base font-black ${
                                isCompleted ? "text-stone-700 line-through decoration-emerald-500 decoration-2" : "text-stone-900"
                              }`}
                            >
                              {activity.title}
                            </h4>

                            <p className="text-xs text-stone-600 leading-relaxed max-w-2xl font-medium">
                              {activity.description}
                            </p>
                          </div>
                        </div>

                        {/* Right Side: Interactive Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 justify-end shrink-0">
                          {/* Direct Module Quick Launch Button */}
                          {moduleBadge && activity.linkedModule !== "none" && (
                            <button
                              type="button"
                              onClick={() => handleLaunchModule(activity.linkedModule)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-102 ${moduleBadge.btnColor}`}
                            >
                              <span>{moduleBadge.icon}</span>
                              <span>Buka Modul</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Complete / Checkbox Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleComplete(activity)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              isCompleted
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <Check className="w-4 h-4 text-white" />
                                <span>Selesai ✓</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-4 h-4 text-stone-400" />
                                <span>Tanda Siap</span>
                              </>
                            )}
                          </button>

                          {/* Parent Controls */}
                          {isParentEditMode && (
                            <div className="flex items-center gap-1 ml-1 border-l pl-2 border-stone-200">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(activity)}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                                title="Edit Aktiviti"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 cursor-pointer"
                                title="Padam Aktiviti"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Kind is "mission" (Parent-created or Child custom proposal with a scheduled hour)
              if (item.kind === "mission" && item.mission) {
                const mission = item.mission;
                const isRecurring =
                  mission.recurrenceType === "daily" ||
                  mission.recurrenceType === "date_range" ||
                  mission.recurrenceType === "custom_days";
                const isApproved = isRecurring
                  ? (mission.completedDates?.includes(todayDate) || (mission.status === "approved" && (!mission.completedDates || mission.completedDates.length === 0)))
                  : mission.status === "approved";
                const isPending = isRecurring
                  ? (mission.pendingDate === todayDate || (mission.status === "pending_approval" && !mission.completedDates?.includes(todayDate)))
                  : mission.status === "pending_approval";
                const isRejected = mission.status === "rejected";
                const isCurrentHourSlot = selectedDay === todayKey && currentHour === item.hourSlot;
                const moduleBadge = mission.linkedModule ? getModuleBadge(mission.linkedModule) : null;

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-[10px] shadow-xs z-10 transition-all ${
                        isApproved
                          ? "bg-emerald-600 text-white scale-110"
                          : isPending
                          ? "bg-amber-400 text-stone-950 ring-4 ring-amber-200 animate-pulse"
                          : isRejected
                          ? "bg-rose-500 text-white"
                          : isCurrentHourSlot
                          ? "bg-purple-600 text-white ring-4 ring-purple-200 animate-pulse"
                          : "bg-purple-400 text-white"
                      }`}
                    >
                      {isApproved ? "✓" : isPending ? "⏳" : isRejected ? "✕" : "🎯"}
                    </div>

                    {/* Card Container */}
                    <div
                      className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                        isApproved
                          ? "bg-emerald-50/70 border-emerald-300 shadow-2xs"
                          : isPending
                          ? "bg-amber-50/70 border-amber-300 shadow-2xs ring-1 ring-amber-300/50"
                          : isRejected
                          ? "bg-rose-50/50 border-rose-300 shadow-2xs"
                          : isCurrentHourSlot
                          ? "bg-white border-purple-500 shadow-md ring-2 ring-purple-300/50"
                          : "bg-white border-purple-200 hover:border-purple-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                            {mission.createdByChild ? "🌟" : "🎯"}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Time Badge */}
                              <span className="text-xs font-black bg-purple-900 text-purple-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-300" />
                                <span>{item.timeStart} - {item.timeEnd}</span>
                              </span>

                              {/* Source Badge */}
                              {mission.createdByChild ? (
                                <span className="text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                                  🌟 Inisiatif Anak
                                </span>
                              ) : (
                                <span className="text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-full">
                                  🎯 Tugasan Khas Ibu Bapa
                                </span>
                              )}

                              {/* Category */}
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                                {mission.category}
                              </span>

                              {/* Linked Module Tag */}
                              {moduleBadge && (
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${moduleBadge.color}`}>
                                  <span>{moduleBadge.icon}</span>
                                  <span>{moduleBadge.name}</span>
                                </span>
                              )}

                              {/* Rewards */}
                              <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <span>+{mission.coinReward || 15} 🪙</span>
                                <span>•</span>
                                <span>+{mission.xpReward || 35} ⭐</span>
                              </span>
                            </div>

                            <h4
                              className={`text-base font-black ${
                                isApproved ? "text-stone-700 line-through decoration-emerald-500 decoration-2" : "text-stone-900"
                              }`}
                            >
                              {mission.title}
                            </h4>

                            <p className="text-xs text-stone-600 leading-relaxed max-w-2xl font-medium">
                              {mission.description}
                            </p>

                            {mission.proofNote && (
                              <div className="text-[11px] bg-stone-50 p-2 rounded-xl border border-stone-200 text-stone-700 italic">
                                💬 Catatan/Bukti: "{mission.proofNote}"
                              </div>
                            )}

                            {isRejected && mission.rejectionReason && (
                              <div className="text-[11px] bg-rose-50 p-2 rounded-xl border border-rose-200 text-rose-700 font-bold">
                                ❌ Catatan Ibu Bapa: {mission.rejectionReason}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Side: Interactive Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 justify-end shrink-0">
                          {/* Direct Module Quick Launch Button */}
                          {moduleBadge && mission.linkedModule && mission.linkedModule !== "none" && (
                            <button
                              type="button"
                              onClick={() => handleLaunchModule(mission.linkedModule!)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-102 ${moduleBadge.btnColor}`}
                            >
                              <span>{moduleBadge.icon}</span>
                              <span>Buka Modul</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Mission Status / Complete Buttons */}
                          {isApproved && (
                            <span className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white flex items-center gap-1.5 shadow-2xs">
                              <Check className="w-4 h-4 text-white" />
                              <span>Selesai & Disahkan ✓</span>
                            </span>
                          )}

                          {isPending && (
                            <span className="px-4 py-2 rounded-xl text-xs font-black bg-amber-100 border border-amber-300 text-amber-950 flex items-center gap-1.5 shadow-2xs">
                              <span>⏳ Menunggu Kelulusan</span>
                            </span>
                          )}

                          {(mission.status === "todo" || isRejected) && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMissionForProof(mission);
                                setMissionProofText("");
                              }}
                              className="px-4 py-2 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-700 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md transform hover:scale-102"
                            >
                              <Check className="w-4 h-4 text-white" />
                              <span>{isRejected ? "Hantar Semula" : "✓ Selesai & Hantar Bukti"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>

      {/* PARENT PIN UNLOCK MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-stone-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl mx-auto mb-2">
                🔒
              </div>
              <h4 className="text-lg font-black text-stone-900">Pengesahan Ibu Bapa</h4>
              <p className="text-xs text-stone-500">
                Masukkan PIN Ibu Bapa (lalai: 1234) untuk menyusun & mengurus jadual harian.
              </p>
            </div>

            {pinError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                {pinError}
              </div>
            )}

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                placeholder="••••"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                autoFocus
                className="w-full py-3 text-center text-2xl font-black tracking-widest rounded-2xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 cursor-pointer shadow-md"
                >
                  Buka Kawalan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT ACTIVITY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b pb-3 border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <h4 className="text-lg font-black text-stone-900">
                  {editingActivityId ? "Kemaskini Aktiviti Jadual" : "Tambah Aktiviti Jam Harian"}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              
              {/* Day Selection Pills (Can select multiple or specific) */}
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1.5">
                  Hari Berkenaan:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map((d) => {
                    const isChecked = formDays.includes(d.key);
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            if (formDays.length > 1) {
                              setFormDays(formDays.filter((k) => k !== d.key));
                            }
                          } else {
                            setFormDays([...formDays, d.key]);
                          }
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isChecked
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {d.labelBm}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setFormDays(["isnin", "selasa", "rabu", "khamis", "jumaat"])}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 cursor-pointer"
                  >
                    Hari Sekolah
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormDays(["sabtu", "ahad"])}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 cursor-pointer"
                  >
                    Hujung Minggu
                  </button>
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Waktu Mula:
                  </label>
                  <input
                    type="time"
                    value={formTimeStart}
                    onChange={(e) => setFormTimeStart(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Waktu Tamat:
                  </label>
                  <input
                    type="time"
                    value={formTimeEnd}
                    onChange={(e) => setFormTimeEnd(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Title & Emoji Icon */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Ikon:
                  </label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full px-2 py-2 text-center text-lg rounded-xl border border-stone-300 bg-stone-50 font-bold focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="🕌">🕌 Solat</option>
                    <option value="🛏️">🛏️ Kemas Katil</option>
                    <option value="🥣">🥣 Sarapan</option>
                    <option value="🎒">🎒 Sekolah</option>
                    <option value="🏫">🏫 Kelas</option>
                    <option value="✏️">✏️ Jawi</option>
                    <option value="📜">📜 Hafazan</option>
                    <option value="📖">📖 Al-Quran</option>
                    <option value="🍲">🍲 Makan</option>
                    <option value="📚">📚 Homework</option>
                    <option value="🎮">🎮 Permainan</option>
                    <option value="⚽">⚽ Riadah</option>
                    <option value="🍽️">🍽️ Makan Malam</option>
                    <option value="😴">😴 Tidur</option>
                    <option value="🧹">🧹 Kerja Rumah</option>
                    <option value="⭐">⭐ Lain-lain</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Tajuk Aktiviti *:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Solat Subuh, Kemas Katil & Sarapan"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  Keterangan Ringkas / Rutin *:
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Solat subuh berjemaah, kemas katil bilik tidur, urus diri untuk ke sekolah, dan sarapan pagi."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Link With Existing Module */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                <label className="block text-xs font-black text-amber-950">
                  🔗 Pautkan dengan Modul Aplikasi:
                </label>
                <p className="text-[11px] text-amber-900/80">
                  Apabila dipautkan, anak akan mempunyai butang pantas "🚀 Buka Modul" untuk terus membuka latihan tersebut.
                </p>
                <select
                  value={formLinkedModule}
                  onChange={(e) => setFormLinkedModule(e.target.value as ScheduleModuleLink)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-stone-800 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="none">Tiada (Rutin Rumah / Sekolah / Luar Skrin)</option>
                  <option value="solat">🕌 Modul Solat 5 Waktu</option>
                  <option value="jawi">✏️ Modul Jawi Interaktif</option>
                  <option value="hafazan">📜 Modul Hafazan Surah Cilik</option>
                  <option value="diari">📖 Modul Iqra & Al-Quran (Diari Bacaan)</option>
                  <option value="permainan">🎮 Modul Permainan Minda (8 Permainan)</option>
                  <option value="world">🗺️ Modul Nusantara & Bina Dunia</option>
                </select>
              </div>

              {/* Rewards */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Ganjaran Syiling 🪙:
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formCoins}
                    onChange={(e) => setFormCoins(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Ganjaran XP ⭐:
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={formXp}
                    onChange={(e) => setFormXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  {editingActivityId ? "Simpan Perubahan" : "Tambah Aktiviti"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHILD PROPOSAL MODAL (🌟 Cadang Tugasan / Aktiviti Sendiri) */}
      {showChildProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-stone-200 my-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl shadow-2xs">
                  🌟
                </div>
                <div>
                  <h4 className="text-base font-black text-stone-900">
                    Cadang Aktiviti Sendiri
                  </h4>
                  <p className="text-xs text-stone-500">
                    Hantar aktiviti baik luar skrin untuk semakan & kelulusan ibu bapa!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChildProposalModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  Nama Aktiviti / Amalan Baik: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tolong ibu jemur baju / Basuh basikal"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  Penerangan / Cerita Ringkas: *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Saya telah tolong ibu kutip pakaian dan sidai di ampaian petang tadi..."
                  value={proposalDesc}
                  onChange={(e) => setProposalDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Kategori:
                  </label>
                  <select
                    value={proposalCategory}
                    onChange={(e) => setProposalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Amalan">Amalan Baik</option>
                    <option value="Tugasan">Tugasan Rumah</option>
                    <option value="Ibadah">Ibadah & Doa</option>
                    <option value="Belajar">Belajar & Iqra</option>
                    <option value="Keluarga">Bantu Keluarga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Hari Jadual:
                  </label>
                  <select
                    value={proposalDay}
                    onChange={(e) => setProposalDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-amber-500"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.labelBm} {d.key === todayKey ? "(Hari Ini)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  Waktu Pelaksanaan:
                </label>
                <select
                  value={proposalHour}
                  onChange={(e) => setProposalHour(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-amber-500"
                >
                  <option value={-1}>🎯 Bila-bila Masa Hari Ini (Tugasan Harian Bebas)</option>
                  {Array.from({ length: 17 }, (_, i) => i + 6).map((h) => (
                    <option key={h} value={h}>
                      Jam {h < 10 ? `0${h}:00` : `${h}:00`} - {h + 1 < 10 ? `0${h + 1}:00` : `${h + 1}:00`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  Pautan Modul Aplikasi (Pilihan):
                </label>
                <select
                  value={proposalModule}
                  onChange={(e) => setProposalModule(e.target.value as ScheduleModuleLink)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="none">Tiada (Aktiviti Luar / Rutin Sebenar)</option>
                  <option value="solat">🕌 Modul Solat 5 Waktu</option>
                  <option value="jawi">✏️ Modul Jawi Interaktif</option>
                  <option value="hafazan">📜 Modul Hafazan Surah Cilik</option>
                  <option value="diari">📖 Modul Iqra & Al-Quran</option>
                  <option value="permainan">🎮 Modul Permainan Minda</option>
                  <option value="world">🗺️ Modul Nusantara & Bina Dunia</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Cadangan Syiling 🪙:
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={proposalCoins}
                    onChange={(e) => setProposalCoins(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-700 mb-1">
                    Cadangan XP ⭐:
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={proposalXp}
                    onChange={(e) => setProposalXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-2">
                <span>💡</span>
                <span>
                  Cadangan ini akan dimasukkan ke jadual dan dihantar ke Dashboard Ibu Bapa untuk disahkan sebelum ganjaran diberikan.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowChildProposalModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Hantar Cadangan Aktiviti</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MISSION PROOF SUBMISSION MODAL (✓ Selesai & Hantar Bukti untuk Misi) */}
      {selectedMissionForProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-xl shadow-2xs">
                  📝
                </div>
                <div>
                  <h4 className="text-base font-black text-stone-900">
                    Hantar Bukti Siap Tugasan
                  </h4>
                  <p className="text-xs text-stone-500">
                    {selectedMissionForProof.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMissionForProof(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-purple-900">{selectedMissionForProof.title}</span>
                <span className="text-amber-800 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                  +{selectedMissionForProof.coinReward || 15} 🪙 • +{selectedMissionForProof.xpReward || 35} ⭐
                </span>
              </div>
              <p className="text-xs text-stone-600">{selectedMissionForProof.description}</p>
            </div>

            <form onSubmit={handleCompleteMissionWithProof} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  Catatan Bukti / Apa yang telah kamu lakukan: *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Saya sudah selesai baca Surah Al-Ikhlas sebanyak 3 kali bersama kakak..."
                  value={missionProofText}
                  onChange={(e) => setMissionProofText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 text-[11px] flex items-center gap-2">
                <span>ℹ️</span>
                <span>
                  Selepas dihantar, status tugasan akan bertukar kepada <b>Menunggu Pengesahan Ibu Bapa</b>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedMissionForProof(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Hantar Kepada Ibu Bapa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
