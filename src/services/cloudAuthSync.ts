import { UserAccount, MembershipPlan } from "../types";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  fetchAccountsFromSupabase,
  saveAccountToSupabase,
  saveSyncedDataToSupabase,
  fetchSyncedDataFromSupabase
} from "../lib/supabaseSync";
import {
  saveFamilyDataToFirestore,
  fetchFamilyDataFromFirestore,
  saveAccountToFirestore,
  fetchAccountsFromFirestore,
  fetchAccountByEmailFromFirestore
} from "../lib/firebaseSync";
import { SEED_ACCOUNTS, buildSeedSyncedData } from "../data/seedStore";

const MASTER_CLOUD_STORE_URL = "https://jsonblob.com/api/jsonBlob/019ff11c-dfc0-7f84-80c6-4b38b28bc3a7";
let activeMasterUrl = MASTER_CLOUD_STORE_URL;

const VAULT_KEY = "mudahkids_registered_accounts_v2";

export function getLocalAccountsVault(): UserAccount[] {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    const map = new Map<string, UserAccount>();
    SEED_ACCOUNTS.forEach(a => map.set((a.email || "").trim().toLowerCase(), a));

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((a: UserAccount) => {
          if (a && a.email) {
            const eKey = a.email.trim().toLowerCase();
            const existing = map.get(eKey);
            map.set(eKey, { ...existing, ...a });
          }
        });
      }
    }
    return Array.from(map.values());
  } catch (e) {}
  return [...SEED_ACCOUNTS];
}

export function saveLocalAccountsVault(account: UserAccount): void {
  try {
    if (!account || !account.email) return;
    const current = getLocalAccountsVault();
    const normalizedEmail = account.email.trim().toLowerCase();
    const idx = current.findIndex(a => (a.email || "").trim().toLowerCase() === normalizedEmail);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...account };
    } else {
      current.push(account);
    }
    localStorage.setItem(VAULT_KEY, JSON.stringify(current));
  } catch (e) {}
}

export interface MasterDbStore {
  accounts: UserAccount[];
  syncedData: Record<string, any>;
}

// Compact payload so it never exceeds 10KB JsonBlob limit
export function compactStoreForCloud(store: MasterDbStore): MasterDbStore {
  const normalized = normalizeDbStore(store);
  if (normalized.syncedData) {
    Object.keys(normalized.syncedData).forEach((k) => {
      const s = normalized.syncedData[k];
      if (s && Array.isArray(s.childrenProfiles)) {
        s.childrenProfiles.forEach((c: any) => {
          if (c?.solatProgress && Array.isArray(c.solatProgress.history)) {
            c.solatProgress.history = c.solatProgress.history.slice(-15);
          }
          if (c?.quranIqraProgress && Array.isArray(c.quranIqraProgress.history)) {
            c.quranIqraProgress.history = c.quranIqraProgress.history.slice(-15);
          }
        });
      }
    });
  }
  return normalized;
}

// Helper to normalize store and recover user accounts embedded in syncedData
export function normalizeDbStore(data: any): MasterDbStore {
  const accounts: UserAccount[] = Array.isArray(data?.accounts) ? [...data.accounts] : [];
  const accountMap = new Map<string, UserAccount>();

  // Ensure default seed accounts are always present
  SEED_ACCOUNTS.forEach((seedAcc) => {
    accountMap.set(seedAcc.email.trim().toLowerCase(), { ...seedAcc });
  });

  accounts.forEach((a) => {
    if (a && a.email) {
      const eKey = a.email.trim().toLowerCase();
      const existing = accountMap.get(eKey);
      accountMap.set(eKey, { ...existing, ...a });
    }
  });

  const rawSynced = data?.syncedData || {};
  const syncedData: Record<string, any> = {};

  if (rawSynced) {
    Object.keys(rawSynced).forEach((emailKey) => {
      const normEmail = emailKey.trim().toLowerCase();
      const incoming = rawSynced[emailKey];
      syncedData[normEmail] = incoming;
      const u = incoming?.user;
      if (u && u.email) {
        const normU = u.email.trim().toLowerCase();
        if (!accountMap.has(normU)) {
          accountMap.set(normU, u);
        }
      }
    });
  }

  const seedSyncedData = buildSeedSyncedData();
  Object.keys(seedSyncedData).forEach((seedKey) => {
    const normSeed = seedKey.trim().toLowerCase();
    if (!syncedData[normSeed]) {
      syncedData[normSeed] = seedSyncedData[seedKey];
    }
  });

  return { accounts: Array.from(accountMap.values()), syncedData };
}

