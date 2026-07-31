import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Language,
  Role,
  MembershipPlan,
  UserAccount,
  ChildProfile,
  Mission,
  BuiltStructure,
  ShopItem,
  JakimNote
} from "../types";
import {
  DEFAULT_ISLAMIC_MISSIONS,
  DEFAULT_JAWI_LESSONS,
  DEFAULT_CHORES,
  SHOP_ITEMS,
  INITIAL_LEADERBOARD,
  INITIAL_ACHIEVEMENTS
} from "../data/initialData";
import { INITIAL_JAKIM_NOTES } from "../data/jakimData";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  role: Role;
  setRole: (role: Role) => void;
  parentPin: string;
  updateParentPin: (pin: string) => void;
  user: UserAccount | null;
  setUser: (user: UserAccount | null) => void;
  registeredAccounts: UserAccount[];
  loginAccount: (
    email: string,
    password: string
  ) => { success: boolean; message: string };
  logoutAccount: () => void;
  resetPassword: (
    email: string,
    newPassword: string
  ) => { success: boolean; message: string };
  registerAccount: (
    data: Omit<UserAccount, "id" | "createdAt"> & { passwordConfirm: string }
  ) => { success: boolean; message: string };
  switchPlan: (plan: MembershipPlan) => void;
  
  // Child Profiles
  childrenProfiles: ChildProfile[];
  activeChildId: string;
  setActiveChildId: (id: string) => void;
  activeChild: ChildProfile | null;
  addChildProfile: (data: {
    name: string;
    age: number;
    gender: "boy" | "girl";
    clothing?: string;
    headwear?: string;
    color?: string;
    petType?: "cat" | "rabbit" | "bird" | "camel";
    petName?: string;
  }) => void;
  deleteChildProfile: (id: string) => void;
  updateChildProfile: (updated: Partial<ChildProfile>) => void;
  penalizeChild: (childId: string, deductXp: number, deductCoins: number, reason: string) => void;
  
  // Missions
  missions: Mission[];
  addMission: (mission: Omit<Mission, "id" | "status" | "childId">) => void;
  submitChildCustomMission: (data: {
    title: string;
    description: string;
    category?: any;
    requestedXp?: number;
    requestedCoins?: number;
    proofNote?: string;
  }) => void;
  completeMission: (id: string, proofUrl?: string, proofNote?: string) => void;
  approveMission: (id: string, bonusCoins?: number, comment?: string) => void;
  approveMissionCustomRewards: (id: string, xpReward: number, coinReward: number, comment?: string) => void;
  rejectMission: (id: string, comment?: string) => void;
  
  // JAKIM Reference Notes
  jakimNotes: JakimNote[];
  addJakimNote: (note: Omit<JakimNote, "id">) => void;
  
  // Data Reset & Demo Loaders
  resetToCleanData: () => void;
  loadDemoData: () => void;
  
  // Pet Actions
  feedPet: () => void;
  playWithPet: () => void;
  sleepPet: () => void;
  
  // Shop & Builder
  buyItem: (item: ShopItem) => { success: boolean; message: string };
  addStructureToWorld: (structure: Omit<BuiltStructure, "id">) => void;
  
  // Notifications & Sound
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER: UserAccount = {
  id: "u-101",
  name: "Encik Hafiz & Puan Sarah",
  email: "hafiz.family@example.com",
  phone: "012-3456789",
  role: "parent",
  plan: "PREMIUM",
  accessCode: "Rifqi@2026",
  password: "Password123",
  createdAt: new Date().toISOString()
};

