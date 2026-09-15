import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  Unsubscribe
} from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "./firebase";
import { UserAccount } from "../types";

export function emailToFamilyId(email: string): string {
  if (!email) return "default_family";
  const clean = email.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "_");
  return clean.slice(0, 120);
}

export function emailToAccountId(email: string): string {
  if (!email) return "acc_default";
  const clean = email.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "_");
  return `acc_${clean}`.slice(0, 120);
}

export interface FamilySyncPayload {
  user: UserAccount;
  childrenProfiles: any[];
  missions: any[];
  lastSyncTimestamp: number;
  version?: number;
}

/**
 * Save family sync data directly to Firestore.
 * This guarantees real-time broadcast to all other devices listening to this family document.
 */
export async function saveFamilyDataToFirestore(
  email: string,
  payload: FamilySyncPayload
): Promise<boolean> {
  if (!email || !payload) return false;
  const familyId = emailToFamilyId(email);
  const path = `families/${familyId}`;

  try {
    const docRef = doc(db, "families", familyId);
    const dataString = JSON.stringify({
      user: payload.user,
      childrenProfiles: payload.childrenProfiles || [],
      missions: payload.missions || [],
      lastSyncTimestamp: payload.lastSyncTimestamp || Date.now(),
      version: payload.version || 2
    });

    await setDoc(docRef, {
      familyId,
      email: email.trim().toLowerCase(),
      syncedData: dataString,
      lastSyncTimestamp: payload.lastSyncTimestamp || Date.now(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return true;
  } catch (error) {
    console.error(`[FirebaseSync] Failed to save family data for ${email}:`, error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (e) {
      // Don't crash app execution on network glitch
    }
    return false;
  }
}

/**
 * Fetch the latest family sync data from Firestore.
 */
export async function fetchFamilyDataFromFirestore(
  email: string
): Promise<FamilySyncPayload | null> {
  if (!email) return null;
  const familyId = emailToFamilyId(email);
  const path = `families/${familyId}`;

  try {
    const docRef = doc(db, "families", familyId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data && data.syncedData) {
        const parsed = JSON.parse(data.syncedData);
        return {
          user: parsed.user,
          childrenProfiles: parsed.childrenProfiles || [],
          missions: parsed.missions || [],
          lastSyncTimestamp: data.lastSyncTimestamp || parsed.lastSyncTimestamp || 0,
          version: parsed.version || 2
        };
      }
    }
    return null;
  } catch (error) {
    console.error(`[FirebaseSync] Failed to fetch family data for ${email}:`, error);
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (e) {
      // Return null gracefully if offline
    }
    return null;
  }
}

/**
 * Real-time listener for multi-device sync.
 * Whenever Device A updates data, Device B's onUpdate callback fires automatically!
 */
export function subscribeToFamilyData(
  email: string,
  onUpdate: (payload: FamilySyncPayload) => void
): Unsubscribe {
  if (!email) return () => {};
  const familyId = emailToFamilyId(email);
  const path = `families/${familyId}`;
  const docRef = doc(db, "families", familyId);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        try {
          const data = docSnap.data();
          if (data && data.syncedData) {
            const parsed = JSON.parse(data.syncedData);
            onUpdate({
              user: parsed.user,
              childrenProfiles: parsed.childrenProfiles || [],
              missions: parsed.missions || [],
              lastSyncTimestamp: data.lastSyncTimestamp || parsed.lastSyncTimestamp || 0,
              version: parsed.version || 2
            });
          }
        } catch (e) {
          console.warn("[FirebaseSync] Failed to parse realtime snapshot:", e);
        }
      }
    },
    (error) => {
      console.warn(`[FirebaseSync] Realtime subscription error for ${path}:`, error);
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e) {}
    }
  );

  return unsubscribe;
}

/**
 * Save user account registration to Firestore
 */
export async function saveAccountToFirestore(account: UserAccount): Promise<boolean> {
  if (!account || !account.email) return false;
  const accountId = emailToAccountId(account.email);
  const path = `accounts/${accountId}`;

  try {
    const docRef = doc(db, "accounts", accountId);
    await setDoc(docRef, {
      id: account.id || accountId,
      name: account.name || "",
      email: account.email.trim().toLowerCase(),
      phone: account.phone || "",
      role: account.role || "parent",
      plan: account.plan || "PREMIUM",
      accessCode: account.accessCode || "",
      password: account.password || "",
      createdAt: account.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return true;
  } catch (error) {
    console.error(`[FirebaseSync] Failed to save account ${account.email}:`, error);
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (e) {}
    return false;
  }
}

/**
 * Fetch all registered accounts from Firestore
 */
export async function fetchAccountsFromFirestore(): Promise<UserAccount[]> {
  const path = "accounts";
  try {
    const querySnapshot = await getDocs(collection(db, "accounts"));
    const accounts: UserAccount[] = [];
    querySnapshot.forEach((d) => {
      const a = d.data();
      if (a && a.email) {
        accounts.push({
          id: a.id || d.id,
          name: a.name || "",
          email: a.email,
          phone: a.phone || "",
          role: a.role || "parent",
          plan: a.plan || "PREMIUM",
          accessCode: a.accessCode || "",
          password: a.password || "",
          createdAt: a.createdAt || ""
        });
      }
    });
    return accounts;
  } catch (error) {
    console.error("[FirebaseSync] Failed to fetch accounts:", error);
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch (e) {}
    return [];
  }
}

/**
 * Fetch single user account by email from Firestore
 */
export async function fetchAccountByEmailFromFirestore(
  email: string
): Promise<UserAccount | null> {
  if (!email) return null;
  const accountId = emailToAccountId(email);
  const path = `accounts/${accountId}`;

  try {
    const docRef = doc(db, "accounts", accountId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const a = snap.data();
      if (a && a.email) {
        return {
          id: a.id || snap.id,
          name: a.name || "",
          email: a.email,
          phone: a.phone || "",
          role: a.role || "parent",
          plan: a.plan || "PREMIUM",
          accessCode: a.accessCode || "",
          password: a.password || "",
          createdAt: a.createdAt || ""
        };
      }
    }
    return null;
  } catch (error) {
    console.error(`[FirebaseSync] Failed to fetch account for ${email}:`, error);
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (e) {}
    return null;
  }
}