// Helper to deeply merge two child profiles (local and cloud) without losing progress
export function mergeChildProfileObjects(localP: any, cloudP: any): any {
  if (!localP) return cloudP;
  if (!cloudP) return localP;

  // Combine solat progress history
  let solatProgress = cloudP.solatProgress || localP.solatProgress;
  if (localP.solatProgress && cloudP.solatProgress) {
    const historyMap = new Map<string, any>();
    (localP.solatProgress.history || []).forEach((h: any) => { if (h?.id || h?.date) historyMap.set(h.id || h.date, h); });
    (cloudP.solatProgress.history || []).forEach((h: any) => { if (h?.id || h?.date) historyMap.set(h.id || h.date, h); });
    const mergedHistory = Array.from(historyMap.values()).sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""));
    solatProgress = {
      ...cloudP.solatProgress,
      ...localP.solatProgress,
      history: mergedHistory,
      totalFardhuCount: Math.max(localP.solatProgress.totalFardhuCount || 0, cloudP.solatProgress.totalFardhuCount || 0),
      totalSunatCount: Math.max(localP.solatProgress.totalSunatCount || 0, cloudP.solatProgress.totalSunatCount || 0),
      currentStreak: Math.max(localP.solatProgress.currentStreak || 0, cloudP.solatProgress.currentStreak || 0)
    };
  }

  // Combine Quran / Iqra progress history
  let quranIqraProgress = cloudP.quranIqraProgress || localP.quranIqraProgress;
  if (localP.quranIqraProgress && cloudP.quranIqraProgress) {
    const qHistoryMap = new Map<string, any>();
    (localP.quranIqraProgress.history || []).forEach((h: any) => { if (h?.id) qHistoryMap.set(h.id, h); });
    (cloudP.quranIqraProgress.history || []).forEach((h: any) => { if (h?.id) qHistoryMap.set(h.id, h); });
    const mergedQHistory = Array.from(qHistoryMap.values());
    const cloudLastUpdated = new Date(cloudP.quranIqraProgress.lastUpdated || 0).getTime();
    const localLastUpdated = new Date(localP.quranIqraProgress.lastUpdated || 0).getTime();
    const latestProgressObj = cloudLastUpdated >= localLastUpdated ? cloudP.quranIqraProgress : localP.quranIqraProgress;
    quranIqraProgress = {
      ...latestProgressObj,
      history: mergedQHistory
    };
  }

  // Combine Jawi Progress
  let jawiProgress = cloudP.jawiProgress || localP.jawiProgress;
  if (localP.jawiProgress && cloudP.jawiProgress) {
    jawiProgress = {
      ...cloudP.jawiProgress,
      unlockedLevel: Math.max(localP.jawiProgress.unlockedLevel || 1, cloudP.jawiProgress.unlockedLevel || 1),
      completedLevels: Array.from(new Set([...(localP.jawiProgress.completedLevels || []), ...(cloudP.jawiProgress.completedLevels || [])]))
    };
  }

  // Combine Hafazan Progress
  let hafazanProgress = cloudP.hafazanProgress || localP.hafazanProgress;
  if (localP.hafazanProgress && cloudP.hafazanProgress) {
    hafazanProgress = {
      ...cloudP.hafazanProgress,
      completedSurahIds: Array.from(new Set([...(localP.hafazanProgress.completedSurahIds || []), ...(cloudP.hafazanProgress.completedSurahIds || [])]))
    };
  }

  // Pet stats merge (take higher level/xp)
  let pet = cloudP.pet || localP.pet;
  if (localP.pet && cloudP.pet) {
    pet = {
      ...localP.pet,
      ...cloudP.pet,
      level: Math.max(localP.pet.level || 1, cloudP.pet.level || 1),
      xp: Math.max(localP.pet.xp || 0, cloudP.pet.xp || 0),
      evolutionStage: Math.max(localP.pet.evolutionStage || 1, cloudP.pet.evolutionStage || 1) as 1 | 2 | 3
    };
  }

  return {
    ...localP,
    ...cloudP, // Cloud data overrides stale local base
    level: Math.max(localP.level || 1, cloudP.level || 1),
    xp: Math.max(localP.xp || 0, cloudP.xp || 0),
    coins: Math.max(localP.coins || 0, cloudP.coins || 0),
    diamonds: Math.max(localP.diamonds || 0, cloudP.diamonds || 0),
    streak: Math.max(localP.streak || 0, cloudP.streak || 0),
    unlockedWorlds: Array.from(new Set([...(localP.unlockedWorlds || []), ...(cloudP.unlockedWorlds || [])])),
    builtStructures: cloudP.builtStructures?.length ? cloudP.builtStructures : (localP.builtStructures || []),
    inventory: Array.from(new Set([...(localP.inventory || []), ...(cloudP.inventory || [])])),
    solatProgress,
    quranIqraProgress,
    jawiProgress,
    hafazanProgress,
    pet
  };
}