const INITIAL_CHILDREN: ChildProfile[] = [
  {
    id: "child-1",
    parentId: "u-101",
    name: "Umar Al-Farooq",
    age: 7,
    gender: "boy",
    avatar: {
      clothing: "Baju Melayu",
      headwear: "Songkok",
      accessory: "Glasses",
      color: "#059669"
    },
    pet: {
      id: "pet-1",
      type: "cat",
      name: "Comel the Cat",
      level: 2,
      xp: 140,
      hunger: 80,
      happiness: 90,
      sleep: 95,
      evolutionStage: 1
    },
    level: 3,
    xp: 280,
    coins: 480,
    diamonds: 15,
    energy: 100,
    streak: 12,
    unlockedWorlds: ["kampung", "masjid", "sekolah", "perpustakaan"],
    builtStructures: [
      { id: "b1", type: "House", name: "Rumah Panggung Umar", x: 2, y: 2 },
      { id: "b2", type: "Mosque", name: "Masjid Kampung", x: 4, y: 3 }
    ],
    inventory: ["s1", "s4"]
  },
  {
    id: "child-2",
    parentId: "u-101",
    name: "Aisyah Humaira",
    age: 5,
    gender: "girl",
    avatar: {
      clothing: "Baju Kurung",
      headwear: "Hijab",
      accessory: "Bag",
      color: "#0284c7"
    },
    pet: {
      id: "pet-2",
      type: "rabbit",
      name: "Comel Bunny",
      level: 1,
      xp: 60,
      hunger: 70,
      happiness: 85,
      sleep: 80,
      evolutionStage: 1
    },
    level: 2,
    xp: 150,
    coins: 390,
    diamonds: 10,
    energy: 100,
    streak: 9,
    unlockedWorlds: ["kampung", "masjid"],
    builtStructures: [
      { id: "b3", type: "House", name: "Pondok Aisyah", x: 1, y: 1 }
    ],
    inventory: ["s5"]
  }
];

