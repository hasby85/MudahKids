import { UserAccount, MembershipPlan } from "../types";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  fetchAccountsFromSupabase,
  saveAccountToSupabase,
  saveSyncedDataToSupabase,
  fetchSyncedDataFromSupabase
} from "../lib/supabaseSync";

const MASTER_CLOUD_STORE_URL = "https://jsonblob.com/api/jsonBlob/019ff11c-dfc0-7f84-80c6-4b38b28bc3a7";
let activeMasterUrl = MASTER_CLOUD_STORE_URL;

const VAULT_KEY = "mudahkids_registered_accounts_v2";

export function getLocalAccountsVault(): UserAccount[] {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
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
  if (!data) return { accounts: [], syncedData: {} };

  const accounts: UserAccount[] = Array.isArray(data.accounts) ? [...data.accounts] : [];
  const syncedData: Record<string, any> = data.syncedData || {};

  if (syncedData) {
    Object.keys(syncedData).forEach((emailKey) => {
      const u = syncedData[emailKey]?.user;
      if (u && u.email) {
        const normEmail = u.email.trim().toLowerCase();
        const existingIdx = accounts.findIndex((a) => a.email && a.email.trim().toLowerCase() === normEmail);
        if (existingIdx === -1) {
          accounts.push(u);
        } else {
          if (u.password) accounts[existingIdx].password = u.password;
          if (u.name) accounts[existingIdx].name = u.name;
          if (u.phone) accounts[existingIdx].phone = u.phone;
        }
      }
    });
  }

  return { accounts, syncedData };
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
  let store: MasterDbStore = { accounts: [], syncedData: {} };

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

  // Try Local/Server API first
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name.trim(),
        email: normalizedEmail,
        phone: cleanPhone,
        password: cleanPass,
        plan: data.plan || "PREMIUM",
        accessCode: data.accessCode ? data.accessCode.trim() : "MudahKids2026"
      })
    });

    if (res.ok && isJsonResponse(res)) {
      const result = await res.json();
      if (result.success && result.user) {
        saveLocalAccountsVault(result.user);
        return { success: true, message: "OK", user: result.user };
      } else {
        return { success: false, message: result.message || "Pendaftaran gagal" };
      }
    }
  } catch (e) {
    // Fallthrough to master cloud store
  }

  // Master Cloud Store Registration Fallback
  if (!data.accessCode || data.accessCode.trim() !== "MudahKids2026") {
    return {
      success: false,
      message: data.language === "en"
        ? "Invalid Access Code! Check your email for 'MudahKids2026'."
        : "Kod akses tidak sah! Sila semak emel anda untuk kod akses 'MudahKids2026'."
    };
  }

  const store = await fetchMasterCloudStore();
  const inputDigits = cleanPhone.replace(/\D/g, "");
  const existing = store.accounts.find(a => {
    if (!a) return false;
    const aEmail = (a.email || "").trim().toLowerCase();
    const aPhone = (a.phone || "").trim().replace(/\D/g, "");
    return (aEmail === normalizedEmail) || (inputDigits.length >= 6 && aPhone.endsWith(inputDigits));
  });

  if (existing) {
    return {
      success: false,
      message: data.language === "en"
        ? "This email or phone number is already registered. Please log in instead."
        : "Emel atau nombor telefon ini telah pun didaftarkan. Sila guna fungsi Log Masuk."
    };
  }

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

  store.accounts.push(newUser);
  store.syncedData[normalizedEmail] = { user: newUser, lastSyncedAt: new Date().toISOString() };
  await saveMasterCloudStore(store);

  saveLocalAccountsVault(newUser);

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

  // Try Local/Server API first (passing localVault in body for auto-rehydration)
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
  } catch (e) {
    // API failed, fallthrough
  }

  // Helper function to match an account by email or phone digits
  const matchAccount = (accList: UserAccount[]): UserAccount | undefined => {
    return accList.find((a) => {
      if (!a) return false;
      const aEmail = (a.email || "").trim().toLowerCase();
      const aPhone = (a.phone || "").trim().replace(/\D/g, "");
      return (
        aEmail === normalizedInput ||
        (inputDigits.length >= 6 && aPhone.endsWith(inputDigits))
      );
    });
  };

  // Search in Local Accounts Vault first
  let user = matchAccount(localVault);

  // Search in Master Cloud Store if not in local vault
  if (!user) {
    const store = await fetchMasterCloudStore();
    user = matchAccount(store.accounts);

    if (!user && store.syncedData) {
      Object.keys(store.syncedData).forEach((key) => {
        const u = store.syncedData[key]?.user;
        if (u) {
          const uEmail = (u.email || "").trim().toLowerCase();
          const uPhone = (u.phone || "").trim().replace(/\D/g, "");
          if (uEmail === normalizedInput || (inputDigits.length >= 6 && uPhone.endsWith(inputDigits))) {
            user = u;
          }
        }
      });
    }

    if (user) {
      // Re-hydrate Master Cloud Store to ensure consistency
      const userEmailKey = (user.email || "").trim().toLowerCase();
      if (!store.accounts.some(a => (a.email || "").trim().toLowerCase() === userEmailKey)) {
        store.accounts.push(user);
        await saveMasterCloudStore(store);
      }
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

  const store = await fetchMasterCloudStore();
  const userEmailKey = (user.email || "").trim().toLowerCase();
  const syncedData = store.syncedData[userEmailKey] || null;

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
          }
        });

        const store = await fetchMasterCloudStore();
        const idx = store.accounts.findIndex(a => {
          const aEmail = (a.email || "").trim().toLowerCase();
          const aPhone = (a.phone || "").trim().replace(/\D/g, "");
          return aEmail === normalizedInput || (inputDigits.length >= 6 && aPhone.endsWith(inputDigits));
        });
        if (idx !== -1) {
          store.accounts[idx].password = cleanPass;
          const eKey = (store.accounts[idx].email || "").trim().toLowerCase();
          if (store.syncedData[eKey]?.user) {
            store.syncedData[eKey].user.password = cleanPass;
          }
          await saveMasterCloudStore(store);
        }
        return { success: true, message: "OK" };
      }
    }
  } catch (e) {}

  // Master Cloud Store Reset Password Fallback
  const store = await fetchMasterCloudStore();
  const idx = store.accounts.findIndex(a => {
    const aEmail = (a.email || "").trim().toLowerCase();
    const aPhone = (a.phone || "").trim().replace(/\D/g, "");
    return aEmail === normalizedInput || (inputDigits.length >= 6 && aPhone.endsWith(inputDigits));
  });

  if (idx === -1) {
    return {
      success: false,
      message: language === "en"
        ? "Registered email address or phone number not found in system."
        : "Emel atau nombor telefon ini tidak dijumpai dalam rekod pendaftaran sistem."
    };
  }

  store.accounts[idx].password = cleanPass;
  const eKey = (store.accounts[idx].email || "").trim().toLowerCase();
  if (store.syncedData[eKey]?.user) {
    store.syncedData[eKey].user.password = cleanPass;
  }
  await saveMasterCloudStore(store);

  return { success: true, message: "OK" };
}