// Fetch directly from Master Cloud Blob and Supabase with Mobile Cache-Busting
async function fetchMasterCloudStore(): Promise<MasterDbStore> {
  let store: MasterDbStore = normalizeDbStore({ accounts: SEED_ACCOUNTS, syncedData: buildSeedSyncedData() });

  // 1. Fetch from JsonBlob / Master Cloud with cache-busting
  try {
    const cacheBustingUrl = activeMasterUrl.includes("?")
      ? `${activeMasterUrl}&_t=${Date.now()}`
      : `${activeMasterUrl}?_t=${Date.now()}`;
    const res = await fetch(cacheBustingUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
      },
      cache: "no-store"
    });
    if (res.ok) {
      const data = await res.json();
      store = normalizeDbStore(data);
    }
  } catch (err) {
    console.warn("Master cloud store GET error:", err);
  }

  // 2. Merge with Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supaAccounts = await fetchAccountsFromSupabase();
      if (supaAccounts && supaAccounts.length > 0) {
        supaAccounts.forEach((sa) => {
          const normE = (sa.email || "").trim().toLowerCase();
          if (normE) {
            const idx = store.accounts.findIndex((a) => (a.email || "").trim().toLowerCase() === normE);
            if (idx === -1) {
              store.accounts.push(sa);
            } else {
              store.accounts[idx] = { ...store.accounts[idx], ...sa };
            }
          }
        });
      }
    } catch (e) {
      console.warn("Supabase merge into master store error:", e);
    }
  }

  return store;
}

// Save updated data to Master Cloud Blob and Supabase
async function saveMasterCloudStore(store: MasterDbStore): Promise<boolean> {
  let jsonBlobSuccess = false;

  // 1. Save to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      if (Array.isArray(store.accounts)) {
        for (const acc of store.accounts) {
          if (acc && acc.email) {
            await saveAccountToSupabase(acc);
          }
        }
      }
      if (store.syncedData) {
        for (const eKey of Object.keys(store.syncedData)) {
          const payload = store.syncedData[eKey];
          if (payload) {
            await saveSyncedDataToSupabase(eKey, payload);
          }
        }
      }
    } catch (err) {
      console.warn("Supabase store save warning:", err);
    }
  }

  // 2. Backup save to JsonBlob
  try {
    const compact = compactStoreForCloud(store);
    const bodyStr = JSON.stringify(compact);

    const res = await fetch(activeMasterUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: bodyStr
    });

    if (res.ok) jsonBlobSuccess = true;

    // Auto-recreate blob if 404 or 413
    if (!jsonBlobSuccess && (res.status === 404 || res.status === 413 || !res.ok)) {
      console.warn(`JsonBlob PUT failed (${res.status}). Auto-recreating master blob...`);
      const createRes = await fetch("https://jsonblob.com/api/jsonBlob", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: bodyStr
      });
      if (createRes.ok) {
        const newLocation = createRes.headers.get("location");
        if (newLocation) {
          activeMasterUrl = newLocation.startsWith("http")
            ? newLocation
            : `https://jsonblob.com${newLocation}`;
          console.log("Master cloud store recreated at:", activeMasterUrl);
          jsonBlobSuccess = true;
        }
      }
    }
  } catch (err) {
    console.warn("Master cloud store PUT error:", err);
  }

  return isSupabaseConfigured() ? true : jsonBlobSuccess;
}