const LOCAL_STORAGE_KEY = "mudahkids_clean_app_v2";

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("bm");
  const [role, setRole] = useState<Role>("parent");
  const [parentPin, setParentPin] = useState<string>("1234");
  
  // Default clean initial state: no dummy user, no dummy children, no dummy missions
  const [user, setUser] = useState<UserAccount | null>(null);
  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>([DEFAULT_USER]);
  const [childrenProfiles, setChildrenProfiles] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string>("");
  const [missions, setMissions] = useState<Mission[]>([]);
  const [jakimNotes, setJakimNotes] = useState<JakimNote[]>(INITIAL_JAKIM_NOTES);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const updateParentPin = (newPin: string) => {
    if (!newPin || newPin.trim().length < 4) {
      showToast(
        language === "en" ? "PIN must be at least 4 digits!" : "PIN mestilah sekurang-kurangnya 4 digit!",
        "error"
      );
      return;
    }
    setParentPin(newPin.trim());
    showToast(
      language === "en" ? "Parent PIN updated successfully!" : "PIN Ibu Bapa berjaya dikemaskini!",
      "success"
    );
  };

  const addJakimNote = (newNote: Omit<JakimNote, "id">) => {
    const note: JakimNote = {
      ...newNote,
      id: `jn-${Date.now()}`
    };
    setJakimNotes((prev) => [note, ...prev]);
    showToast(
      language === "en" ? "JAKIM reference note added!" : "Nota Rujukan JAKIM berjaya ditambah!",
      "success"
    );
  };

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) setUser(parsed.user);
        if (parsed.registeredAccounts && Array.isArray(parsed.registeredAccounts)) {
          setRegisteredAccounts(parsed.registeredAccounts);
        }
        if (parsed.childrenProfiles) setChildrenProfiles(parsed.childrenProfiles);
        if (parsed.activeChildId) setActiveChildId(parsed.activeChildId);
        if (parsed.missions) setMissions(parsed.missions);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.role) setRole(parsed.role);
      }
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const dataToSave = {
        user,
        registeredAccounts,
        childrenProfiles,
        activeChildId,
        missions,
        language,
        role
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Failed to save state to local storage:", e);
    }
  }, [user, registeredAccounts, childrenProfiles, activeChildId, missions, language, role, isInitialized]);

  const activeChild = childrenProfiles.find((c) => c.id === activeChildId) || childrenProfiles[0] || null;

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addChildProfile = (data: {
    name: string;
    age: number;
    gender: "boy" | "girl";
    clothing?: string;
    headwear?: string;
    color?: string;
    petType?: "cat" | "rabbit" | "bird" | "camel";
    petName?: string;
  }) => {
    const newChildId = `child-${Date.now()}`;
    const newChild: ChildProfile = {
      id: newChildId,
      parentId: user?.id || "u-parent",
      name: data.name,
      age: data.age,
      gender: data.gender,
      avatar: {
        clothing: data.clothing || (data.gender === "boy" ? "Baju Melayu" : "Baju Kurung"),
        headwear: data.headwear || (data.gender === "boy" ? "Songkok" : "Hijab"),
        accessory: "None",
        color: data.color || "#059669"
      },
      pet: {
        id: `pet-${Date.now()}`,
        type: data.petType || "cat",
        name: data.petName || (data.petType === "rabbit" ? "Comel Bunny" : "Comel Cat"),
        level: 1,
        xp: 0,
        hunger: 100,
        happiness: 100,
        sleep: 100,
        evolutionStage: 1
      },
      level: 1,
      xp: 0,
      coins: 50,
      diamonds: 5,
      energy: 100,
      streak: 1,
      unlockedWorlds: ["kampung"],
      builtStructures: [],
      inventory: []
    };

    setChildrenProfiles((prev) => [...prev, newChild]);
    setActiveChildId(newChildId);
    showToast(
      language === "en"
        ? `Added ${data.name}'s profile successfully!`
        : `Profil ${data.name} berjaya ditambah! +50 Syiling ganjaran permulaan!`,
      "success"
    );
  };

  const deleteChildProfile = (id: string) => {
    setChildrenProfiles((prev) => prev.filter((c) => c.id !== id));
    setMissions((prev) => prev.filter((m) => m.childId !== id));
    if (activeChildId === id) {
      const remaining = childrenProfiles.filter((c) => c.id !== id);
      setActiveChildId(remaining[0]?.id || "");
    }
    showToast(language === "en" ? "Child profile deleted." : "Profil anak telah dipadam.", "info");
  };

  const resetToCleanData = () => {
    setUser(null);
    setChildrenProfiles([]);
    setActiveChildId("");
    setMissions([]);
    setRole("parent");
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
    showToast(
      language === "en"
        ? "App data reset to clean slate!"
        : "Data aplikasi telah dikosongkan sepenuhnya!",
      "success"
    );
  };

  const loadDemoData = () => {
    setUser(DEFAULT_USER);
    setChildrenProfiles(INITIAL_CHILDREN);
    setActiveChildId("child-1");

    const list: Mission[] = [];
    let count = 1;
    DEFAULT_ISLAMIC_MISSIONS.slice(0, 4).forEach((m) => {
      list.push({
        id: `m-${count++}`,
        childId: "child-1",
        title: m.title,
        description: m.description,
        category: "Islamic",
        xpReward: m.xpReward,
        coinReward: m.coinReward,
        status: count % 2 === 0 ? "approved" : "todo",
        difficulty: m.difficulty,
        completedAt: count % 2 === 0 ? new Date().toISOString() : undefined
      });
    });
    DEFAULT_CHORES.slice(0, 4).forEach((c) => {
      list.push({
        id: `m-${count++}`,
        childId: "child-1",
        title: c.title,
        description: c.description,
        category: "Chores",
        xpReward: c.xpReward,
        coinReward: c.coinReward,
        status: count === 5 ? "pending_approval" : "todo",
        difficulty: c.difficulty,
        proofNote: count === 5 ? "Saya dah kemaskan katil kemas-kemas!" : undefined
      });
    });
    setMissions(list);
    setRole("parent");
    showToast(
      language === "en"
        ? "Sample demo data loaded!"
        : "Data contoh demo berjaya dimuatkan!",
      "info"
    );
  };

  const loginAccount = (emailInput: string, passwordInput: string) => {
    const normalizedEmail = emailInput.trim().toLowerCase();
    const foundUser = registeredAccounts.find(
      (u) => u.email.trim().toLowerCase() === normalizedEmail
    );

    if (!foundUser) {
      return {
        success: false,
        message:
          language === "en"
            ? "Account not found. Please check your email or register."
            : "Emel tidak dijumpai dalam rekod pendaftaran. Sila semak emel atau buat pendaftaran baharu."
      };
    }

    if (foundUser.password && foundUser.password !== passwordInput) {
      return {
        success: false,
        message:
          language === "en"
            ? "Incorrect password! Access denied."
            : "Kata laluan tidak tepat! Akses ditolak."
      };
    }

    setUser(foundUser);
    setRole("parent");
    showToast(
      language === "en"
        ? `Welcome back, ${foundUser.name}!`
        : `Selamat kembali, ${foundUser.name}!`,
      "success"
    );
    return { success: true, message: "OK" };
  };

  const logoutAccount = () => {
    setUser(null);
    showToast(
      language === "en" ? "You have been logged out." : "Anda telah keluar dari akaun.",
      "info"
    );
  };

  const resetPassword = (emailInput: string, newPasswordInput: string) => {
    const normalizedEmail = emailInput.trim().toLowerCase();
    const foundUserIndex = registeredAccounts.findIndex(
      (u) => u.email.trim().toLowerCase() === normalizedEmail
    );

    if (foundUserIndex === -1) {
      return {
        success: false,
        message:
          language === "en"
            ? "Registered email address not found in system."
            : "Emel ini tidak dijumpai dalam rekod pendaftaran sistem."
      };
    }

    const updatedUsers = [...registeredAccounts];
    updatedUsers[foundUserIndex] = {
      ...updatedUsers[foundUserIndex],
      password: newPasswordInput
    };

    setRegisteredAccounts(updatedUsers);

    if (user && user.email.trim().toLowerCase() === normalizedEmail) {
      setUser({ ...user, password: newPasswordInput });
    }

    showToast(
      language === "en"
        ? "Password reset successfully! Please log in with your new password."
        : "Kata laluan telah berjaya dikemaskini! Sila log masuk menggunakan kata laluan baharu anda.",
      "success"
    );

    return { success: true, message: "OK" };
  };

  const registerAccount = (data: Omit<UserAccount, "id" | "createdAt" | "accessCode"> & { passwordConfirm: string; accessCode?: string }) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = registeredAccounts.find((u) => u.email.trim().toLowerCase() === normalizedEmail);

    if (existing) {
      return {
        success: false,
        message:
          language === "en"
            ? "This email is already registered. Please log in instead."
            : "Emel ini telah pun didaftarkan. Sila guna fungsi Log Masuk."
      };
    }

    if (!data.accessCode || data.accessCode.trim() !== "MudahKids2026") {
      return {
        success: false,
        message:
          language === "en"
            ? "Invalid access code! Please check your email for the correct code."
            : "Kod akses tidak sah! Sila semak emel anda untuk mendapatkan kod akses yang betul."
      };
    }

    const assignedCode = data.accessCode.trim();
    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email.trim(),
      phone: data.phone,
      role: "parent",
      plan: data.plan || "PREMIUM",
      accessCode: assignedCode,
      password: data.password,
      createdAt: new Date().toISOString()
    };

    setRegisteredAccounts((prev) => [...prev, newUser]);
    setUser(newUser);
    setRole("parent");
    showToast(
      language === "en"
        ? `Registration Successful! Welcome to MudahKids.`
        : `Pendaftaran Berjaya! Selamat datang ke MudahKids.`,
      "success"
    );
    return { success: true, message: "OK" };
  };

  const switchPlan = (plan: MembershipPlan) => {
    if (user) {
      setUser({ ...user, plan });
      showToast(
        language === "en" ? `Switched to ${plan} Plan successfully!` : `Pelan keahlian ditukar kepada ${plan}!`,
        "success"
      );
    }
  };

  const updateChildProfile = (updated: Partial<ChildProfile>) => {
    setChildrenProfiles((prev) =>
      prev.map((c) => (c.id === activeChildId ? { ...c, ...updated } : c))
    );
  };

  const penalizeChild = (
    childId: string,
    deductXp: number,
    deductCoins: number,
    reason: string
  ) => {
    const targetChild = childrenProfiles.find((c) => c.id === childId);
    if (!targetChild) return;

    const newXp = Math.max(0, targetChild.xp - Math.abs(deductXp));
    const newCoins = Math.max(0, targetChild.coins - Math.abs(deductCoins));
    const isUnlocked = targetChild.customReward
      ? newXp >= targetChild.customReward.targetXp
      : false;

    setChildrenProfiles((prev) =>
      prev.map((c) => {
        if (c.id === childId) {
          return {
            ...c,
            xp: newXp,
            coins: newCoins,
            customReward: c.customReward
              ? { ...c.customReward, unlocked: isUnlocked }
              : undefined
          };
        }
        return c;
      })
    );

    showToast(
      language === "en"
        ? `Deducted -${deductXp} XP & -${deductCoins} Coins for ${targetChild.name} (${reason})`
        : `Telah menolak -${deductXp} XP & -${deductCoins} Syiling untuk ${targetChild.name} (${reason})`,
      "info"
    );
  };

  const addMission = (newM: Omit<Mission, "id" | "status" | "childId">) => {
    const mission: Mission = {
      ...newM,
      id: `m-${Date.now()}`,
      childId: activeChildId,
      status: "todo"
    };
    setMissions((prev) => [mission, ...prev]);
    showToast(
      language === "en" ? "New mission added for child!" : "Tugasan baharu berjaya ditambah!",
      "success"
    );
  };

  const submitChildCustomMission = (data: {
    title: string;
    description: string;
    category?: any;
    requestedXp?: number;
    requestedCoins?: number;
    proofNote?: string;
  }) => {
    if (!activeChildId) return;
    const mission: Mission = {
      id: `m-child-${Date.now()}`,
      childId: activeChildId,
      title: data.title,
      description: data.description,
      category: data.category || "Chores",
      difficulty: "Sederhana",
      xpReward: data.requestedXp || 30,
      coinReward: data.requestedCoins || 10,
      requestedXp: data.requestedXp || 30,
      requestedCoins: data.requestedCoins || 10,
      status: "pending_approval",
      createdByChild: true,
      proofNote: data.proofNote,
      completedAt: new Date().toISOString()
    };
    setMissions((prev) => [mission, ...prev]);
    showToast(
      language === "en"
        ? "Custom task submitted for Parent Approval!"
        : "Cadangan aktiviti dihantar untuk Kelulusan Ibu Bapa!",
      "success"
    );
  };

  const approveMissionCustomRewards = (
    id: string,
    finalXp: number,
    finalCoins: number,
    comment = "Bagus anakanda! Usaha yang amat terpuji."
  ) => {
    const targetMission = missions.find((m) => m.id === id);
    if (!targetMission) return;

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            xpReward: finalXp,
            coinReward: finalCoins,
            status: "approved",
            parentComment: comment,
            approvedAt: new Date().toISOString()
          };
        }
        return m;
      })
    );

    // Award XP and Coins to active child
    if (activeChild) {
      updateChildProfile({
        xp: activeChild.xp + finalXp,
        coins: activeChild.coins + finalCoins,
        streak: activeChild.streak + 1
      });
    }

    showToast(
      language === "en"
        ? `Approved task with ${finalXp} XP & ${finalCoins} Coins!`
        : `Tugasan diluluskan dengan ${finalXp} XP & ${finalCoins} Syiling!`,
      "success"
    );
  };

  const completeMission = (id: string, proofUrl?: string, proofNote?: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: "pending_approval",
            proofUrl,
            proofNote,
            completedAt: new Date().toISOString()
          };
        }
        return m;
      })
    );
    showToast(
      language === "en" ? "Mission submitted for Parent Approval!" : "Tugasan dihantar untuk Kelulusan Ibu Bapa!",
      "success"
    );
  };

  const approveMission = (id: string, bonusCoins = 5, comment = "Bagus anakanda!") => {
    const targetMission = missions.find((m) => m.id === id);
    if (!targetMission) return;

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: "approved",
            parentComment: comment,
            approvedAt: new Date().toISOString()
          };
        }
        return m;
      })
    );

    // Award XP and Coins to active child if present
    if (activeChild) {
      const earnedXP = targetMission.xpReward;
      const earnedCoins = targetMission.coinReward + bonusCoins;

      updateChildProfile({
        xp: activeChild.xp + earnedXP,
        coins: activeChild.coins + earnedCoins,
        streak: activeChild.streak + 1
      });
    }

    showToast(
      language === "en"
        ? `Approved mission!`
        : `Lulus! Tugasan berjaya disahkan!`,
      "success"
    );
  };

  const rejectMission = (id: string, comment = "Sila buat semula dengan kemas.") => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: "rejected",
            parentComment: comment
          };
        }
        return m;
      })
    );
    showToast(
      language === "en" ? "Mission rejected for revision." : "Tugasan ditolak untuk diperbaiki.",
      "info"
    );
  };

  // Auto decay pet stats slowly over time (every 45 seconds decay 3-4%)
  useEffect(() => {
    const timer = setInterval(() => {
      setChildrenProfiles((prev) =>
        prev.map((c) => {
          if (!c.pet) return c;
          const newHunger = Math.max(15, c.pet.hunger - 4);
          const newHappiness = Math.max(15, c.pet.happiness - 3);
          const newSleep = Math.max(15, (c.pet.sleep || 100) - 2);
          return {
            ...c,
            pet: {
              ...c.pet,
              hunger: newHunger,
              happiness: newHappiness,
              sleep: newSleep
            }
          };
        })
      );
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const feedPet = () => {
    if (!activeChild) return;
    if (activeChild.coins < 2) {
      showToast(
        language === "en" ? "Not enough coins! Need 2 coins." : "Syiling tidak mencukupi! Perlu 2 syiling.",
        "error"
      );
      return;
    }
    const newHunger = Math.min(100, activeChild.pet.hunger + 35);
    const newHappiness = Math.min(100, activeChild.pet.happiness + 15);
    const newPetXP = activeChild.pet.xp + 25;
    let newLevel = activeChild.pet.level;
    let newEvolution = activeChild.pet.evolutionStage;

    const xpNeeded = newLevel * 50;
    if (newPetXP >= xpNeeded) {
      newLevel += 1;
      if (newLevel >= 2) newEvolution = 2;
      if (newLevel >= 4) newEvolution = 3;
      showToast(
        language === "en"
          ? `🎉 Your Pet leveled up to Level ${newLevel} (Stage ${newEvolution})!`
          : `🎉 Haiwan peliharaan naik ke Tahap ${newLevel} (Peringkat ${newEvolution})!`,
        "success"
      );
    } else {
      showToast(
        language === "en" ? "Yummy! Pet is happy and full! (+25 Pet XP)" : "Nyam nyam! Haiwan kenyang & gembira! (+25 XP Pet)",
        "success"
      );
    }

    updateChildProfile({
      coins: Math.max(0, activeChild.coins - 2),
      pet: {
        ...activeChild.pet,
        hunger: newHunger,
        happiness: newHappiness,
        xp: newPetXP,
        level: newLevel,
        evolutionStage: newEvolution as 1 | 2 | 3
      }
    });
  };

  const playWithPet = () => {
    if (!activeChild) return;
    const newHappiness = Math.min(100, activeChild.pet.happiness + 25);
    const newPetXP = activeChild.pet.xp + 15;
    let newLevel = activeChild.pet.level;
    let newEvolution = activeChild.pet.evolutionStage;

    const xpNeeded = newLevel * 50;
    if (newPetXP >= xpNeeded) {
      newLevel += 1;
      if (newLevel >= 2) newEvolution = 2;
      if (newLevel >= 4) newEvolution = 3;
      showToast(
        language === "en"
          ? `🎉 Your Pet leveled up to Level ${newLevel}!`
          : `🎉 Haiwan peliharaan naik ke Tahap ${newLevel}!`,
        "success"
      );
    } else {
      showToast(
        language === "en" ? "Playing together! Happiness increased! (+15 Pet XP)" : "Bermain bersama! Kegembiraan meningkat! (+15 XP Pet)",
        "success"
      );
    }

    updateChildProfile({
      pet: {
        ...activeChild.pet,
        happiness: newHappiness,
        xp: newPetXP,
        level: newLevel,
        evolutionStage: newEvolution as 1 | 2 | 3
      }
    });
  };

  const sleepPet = () => {
    if (!activeChild) return;
    updateChildProfile({
      pet: { ...activeChild.pet, sleep: 100, hunger: Math.max(10, activeChild.pet.hunger - 5) }
    });
    showToast(
      language === "en" ? "Zzz... Pet is fully rested!" : "Zzz... Haiwan kini segar semula!",
      "success"
    );
  };

  const buyItem = (item: ShopItem) => {
    if (!activeChild) {
      return { success: false, message: "Tiada profil anak aktif." };
    }
    if (item.currency === "coins" && activeChild.coins < item.price) {
      return { success: false, message: language === "en" ? "Insufficient coins!" : "Syiling tidak mencukupi!" };
    }
    if (item.currency === "diamonds" && activeChild.diamonds < item.price) {
      return { success: false, message: language === "en" ? "Insufficient diamonds!" : "Berlian tidak mencukupi!" };
    }

    const newCoins = item.currency === "coins" ? activeChild.coins - item.price : activeChild.coins;
    const newDiamonds = item.currency === "diamonds" ? activeChild.diamonds - item.price : activeChild.diamonds;

    updateChildProfile({
      coins: newCoins,
      diamonds: newDiamonds,
      inventory: [...activeChild.inventory, item.id]
    });

    return {
      success: true,
      message: language === "en" ? `Purchased ${item.nameEn}!` : `Berjaya membeli ${item.name}!`
    };
  };

  const addStructureToWorld = (structure: Omit<BuiltStructure, "id">) => {
    if (!activeChild) return;
    const newStruct: BuiltStructure = {
      ...structure,
      id: `b-${Date.now()}`
    };
    updateChildProfile({
      builtStructures: [...activeChild.builtStructures, newStruct]
    });
    showToast(language === "en" ? "Placed new building in Nusantara World!" : "Bangunan baharu dibina di Dunia Nusantara!", "success");
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        role,
        setRole,
        parentPin,
        updateParentPin,
        user,
        setUser,
        registeredAccounts,
        loginAccount,
        logoutAccount,
        resetPassword,
        registerAccount,
        switchPlan,
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
        submitChildCustomMission,
        completeMission,
        approveMission,
        approveMissionCustomRewards,
        rejectMission,
        jakimNotes,
        addJakimNote,
        resetToCleanData,
        loadDemoData,
        feedPet,
        playWithPet,
        sleepPet,
        buyItem,
        addStructureToWorld,
        toast,
        showToast,
        soundEnabled,
        setSoundEnabled
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
