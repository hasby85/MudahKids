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
import {
  fetchAccountsList,
  registerAccountCloud,
  loginAccountCloud,
  resetPasswordCloud,
  saveSyncedDataCloud,
  fetchSyncedDataCloud,
  mergeChildProfileObjects
} from "../services/cloudAuthSync";

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
  ) => Promise<{ success: boolean; message: string }>;
  logoutAccount: () => void;
  resetPassword: (
    email: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  registerAccount: (
    data: Omit<UserAccount, "id" | "createdAt" | "accessCode"> & {
      passwordConfirm: string;
      accessCode?: string;
    }
  ) => Promise<{ success: boolean; message: string }>;
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
  syncLatestCloudData: (targetEmail?: string, forceSync?: boolean) => Promise<void>;
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
    inventory: ["s1", "s4"],
    quranIqraProgress: {
      currentType: "iqra",
      currentIqraLevel: 5,
      currentIqraPage: 3,
      currentQuranJuzuk: 1,
      currentQuranSurahName: "Al-Fatihah",
      currentQuranPage: 1,
      currentQuranAyat: 1,
      lastUpdated: new Date().toISOString(),
      history: [
        {
          id: "log-1",
          type: "iqra",
          title: "Iqra 5 - Muka Surat 3",
          iqraLevel: 5,
          iqraPage: 3,
          completedAt: new Date().toISOString(),
          parentNote: "Lancar dan tajwid betul! Syabas abang Umar."
        }
      ]
    }
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
    inventory: ["s5"],
    quranIqraProgress: {
      currentType: "iqra",
      currentIqraLevel: 2,
      currentIqraPage: 12,
      currentQuranJuzuk: 1,
      currentQuranSurahName: "Al-Fatihah",
      currentQuranPage: 1,
      currentQuranAyat: 1,
      lastUpdated: new Date().toISOString(),
      history: [
        {
          id: "log-2",
          type: "iqra",
          title: "Iqra 2 - Muka Surat 12",
          iqraLevel: 2,
          iqraPage: 12,
          completedAt: new Date().toISOString(),
          parentNote: "Bagus Aisyah, sambung usaha lagi!"
        }
      ]
    }
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

  const isUpdatingFromCloudRef = React.useRef(false);
  const isFetchingOrLoggingInRef = React.useRef(false);
  const lastSyncedCloudHashRef = React.useRef("");
  const lastLocalMutationTimeRef = React.useRef(0);
  const isLocalMutationPendingRef = React.useRef(false);
  const deletedChildIdsRef = React.useRef<Set<string>>(new Set());

  const markLocalMutation = () => {
    lastLocalMutationTimeRef.current = Date.now();
    isLocalMutationPendingRef.current = true;
  };

  // Sync latest cloud data for a logged-in user across devices (with mobile support)
  const syncLatestCloudData = async (targetEmail?: string, forceSync: boolean = false) => {
    const emailToSync = targetEmail || user?.email;
    if (!emailToSync || !user || user.email.trim().toLowerCase() !== emailToSync.trim().toLowerCase()) return;

    // Guard 1: Skip cloud polling if a local mutation happened very recently (< 3 seconds ago) unless forceSync is requested
    if (!forceSync) {
      if (isLocalMutationPendingRef.current || (Date.now() - lastLocalMutationTimeRef.current < 3000)) {
        return;
      }
    }

    try {
      const cloudData = await fetchSyncedDataCloud(emailToSync);

      // Guard 2 (Post-Fetch Guard): Verify active user and mutation timing after async fetch completes
      if (!user || user.email.trim().toLowerCase() !== emailToSync.trim().toLowerCase()) return;
      if (!forceSync && (isLocalMutationPendingRef.current || (Date.now() - lastLocalMutationTimeRef.current < 3000))) {
        console.log("🛡️ Post-fetch Guard: Local mutation occurred during cloud fetch. Preserving local state.");
        return;
      }

      if (cloudData) {
        const currentUserId = user.id;
        const currentUserEmail = user.email.trim().toLowerCase();

        if (Array.isArray(cloudData.childrenProfiles)) {
          // Filter cloud profiles belonging strictly to this user
          const validCloudProfiles = cloudData.childrenProfiles.filter((cp: ChildProfile) => {
            if (!cp || !cp.id || deletedChildIdsRef.current.has(cp.id)) return false;
            if (cp.parentId && cp.parentId !== currentUserId && cp.parentId !== user.email && cp.parentId !== currentUserEmail) {
              return false;
            }
            return true;
          });

          setChildrenProfiles((currentLocal) => {
            const profileMap = new Map<string, ChildProfile>();

            // 1. Keep current local profiles belonging strictly to this active user as baseline
            currentLocal.forEach((p) => {
              if (p && p.id && !deletedChildIdsRef.current.has(p.id)) {
                if (!p.parentId || p.parentId === currentUserId || p.parentId === user.email || p.parentId === currentUserEmail) {
                  profileMap.set(p.id, { ...p, parentId: currentUserId });
                }
              }
            });

            // 2. Non-destructively deep merge valid cloud profiles for this active user
            validCloudProfiles.forEach((cp: ChildProfile) => {
              if (!profileMap.has(cp.id)) {
                profileMap.set(cp.id, { ...cp, parentId: currentUserId });
              } else {
                const local = profileMap.get(cp.id)!;
                const merged = mergeChildProfileObjects(local, cp);
                profileMap.set(cp.id, {
                  ...merged,
                  parentId: currentUserId
                });
              }
            });

            return Array.from(profileMap.values());
          });
        }

        if (cloudData.activeChildId) {
          setActiveChildId((curr) => curr || cloudData.activeChildId);
        }

        if (Array.isArray(cloudData.missions) && cloudData.missions.length > 0) {
          setMissions((currentMissions) => {
            const missionMap = new Map<string, Mission>();
            currentMissions.forEach((m) => { if (m && m.id) missionMap.set(m.id, m); });
            cloudData.missions.forEach((cm: Mission) => {
              if (cm && cm.id && !missionMap.has(cm.id)) missionMap.set(cm.id, cm);
            });
            return Array.from(missionMap.values());
          });
        }

        if (cloudData.language) {
          setLanguage(cloudData.language);
        }
      }
    } catch (e) {
      console.warn("Failed to sync cloud data:", e);
    }
  };

  // Load saved state from localStorage & fetch registered accounts & cloud data
  useEffect(() => {
    let savedUserEmail: string | null = null;
    try {
      const deletedRaw = localStorage.getItem("mudahkids_deleted_child_ids");
      if (deletedRaw) {
        const parsed = JSON.parse(deletedRaw);
        if (Array.isArray(parsed)) deletedChildIdsRef.current = new Set(parsed);
      }

      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) {
          setUser(parsed.user);
          savedUserEmail = parsed.user.email;
        }
        if (parsed.registeredAccounts && Array.isArray(parsed.registeredAccounts)) {
          setRegisteredAccounts(parsed.registeredAccounts);
        }
        if (parsed.user && parsed.childrenProfiles && Array.isArray(parsed.childrenProfiles)) {
          const uId = parsed.user.id;
          const uEmail = parsed.user.email?.trim().toLowerCase();
          const filtered = parsed.childrenProfiles.filter((p: any) => {
            if (!p) return false;
            if (p.parentId && p.parentId !== uId && p.parentId !== uEmail) return false;
            return true;
          });
          setChildrenProfiles(filtered);
        }
        if (parsed.activeChildId) setActiveChildId(parsed.activeChildId);
        if (parsed.user && parsed.missions) setMissions(parsed.missions);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.role) setRole(parsed.role);
      }
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    } finally {
      setIsInitialized(true);
    }

    if (savedUserEmail) {
      syncLatestCloudData(savedUserEmail, true);
    }

    // Fetch accounts list from server/cloud store for multi-device sync
    fetchAccountsList().then((accs) => {
      if (Array.isArray(accs) && accs.length > 0) {
        setRegisteredAccounts((prev) => {
          const merged = [...prev];
          accs.forEach((acc) => {
            if (!merged.some((m) => m.email.trim().toLowerCase() === acc.email.trim().toLowerCase())) {
              merged.push(acc);
            }
          });
          return merged;
        });
      }
    }).catch(() => {});
  }, []);

  // Periodic polling & mobile event listeners (focus, visibilitychange, pageshow, online) for continuous real-time sync
  useEffect(() => {
    if (!isInitialized || !user?.email) return;

    // Initial force sync on mount
    syncLatestCloudData(user.email, true);

    const interval = setInterval(() => {
      syncLatestCloudData(user.email);
    }, 5000);

    const handleMobileResume = () => {
      if (document.visibilityState === "visible") {
        syncLatestCloudData(user.email, true);
      }
    };

    window.addEventListener("focus", handleMobileResume);
    window.addEventListener("pageshow", handleMobileResume);
    window.addEventListener("online", handleMobileResume);
    document.addEventListener("visibilitychange", handleMobileResume);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleMobileResume);
      window.removeEventListener("pageshow", handleMobileResume);
      window.removeEventListener("online", handleMobileResume);
      document.removeEventListener("visibilitychange", handleMobileResume);
    };
  }, [user?.email, isInitialized]);

  // Save state to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const dataToSave = {
        user,
        registeredAccounts,
        childrenProfiles: user ? childrenProfiles : [],
        activeChildId: user ? activeChildId : "",
        missions: user ? missions : [],
        language,
        role
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Failed to save state to local storage:", e);
    }
  }, [user, registeredAccounts, childrenProfiles, activeChildId, missions, language, role, isInitialized]);

  // Auto-sync local user data changes to backend/cloud server when logged in
  useEffect(() => {
    if (!isInitialized || !user || isFetchingOrLoggingInRef.current) return;

    if (isUpdatingFromCloudRef.current) {
      isUpdatingFromCloudRef.current = false;
      return;
    }

    const currentHash = JSON.stringify({
      childrenProfiles,
      activeChildId,
      missions,
      language,
      user
    });

    if (currentHash === lastSyncedCloudHashRef.current) return;
    
    lastSyncedCloudHashRef.current = currentHash;
    lastLocalMutationTimeRef.current = Date.now();
    isLocalMutationPendingRef.current = true;

    const timer = setTimeout(async () => {
      try {
        await saveSyncedDataCloud(user.email, {
          user,
          childrenProfiles,
          activeChildId,
          missions,
          language
        });
      } catch (err) {
        console.warn("Auto-sync save error:", err);
      } finally {
        isLocalMutationPendingRef.current = false;
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [user, childrenProfiles, activeChildId, missions, language, isInitialized]);


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

    markLocalMutation();
    setChildrenProfiles((prev) => {
      const updated = [...prev, newChild];
      if (user?.email) {
        saveSyncedDataCloud(user.email, {
          user,
          childrenProfiles: updated,
          activeChildId: newChildId,
          missions,
          language
        }).catch(() => {});
      }
      return updated;
    });
    setActiveChildId(newChildId);
    showToast(
      language === "en"
        ? `Added ${data.name}'s profile successfully!`
        : `Profil ${data.name} berjaya ditambah! +50 Syiling ganjaran permulaan!`,
      "success"
    );
  };

  const deleteChildProfile = (id: string) => {
    markLocalMutation();
    deletedChildIdsRef.current.add(id);
    try {
      localStorage.setItem("mudahkids_deleted_child_ids", JSON.stringify(Array.from(deletedChildIdsRef.current)));
    } catch (e) {}

    const remainingProfiles = childrenProfiles.filter((c) => c.id !== id);
    setChildrenProfiles(remainingProfiles);
    setMissions((prev) => prev.filter((m) => m.childId !== id));

    const nextActiveId = activeChildId === id ? (remainingProfiles[0]?.id || "") : activeChildId;
    setActiveChildId(nextActiveId);

    if (user?.email) {
      saveSyncedDataCloud(user.email, {
        user,
        childrenProfiles: remainingProfiles,
        activeChildId: nextActiveId,
        missions: missions.filter((m) => m.childId !== id),
        language
      }).catch(() => {});
    }

    showToast(language === "en" ? "Child profile deleted." : "Profil anak telah dipadam.", "info");
  };

  const resetToCleanData = async () => {
    if (user) {
      try {
        await saveSyncedDataCloud(user.email, {
          user,
          childrenProfiles: [],
          activeChildId: "",
          missions: [],
          language
        });
      } catch (e) {
        console.warn("Failed to sync reset state to cloud:", e);
      }
    }

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

  const loginAccount = async (emailInput: string, passwordInput: string) => {
    isFetchingOrLoggingInRef.current = true;

    // Reset state for new login session
    setUser(null);
    setChildrenProfiles([]);
    setActiveChildId("");
    setMissions([]);
    deletedChildIdsRef.current = new Set();
    lastSyncedCloudHashRef.current = "";
    lastLocalMutationTimeRef.current = 0;
    isLocalMutationPendingRef.current = false;

    const result = await loginAccountCloud(emailInput, passwordInput, language);

    if (!result.success || !result.user) {
      isFetchingOrLoggingInRef.current = false;
      return { success: false, message: result.message };
    }

    const loggedInUser = result.user;

    // Fetch user-specific synced data BEFORE setting user state
    let userSyncedData = result.syncedData;
    if (!userSyncedData) {
      userSyncedData = await fetchSyncedDataCloud(loggedInUser.email);
    }

    let validProfiles: ChildProfile[] = [];
    let validMissions: Mission[] = [];
    let activeChildIdToSet = "";
    let languageToSet = language;

    if (userSyncedData) {
      const uId = loggedInUser.id;
      const uEmail = loggedInUser.email.trim().toLowerCase();
      validProfiles = Array.isArray(userSyncedData.childrenProfiles)
        ? userSyncedData.childrenProfiles.filter((p: any) => {
            if (!p) return false;
            if (p.parentId && p.parentId !== uId && p.parentId !== uEmail && p.parentId !== loggedInUser.email) {
              return false;
            }
            return true;
          }).map((p: any) => ({ ...p, parentId: p.parentId || uId }))
        : [];

      activeChildIdToSet = userSyncedData.activeChildId || validProfiles[0]?.id || "";
      validMissions = Array.isArray(userSyncedData.missions) ? userSyncedData.missions : [];
      if (userSyncedData.language) {
        languageToSet = userSyncedData.language;
      }
    }

    // Set state TOGETHER
    setChildrenProfiles(validProfiles);
    setActiveChildId(activeChildIdToSet);
    setMissions(validMissions);
    setLanguage(languageToSet);
    setRole("child");
    setUser(loggedInUser);

    const initialHash = JSON.stringify({
      childrenProfiles: validProfiles,
      activeChildId: activeChildIdToSet,
      missions: validMissions,
      language: languageToSet,
      user: loggedInUser
    });
    lastSyncedCloudHashRef.current = initialHash;
    lastLocalMutationTimeRef.current = 0;
    isLocalMutationPendingRef.current = false;

    // Add to local registeredAccounts list if not present
    setRegisteredAccounts((prev) => {
      if (!prev.some((a) => a.email.trim().toLowerCase() === loggedInUser.email.trim().toLowerCase())) {
        return [...prev, loggedInUser];
      }
      return prev;
    });

    setTimeout(() => {
      isFetchingOrLoggingInRef.current = false;
    }, 1000);

    showToast(
      language === "en"
        ? `Welcome back, ${loggedInUser.name}!`
        : `Selamat kembali, ${loggedInUser.name}!`,
      "success"
    );
    return { success: true, message: "OK" };
  };

  const logoutAccount = () => {
    setUser(null);
    setChildrenProfiles([]);
    setActiveChildId("");
    setMissions([]);
    deletedChildIdsRef.current = new Set();
    lastSyncedCloudHashRef.current = "";
    lastLocalMutationTimeRef.current = 0;
    isLocalMutationPendingRef.current = false;

    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem("mudahkids_deleted_child_ids");
    } catch (e) {}

    showToast(
      language === "en" ? "You have been logged out." : "Anda telah keluar dari akaun.",
      "info"
    );
  };

  const resetPassword = async (emailInput: string, newPasswordInput: string) => {
    const result = await resetPasswordCloud(emailInput, newPasswordInput, language);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    const normalizedEmail = emailInput.trim().toLowerCase();
    setRegisteredAccounts((prev) =>
      prev.map((acc) =>
        acc.email.trim().toLowerCase() === normalizedEmail
          ? { ...acc, password: newPasswordInput }
          : acc
      )
    );

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

  const registerAccount = async (data: Omit<UserAccount, "id" | "createdAt" | "accessCode"> & { passwordConfirm: string; accessCode?: string }) => {
    // Reset state for new registration
    setUser(null);
    setChildrenProfiles([]);
    setActiveChildId("");
    setMissions([]);
    deletedChildIdsRef.current = new Set();
    lastSyncedCloudHashRef.current = "";
    lastLocalMutationTimeRef.current = Date.now();
    isLocalMutationPendingRef.current = false;

    const result = await registerAccountCloud({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      plan: data.plan,
      accessCode: data.accessCode,
      language
    });

    if (!result.success || !result.user) {
      return { success: false, message: result.message };
    }

    const newUser = result.user;
    setUser(newUser);
    // Default to mode anak (child) on registration/login
    setRole("child");

    setRegisteredAccounts((prev) => {
      if (!prev.some((a) => a.email.trim().toLowerCase() === newUser.email.trim().toLowerCase())) {
        return [...prev, newUser];
      }
      return prev;
    });

    // Save initial sync data
    saveSyncedDataCloud(newUser.email, {
      user: newUser,
      childrenProfiles: [],
      activeChildId: "",
      missions: [],
      language
    });

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
    markLocalMutation();
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
        setSoundEnabled,
        syncLatestCloudData
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