// 5. Save Synced User Data
export async function saveSyncedDataCloud(email: string, data: any): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;

  // Stamp parentId on all children profiles
  if (data && Array.isArray(data.childrenProfiles)) {
    data.childrenProfiles = data.childrenProfiles.map((cp: any) => ({
      ...cp,
      parentId: cp.parentId || data.user?.id || normalizedEmail
    }));
  }

  // Always save immediately to local browser vault per-user
  try {
    const vaultKey = `mudahkids_user_sync_${normalizedEmail}`;
    localStorage.setItem(vaultKey, JSON.stringify(data));
  } catch (e) {}

  // Safety Guard: Prevent overwriting existing cloud data with an empty childrenProfiles array if user has existing profiles
  if (data && Array.isArray(data.childrenProfiles) && data.childrenProfiles.length === 0) {
    try {
      const existing = await fetchSyncedDataCloud(normalizedEmail);
      if (existing && Array.isArray(existing.childrenProfiles) && existing.childrenProfiles.length > 0) {
        const belongsToUser = existing.childrenProfiles.some((p: any) => p.parentId === data.user?.id || p.parentId === normalizedEmail);
        if (belongsToUser) {
          console.warn("🛡️ Safety Guard: Prevented overwriting existing non-empty children profiles with empty payload!");
          return;
        }
      }
    } catch (e) {}
  }

  // 1. Send to Supabase directly if configured
  if (isSupabaseConfigured()) {
    try {
      await saveSyncedDataToSupabase(normalizedEmail, data);
    } catch (e) {
      console.warn("Direct Supabase sync save error:", e);
    }
  }

  // 2. Send to Local Express endpoint
  fetch("/api/sync/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: normalizedEmail, data })
  }).catch(() => {});

  // 3. Send to Master Cloud Store
  try {
    const store = await fetchMasterCloudStore();
    store.syncedData[normalizedEmail] = {
      ...data,
      lastSyncedAt: new Date().toISOString()
    };
    if (data.user) {
      const existingIdx = store.accounts.findIndex(a => a.email && a.email.trim().toLowerCase() === normalizedEmail);
      if (existingIdx === -1) {
        store.accounts.push(data.user);
      } else {
        store.accounts[existingIdx] = { ...store.accounts[existingIdx], ...data.user };
      }
    }
    await saveMasterCloudStore(store);
  } catch (e) {
    console.warn("Failed saving user sync data to master cloud store:", e);
  }
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

  // 1. Try direct Supabase lookup if configured
  if (isSupabaseConfigured()) {
    try {
      const supaData = await fetchSyncedDataFromSupabase(normalizedEmail);
      if (supaData) fetchedData = supaData;
    } catch (e) {
      console.warn("Direct Supabase fetch synced data error:", e);
    }
  }

  // 2. Try Local/Server API with Cache-Busting
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
    } catch (e) {
      // Fallthrough to master cloud store
    }
  }

  // 3. Master Cloud Store Direct Lookup Fallback
  if (!fetchedData) {
    try {
      const store = await fetchMasterCloudStore();
      fetchedData = store.syncedData[normalizedEmail] || null;
    } catch (e) {}
  }

  let finalPayload = fetchedData || localVaultData || null;

  if (finalPayload) {
    // If we have both localVaultData and fetchedData, merge profiles strictly for this user, prioritizing fresh fetchedData
    if (localVaultData && fetchedData && Array.isArray(localVaultData.childrenProfiles) && Array.isArray(fetchedData.childrenProfiles)) {
      const profileMap = new Map<string, any>();
      // 1. Baseline from local vault
      localVaultData.childrenProfiles.forEach((p: any) => { if (p?.id) profileMap.set(p.id, p); });
      // 2. Deep merge fresh server fetchedData on top
      fetchedData.childrenProfiles.forEach((p: any) => {
        if (p?.id) {
          const existingLocal = profileMap.get(p.id);
          profileMap.set(p.id, existingLocal ? mergeChildProfileObjects(existingLocal, p) : p);
        }
      });
      finalPayload = {
        ...localVaultData,
        ...fetchedData, // Fresh server data takes precedence over stale local vault
        childrenProfiles: Array.from(profileMap.values())
      };
    }

    // Filter out any child profiles that belong to a different parentId/email
    if (Array.isArray(finalPayload.childrenProfiles)) {
      const activeUserId = finalPayload.user?.id;
      finalPayload.childrenProfiles = finalPayload.childrenProfiles.filter((p: any) => {
        if (!p) return false;
        if (p.parentId && p.parentId !== activeUserId && p.parentId !== finalPayload.user?.email && p.parentId !== normalizedEmail) {
          return false;
        }
        return true;
      });
    }
  }

  return finalPayload;
}


