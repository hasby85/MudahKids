import { getSupabase, isSupabaseConfigured } from "./supabase";
import { UserAccount } from "../types";

export interface SupabaseSyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 1. Fetch all accounts from Supabase
export async function fetchAccountsFromSupabase(): Promise<UserAccount[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    // Try structured 'users' table
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((u: any) => ({
        id: u.id || `u-${Date.now()}`,
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        role: u.role || 'parent',
        plan: u.membership_plan || u.plan || 'PREMIUM',
        accessCode: u.access_code || u.accessCode || 'MudahKids2026',
        password: u.password || '',
        createdAt: u.created_at || new Date().toISOString()
      }));
    }

    // Fallback: Check key-value store table 'mudahkids_store' if 'users' table empty/unstructured
    const { data: storeData } = await supabase
      .from('mudahkids_store')
      .select('data')
      .eq('id', 'master_store')
      .single();

    if (storeData && storeData.data && Array.isArray(storeData.data.accounts)) {
      return storeData.data.accounts;
    }
  } catch (err) {
    console.warn("Supabase fetch accounts error:", err);
  }

  return [];
}

// 2. Save or update an account in Supabase
export async function saveAccountToSupabase(account: UserAccount): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    // Upsert into structured 'users' table
    const { error } = await supabase
      .from('users')
      .upsert(
        {
          email: account.email.trim().toLowerCase(),
          name: account.name.trim(),
          phone: account.phone ? account.phone.trim() : null,
          role: account.role || 'parent',
          membership_plan: account.plan || 'PREMIUM',
          access_code: account.accessCode || 'MudahKids2026',
          password: account.password || null,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'email' }
      );

    if (!error) {
      console.log("✅ Successfully saved account to Supabase 'users' table:", account.email);
      return true;
    } else {
      console.warn("Supabase 'users' table upsert note:", error.message);
    }

    // Backup: Also save to 'mudahkids_store' table
    const { data: storeData } = await supabase
      .from('mudahkids_store')
      .select('data')
      .eq('id', 'master_store')
      .single();

    let currentStore = storeData?.data || { accounts: [], syncedData: {} };
    if (!Array.isArray(currentStore.accounts)) currentStore.accounts = [];

    const normEmail = account.email.trim().toLowerCase();
    const existingIdx = currentStore.accounts.findIndex((a: any) => (a.email || "").trim().toLowerCase() === normEmail);
    if (existingIdx !== -1) {
      currentStore.accounts[existingIdx] = { ...currentStore.accounts[existingIdx], ...account };
    } else {
      currentStore.accounts.push(account);
    }

    await supabase
      .from('mudahkids_store')
      .upsert({ id: 'master_store', data: currentStore, updated_at: new Date().toISOString() });

    return true;
  } catch (err) {
    console.warn("Failed saving account to Supabase:", err);
    return false;
  }
}

// 3. Save User Synced Data in Supabase
export async function saveSyncedDataToSupabase(email: string, data: any): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const normEmail = email.trim().toLowerCase();

  try {
    // Save to 'synced_data' table if present
    const { error } = await supabase
      .from('synced_data')
      .upsert(
        {
          email: normEmail,
          payload: data,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'email' }
      );

    if (!error) {
      console.log("✅ Successfully saved synced data to Supabase for:", normEmail);
      return true;
    }

    // Backup: Save to 'mudahkids_store' table
    const { data: storeData } = await supabase
      .from('mudahkids_store')
      .select('data')
      .eq('id', 'master_store')
      .single();

    let currentStore = storeData?.data || { accounts: [], syncedData: {} };
    if (!currentStore.syncedData) currentStore.syncedData = {};

    currentStore.syncedData[normEmail] = {
      ...data,
      lastSyncedAt: new Date().toISOString()
    };

    if (data.user) {
      if (!Array.isArray(currentStore.accounts)) currentStore.accounts = [];
      const existingIdx = currentStore.accounts.findIndex((a: any) => (a.email || "").trim().toLowerCase() === normEmail);
      if (existingIdx === -1) {
        currentStore.accounts.push(data.user);
      } else {
        currentStore.accounts[existingIdx] = { ...currentStore.accounts[existingIdx], ...data.user };
      }
    }

    await supabase
      .from('mudahkids_store')
      .upsert({ id: 'master_store', data: currentStore, updated_at: new Date().toISOString() });

    return true;
  } catch (err) {
    console.warn("Failed saving synced data to Supabase:", err);
    return false;
  }
}

// 4. Fetch User Synced Data from Supabase
export async function fetchSyncedDataFromSupabase(email: string): Promise<any> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const normEmail = email.trim().toLowerCase();

  try {
    // Try 'synced_data' table
    const { data, error } = await supabase
      .from('synced_data')
      .select('payload')
      .eq('email', normEmail)
      .single();

    if (!error && data && data.payload) {
      return data.payload;
    }

    // Try 'mudahkids_store' table
    const { data: storeData } = await supabase
      .from('mudahkids_store')
      .select('data')
      .eq('id', 'master_store')
      .single();

    if (storeData?.data?.syncedData?.[normEmail]) {
      return storeData.data.syncedData[normEmail];
    }
  } catch (err) {
    console.warn("Failed fetching synced data from Supabase:", err);
  }

  return null;
}