// Helper to check if response is real JSON
function isJsonResponse(res: Response): boolean {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json");
}

// 1. Get Accounts List
export async function fetchAccountsList(): Promise<UserAccount[]> {
  // 1. Primary: Firebase Firestore (real-time cloud database)
  try {
    const firestoreAccounts = await fetchAccountsFromFirestore();
    if (firestoreAccounts && firestoreAccounts.length > 0) {
      firestoreAccounts.forEach((acc) => saveLocalAccountsVault(acc));
      return firestoreAccounts;
    }
  } catch (e) {
    console.warn("Firestore fetchAccountsList error:", e);
  }

  // 2. Server API fallback
  try {
    const res = await fetch("/api/auth/accounts");
    if (res.ok && isJsonResponse(res)) {
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) {
        return data.accounts;
      }
    }
  } catch (e) {
    // API failed, fallback to Master Cloud Store
  }

  const cloud = await fetchMasterCloudStore();
  return cloud.accounts;
}

// 2. Register Account
export async function registerAccountCloud(data: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  accessCode?: string;
  plan?: MembershipPlan;
  language?: string;
}): Promise<{ success: boolean; message: string; user?: UserAccount }> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const cleanPass = data.password ? data.password.trim() : "";
  const cleanPhone = data.phone ? data.phone.trim() : "";

  // Check access code
  if (!data.accessCode || data.accessCode.trim() !== "MudahKids2026") {
    return {
      success: false,
      message: data.language === "en"
        ? "Invalid Access Code! Please check your email for the correct code."
        : "Kod akses tidak sah! Sila semak emel anda untuk kod akses yang betul."
    };
  }

  // Check existing in Firestore
  try {
    const existingFirestore = await fetchAccountByEmailFromFirestore(normalizedEmail);
    if (existingFirestore) {
      return {
        success: false,
        message: data.language === "en"
          ? "This email is already registered. Please log in instead."
          : "Emel ini telah pun didaftarkan. Sila guna fungsi Log Masuk."
      };
    }
  } catch (e) {}

  const newUser: UserAccount = {
    id: `u-${Date.now()}`,
    name: data.name.trim(),
    email: normalizedEmail,
    phone: cleanPhone,
    role: "parent",
    plan: data.plan || "PREMIUM",
    accessCode: "MudahKids2026",
    password: cleanPass,
    createdAt: new Date().toISOString()
  };

  // 1. PRIMARY: Save directly to Firebase Firestore
  try {
    await saveAccountToFirestore(newUser);
    await saveFamilyDataToFirestore(normalizedEmail, {
      user: newUser,
      childrenProfiles: [],
      missions: [],
      lastSyncTimestamp: Date.now(),
      version: 2
    });
  } catch (err) {
    console.warn("Firebase registration save error:", err);
  }

  saveLocalAccountsVault(newUser);

  // 2. Background notify server if running
  try {
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name.trim(),
        email: normalizedEmail,
        phone: cleanPhone,
        password: cleanPass,
        plan: data.plan || "PREMIUM",
        accessCode: "MudahKids2026"
      })
    }).catch(() => {});
  } catch (e) {}

  return { success: true, message: "OK", user: newUser };
}

// 3. Login Account
export async function loginAccountCloud(
  emailInput: string,
  passwordInput: string,
  language: string
): Promise<{ success: boolean; message: string; user?: UserAccount; syncedData?: any }> {
  const normalizedInput = emailInput.trim().toLowerCase();
  const cleanPass = passwordInput ? passwordInput.trim() : "";
  const inputDigits = normalizedInput.replace(/\D/g, "");

  const localVault = getLocalAccountsVault();

  // Helper function to match an account flexibly with substring & fuzzy matching for mobile
  const matchAccount = (accList: UserAccount[]): UserAccount | undefined => {
    return accList.find((a) => {
      if (!a || !normalizedInput) return false;
      const target = normalizedInput.trim().toLowerCase();
      const aEmail = (a.email || "").trim().toLowerCase();
      const aEmailPrefix = aEmail.split("@")[0];
      const aPhone = (a.phone || "").trim().replace(/\D/g, "");
      const aName = (a.name || "").trim().toLowerCase();

      // 1. Exact matches
      if (aEmail === target) return true;
      if (aEmailPrefix && aEmailPrefix === target) return true;
      if (aName && aName === target) return true;

      // 2. Substring & prefix matches
      if (target.length >= 3) {
        if (aEmail.startsWith(target) || aEmailPrefix.startsWith(target) || target.startsWith(aEmailPrefix)) return true;
        if (aEmail.includes(target) || aEmailPrefix.includes(target)) return true;
        if (aName.includes(target) || target.includes(aName)) return true;
      }

      // 3. Phone matching
      if (inputDigits && inputDigits.length >= 4 && aPhone) {
        if (aPhone === inputDigits || aPhone.endsWith(inputDigits) || inputDigits.endsWith(aPhone) || aPhone.includes(inputDigits)) {
          return true;
        }
      }
      return false;
    });
  };

  // 1. PRIMARY: Check Firebase Firestore directly
  try {
    let firestoreUser = await fetchAccountByEmailFromFirestore(normalizedInput);
    if (!firestoreUser) {
      const allFirestoreAccounts = await fetchAccountsFromFirestore();
      firestoreUser = matchAccount(allFirestoreAccounts) || null;
    }

    if (firestoreUser) {
      const storedPass = (firestoreUser.password || "").trim();
      if (storedPass && storedPass !== cleanPass) {
        return {
          success: false,
          message: language === "en"
            ? "Incorrect password! Access denied."
            : "Kata laluan tidak tepat! Akses ditolak."
        };
      }

      saveLocalAccountsVault(firestoreUser);
      const firestoreSynced = await fetchFamilyDataFromFirestore(firestoreUser.email);
      return {
        success: true,
        message: "OK",
        user: firestoreUser,
        syncedData: firestoreSynced
      };
    }
  } catch (e) {
    console.warn("Firestore direct login attempt:", e);
  }

  // 2. Check local vault
  let user = matchAccount(localVault);

  // 3. Check Server API
  if (!user) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedInput, password: cleanPass, clientAccounts: localVault })
      });

      if (res.ok && isJsonResponse(res)) {
        const result = await res.json();
        if (result.success && result.user) {
          saveLocalAccountsVault(result.user);
          // Also persist into Firestore for other devices
          saveAccountToFirestore(result.user).catch(() => {});
          return {
            success: true,
            message: "OK",
            user: result.user,
            syncedData: result.syncedData
          };
        }
        if (result.message && (result.message.includes("Kata laluan tidak tepat") || result.message.includes("Incorrect password"))) {
          return { success: false, message: result.message };
        }
      }
    } catch (e) {}
  }

  // 4. Check Master Cloud Store
  if (!user) {
    const store = await fetchMasterCloudStore();
    user = matchAccount(store.accounts);

    if (!user && store.syncedData) {
      Object.keys(store.syncedData).forEach((key) => {
        const u = store.syncedData[key]?.user;
        if (u && matchAccount([u])) {
          user = u;
        }
      });
    }

    if (user) {
      saveAccountToFirestore(user).catch(() => {});
    }
  }

  if (!user) {
    return {
      success: false,
      message: language === "en"
        ? "Account not found. Please check your email or phone number, or register a new account."
        : "Emel atau nombor telefon tidak dijumpai dalam rekod pendaftaran sistem. Sila semak semula atau buat pendaftaran baharu."
    };
  }

  const storedPass = (user.password || "").trim();
  if (storedPass && storedPass !== cleanPass) {
    return {
      success: false,
      message: language === "en"
        ? "Incorrect password! Access denied."
        : "Kata laluan tidak tepat! Akses ditolak."
    };
  }

  saveLocalAccountsVault(user);
  saveAccountToFirestore(user).catch(() => {});

  const syncedData = await fetchFamilyDataFromFirestore(user.email);

  return {
    success: true,
    message: "OK",
    user,
    syncedData
  };
}

// 4. Reset Password
export async function resetPasswordCloud(
  emailInput: string,
  newPasswordInput: string,
  language: string
): Promise<{ success: boolean; message: string }> {
  const normalizedInput = emailInput.trim().toLowerCase();
  const cleanPass = newPasswordInput.trim();
  const inputDigits = normalizedInput.replace(/\D/g, "");

  // 1. Update in Firestore directly
  try {
    const firestoreAcc = await fetchAccountByEmailFromFirestore(normalizedInput);
    if (firestoreAcc) {
      firestoreAcc.password = cleanPass;
      await saveAccountToFirestore(firestoreAcc);
      saveLocalAccountsVault(firestoreAcc);
      return { success: true, message: "OK" };
    }
  } catch (e) {
    console.warn("Firestore resetPasswordCloud error:", e);
  }

  // 2. Server API fallback
  try {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedInput, newPassword: cleanPass })
    });

    if (res.ok && isJsonResponse(res)) {
      const result = await res.json();
      if (result.success) {
        const vault = getLocalAccountsVault();
        vault.forEach((a) => {
          const aEmail = (a.email || "").trim().toLowerCase();
          const aPhone = (a.phone || "").trim().replace(/\D/g, "");
          if (aEmail === normalizedInput || (inputDigits.length >= 6 && aPhone.endsWith(inputDigits))) {
            a.password = cleanPass;
            saveLocalAccountsVault(a);
            saveAccountToFirestore(a).catch(() => {});
          }
        });
        return { success: true, message: "OK" };
      }
    }
  } catch (e) {}

  // 3. Local vault fallback
  const vault = getLocalAccountsVault();
  const found = vault.find(a => (a.email || "").trim().toLowerCase() === normalizedInput);
  if (found) {
    found.password = cleanPass;
    saveLocalAccountsVault(found);
    saveAccountToFirestore(found).catch(() => {});
    return { success: true, message: "OK" };
  }

  return {
    success: false,
    message: language === "en"
      ? "Registered email address or phone number not found in system."
      : "Emel atau nombor telefon ini tidak dijumpai dalam rekod pendaftaran sistem."
  };
}

// 5. Save Synced User Data
export async function saveSyncedDataCloud(email: string, data: any): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;

  const nowIso = new Date().toISOString();
  const nowTs = Date.now();
  const stampedData = {
    ...data,
    lastSyncedAt: data.lastSyncedAt || nowIso,
    lastSyncTimestamp: data.lastSyncTimestamp || nowTs
  };

  // Stamp parentId on all children profiles
  if (stampedData && Array.isArray(stampedData.childrenProfiles)) {
    stampedData.childrenProfiles = stampedData.childrenProfiles.map((cp: any) => ({
      ...cp,
      parentId: cp.parentId || stampedData.user?.id || normalizedEmail
    }));
  }

  // Always save immediately to local browser vault per-user
  try {
    const vaultKey = `mudahkids_user_sync_${normalizedEmail}`;
    localStorage.setItem(vaultKey, JSON.stringify(stampedData));
  } catch (e) {}

  // 1. PRIMARY: Save directly to Google Cloud Firestore (Instant real-time multi-device cloud sync)
  try {
    await saveFamilyDataToFirestore(normalizedEmail, {
      user: stampedData.user,
      childrenProfiles: stampedData.childrenProfiles || [],
      missions: stampedData.missions || [],
      lastSyncTimestamp: nowTs,
      version: 2
    });
    if (stampedData.user) {
      await saveAccountToFirestore(stampedData.user);
    }
  } catch (err) {
    console.warn("[FirebaseSync] Error in saveSyncedDataCloud:", err);
  }

  // 2. Background notify local server endpoint if running
  try {
    fetch("/api/sync/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, data: stampedData })
    }).catch(() => {});
  } catch (err) {}
}

// 6. Get Synced User Data Across Devices
export async function fetchSyncedDataCloud(email: string): Promise<any> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  let localVaultData: any = null;
  try {
    const vaultKey = `mudahkids_user_sync_${normalizedEmail}`;
    const raw = localStorage.getItem(vaultKey);
    if (raw) localVaultData = JSON.parse(raw);
  } catch (e) {}

  let fetchedData: any = null;

  // 1. PRIMARY: Fetch directly from Google Cloud Firestore
  try {
    const firestoreData = await fetchFamilyDataFromFirestore(normalizedEmail);
    if (firestoreData) {
      fetchedData = {
        user: firestoreData.user,
        childrenProfiles: firestoreData.childrenProfiles || [],
        missions: firestoreData.missions || [],
        lastSyncedAt: new Date(firestoreData.lastSyncTimestamp || Date.now()).toISOString(),
        lastSyncTimestamp: firestoreData.lastSyncTimestamp || Date.now(),
        version: firestoreData.version || 2
      };
    }
  } catch (e) {
    console.warn("[FirebaseSync] fetchSyncedDataCloud Firestore error:", e);
  }

  // 2. Secondary: Try Local/Server API with Cache-Busting
  if (!fetchedData) {
    try {
      const res = await fetch(`/api/sync/get?email=${encodeURIComponent(normalizedEmail)}&_t=${Date.now()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        },
        cache: "no-store"
      });
      if (res.ok && isJsonResponse(res)) {
        const result = await res.json();
        if (result.success && result.data) {
          fetchedData = result.data;
        }
      }
    } catch (e) {}
  }

  let finalPayload: any = null;

  if (fetchedData && localVaultData) {
    const fetchedTime = fetchedData.lastSyncTimestamp || (fetchedData.lastSyncedAt ? new Date(fetchedData.lastSyncedAt).getTime() : 0);
    const localTime = localVaultData.lastSyncTimestamp || (localVaultData.lastSyncedAt ? new Date(localVaultData.lastSyncedAt).getTime() : 0);

    // If local mutation is newer than fetched data, preserve local mutations and push to Firestore
    if (localTime > fetchedTime && (localTime - fetchedTime) < 60000) {
      finalPayload = localVaultData;
      saveFamilyDataToFirestore(normalizedEmail, {
        user: localVaultData.user,
        childrenProfiles: localVaultData.childrenProfiles || [],
        missions: localVaultData.missions || [],
        lastSyncTimestamp: localTime,
        version: 2
      }).catch(() => {});
    } else {
      finalPayload = fetchedData;
      try {
        const vaultKey = `mudahkids_user_sync_${normalizedEmail}`;
        localStorage.setItem(vaultKey, JSON.stringify(fetchedData));
      } catch (e) {}
    }
  } else if (fetchedData) {
    finalPayload = fetchedData;
    try {
      const vaultKey = `mudahkids_user_sync_${normalizedEmail}`;
      localStorage.setItem(vaultKey, JSON.stringify(fetchedData));
    } catch (e) {}
  } else if (localVaultData) {
    finalPayload = localVaultData;
  }

  // Filter out any child profiles that belong to a different parentId/email
  if (finalPayload && Array.isArray(finalPayload.childrenProfiles)) {
    const activeUserId = finalPayload.user?.id;
    finalPayload.childrenProfiles = finalPayload.childrenProfiles.filter((p: any) => {
      if (!p) return false;
      if (p.parentId && p.parentId !== activeUserId && p.parentId !== finalPayload.user?.email && p.parentId !== normalizedEmail) {
        return false;
      }
      return true;
    });
  }

  return finalPayload;
}


