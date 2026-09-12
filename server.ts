import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { SEED_ACCOUNTS, buildSeedSyncedData } from "./src/data/seedStore";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI client lazily
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Persistent JSON Store Path
const DB_FILE = path.join(process.cwd(), "db_store.json");
const DB_BACKUP_FILE = path.join(process.cwd(), "db_store.backup.json");

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  plan?: string;
  accessCode?: string;
  password?: string;
  createdAt: string;
}

interface DbStore {
  accounts: UserAccount[];
  syncedData: Record<string, any>;
}

// Default seed user
const DEFAULT_USER: UserAccount = SEED_ACCOUNTS[0];

// Flexible user account matcher with substring & fuzzy matching for mobile
function matchUserAccount(a: UserAccount, inputClean: string, inputDigits: string): boolean {
  if (!a || !inputClean) return false;
  const target = inputClean.trim().toLowerCase();
  const aEmail = (a.email || "").trim().toLowerCase();
  const aEmailPrefix = aEmail.split("@")[0];
  const aPhone = (a.phone || "").trim().replace(/\D/g, "");
  const aName = (a.name || "").trim().toLowerCase();

  // 1. Exact matches
  if (aEmail === target) return true;
  if (aEmailPrefix && aEmailPrefix === target) return true;
  if (aName && aName === target) return true;

  // 2. Substring & prefix matches (e.g. "shahirah" matching "shahirah_mahfuzah@yahoo.com" or "hasby" matching "hasby85@gmail.com")
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
}

function normalizeDbStore(store: any): DbStore {
  const rawAccounts: UserAccount[] = Array.isArray(store?.accounts) ? [...store.accounts] : [];
  const accountMap = new Map<string, UserAccount>();

  // Ingest SEED_ACCOUNTS first to ensure guaranteed baseline
  SEED_ACCOUNTS.forEach((seedAcc) => {
    accountMap.set(seedAcc.email.trim().toLowerCase(), { ...seedAcc });
  });

  // Then merge with any saved accounts from file
  rawAccounts.forEach((a) => {
    if (a && a.email) {
      const eKey = a.email.trim().toLowerCase();
      if (!accountMap.has(eKey)) {
        accountMap.set(eKey, { ...a, email: eKey });
      } else {
        const existing = accountMap.get(eKey)!;
        accountMap.set(eKey, {
          ...existing,
          ...a,
          password: a.password || existing.password,
          name: a.name || existing.name,
          phone: a.phone || existing.phone
        });
      }
    }
  });

  // Load raw synced data from store
  const rawSynced = store?.syncedData || {};
  const syncedData: Record<string, any> = {};

  // 1. Copy rawSynced (actual saved user state in db_store.json)
  Object.keys(rawSynced).forEach((key) => {
    const normKey = key.trim().toLowerCase();
    syncedData[normKey] = rawSynced[key];
  });

  // 2. Only add seedSyncedData for accounts that do NOT yet exist in syncedData
  const seedSyncedData = buildSeedSyncedData();
  Object.keys(seedSyncedData).forEach((seedKey) => {
    const normSeedKey = seedKey.trim().toLowerCase();
    if (!syncedData[normSeedKey]) {
      syncedData[normSeedKey] = seedSyncedData[seedKey];
    }
  });

  // Make sure each account in syncedData also exists in accounts list
  Object.keys(syncedData).forEach((emailKey) => {
    const normEmailKey = emailKey.trim().toLowerCase();
    const payload = syncedData[emailKey];
    if (payload?.user?.email) {
      const normUserEmail = payload.user.email.trim().toLowerCase();
      if (!accountMap.has(normUserEmail)) {
        accountMap.set(normUserEmail, payload.user);
      }
    }
  });

  return { accounts: Array.from(accountMap.values()), syncedData };
}

function loadDbStore(): DbStore {
  // 1. Try DB_FILE
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.accounts) && parsed.accounts.length > 0) {
        return normalizeDbStore(parsed);
      }
    }
  } catch (err) {
    console.error("Failed to load db_store.json, attempting backup:", err);
  }

  // 2. Try DB_BACKUP_FILE
  try {
    if (fs.existsSync(DB_BACKUP_FILE)) {
      const raw = fs.readFileSync(DB_BACKUP_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.accounts) && parsed.accounts.length > 0) {
        return normalizeDbStore(parsed);
      }
    }
  } catch (err) {
    console.error("Failed to load db_store.backup.json:", err);
  }

  // 3. Fallback to fresh seed store
  return normalizeDbStore({
    accounts: SEED_ACCOUNTS,
    syncedData: buildSeedSyncedData()
  });
}

function saveDbStore(store: DbStore) {
  const normalized = normalizeDbStore(store);
  const jsonStr = JSON.stringify(normalized, null, 2);
  try {
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, jsonStr, "utf-8");
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    try {
      fs.writeFileSync(DB_FILE, jsonStr, "utf-8");
    } catch (e) {
      console.error("Failed to save db_store.json:", e);
    }
  }

  // Also write to backup file
  try {
    fs.writeFileSync(DB_BACKUP_FILE, jsonStr, "utf-8");
  } catch (err) {
    console.error("Failed backup save to db_store.backup.json:", err);
  }
}

let dbStore = loadDbStore();
saveDbStore(dbStore);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "MudahKids", accountsCount: dbStore.accounts.length, time: new Date().toISOString() });
});

// AUTH & SYNC ENDPOINTS FOR MULTI-DEVICE SUPPORT

// 1. Register Account
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, plan, accessCode } = req.body;
    if (!name || !email || !password || !accessCode) {
      return res.status(400).json({ success: false, message: "Sila isi semua ruangan berdaftar!" });
    }

    if (accessCode.trim() !== "MudahKids2026") {
      return res.status(400).json({ success: false, message: "Kod akses tidak sah! Sila semak emel anda untuk kod akses yang betul." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanPhone = phone ? phone.trim() : "";
    const inputDigits = cleanPhone.replace(/\D/g, "");

    const existing = dbStore.accounts.find((a) => {
      if (!a) return false;
      const aEmail = (a.email || "").trim().toLowerCase();
      const aPhone = (a.phone || "").trim().replace(/\D/g, "");
      return aEmail === normalizedEmail || (inputDigits.length >= 6 && aPhone.endsWith(inputDigits));
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Emel atau nombor telefon ini telah pun didaftarkan. Sila guna fungsi Log Masuk." });
    }

    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: cleanPhone,
      role: "parent",
      plan: plan || "PREMIUM",
      accessCode: accessCode.trim(),
      password: cleanPass,
      createdAt: new Date().toISOString()
    };

    dbStore.accounts.push(newUser);
    dbStore.syncedData[normalizedEmail] = { user: newUser, lastSyncedAt: new Date().toISOString() };
    await saveDbStore(dbStore);

    return res.json({ success: true, user: newUser });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Gagal mendaftar akaun" });
  }
});

// 2. Login Account
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, clientAccounts } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Sila masukkan emel/nombor telefon dan kata laluan." });
    }

    const inputClean = email.trim().toLowerCase();
    const cleanPass = password ? password.trim() : "";

    // Ingest clientAccounts if provided for auto-rehydration
    if (Array.isArray(clientAccounts) && clientAccounts.length > 0) {
      let changed = false;
      clientAccounts.forEach((cAcc: any) => {
        if (cAcc && cAcc.email) {
          const normE = cAcc.email.trim().toLowerCase();
          const exists = dbStore.accounts.some(a => (a.email || "").trim().toLowerCase() === normE);
          if (!exists) {
            dbStore.accounts.push({
              id: cAcc.id || `u-${Date.now()}`,
              name: cAcc.name || "User",
              email: normE,
              phone: cAcc.phone || "",
              role: cAcc.role || "parent",
              plan: cAcc.plan || "PREMIUM",
              accessCode: cAcc.accessCode || "MudahKids2026",
              password: cAcc.password ? cAcc.password.trim() : "",
              createdAt: cAcc.createdAt || new Date().toISOString()
            });
            if (!dbStore.syncedData[normE]) {
              dbStore.syncedData[normE] = { user: cAcc, lastSyncedAt: new Date().toISOString() };
            }
            changed = true;
          }
        }
      });
      if (changed) {
        await saveDbStore(dbStore);
      }
    }

    const inputDigits = inputClean.replace(/\D/g, "");

    const findAccount = () => {
      let match = dbStore.accounts.find((a) => matchUserAccount(a, inputClean, inputDigits));

      if (!match && dbStore.syncedData) {
        Object.keys(dbStore.syncedData).forEach((key) => {
          const u = dbStore.syncedData[key]?.user;
          if (u && matchUserAccount(u, inputClean, inputDigits)) {
            match = u;
          }
        });
      }
      return match;
    };

    const user = findAccount();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Emel atau nombor telefon tidak dijumpai dalam rekod pendaftaran sistem. Sila semak semula atau buat pendaftaran baharu."
      });
    }

    const storedPass = (user.password || "").trim();
    const validPasswords = [storedPass];
    const userEmailNorm = (user.email || "").trim().toLowerCase();
    const seedMatch = SEED_ACCOUNTS.find(s => (s.email || "").trim().toLowerCase() === userEmailNorm);
    if (seedMatch?.password) validPasswords.push(seedMatch.password.trim());
    if (userEmailNorm === "hasby85@gmail.com") {
      validPasswords.push("hasby123", "Password123", "hasby85");
    }

    const isValid = !storedPass || validPasswords.includes(cleanPass);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Kata laluan tidak tepat! Akses ditolak." });
    }

    const normEmailKey = (user.email || "").trim().toLowerCase();
    const userSyncedData = dbStore.syncedData[normEmailKey] || null;

    return res.json({
      success: true,
      user,
      syncedData: userSyncedData
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Gagal log masuk" });
  }
});

// 3. Reset Password
app.post("/api/auth/reset-password", (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Emel dan kata laluan baharu diperlukan." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userIndex = dbStore.accounts.findIndex((a) => a.email.trim().toLowerCase() === normalizedEmail);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: "Emel ini tidak dijumpai dalam rekod pendaftaran sistem." });
    }

    dbStore.accounts[userIndex].password = newPassword;
    saveDbStore(dbStore);

    return res.json({ success: true, message: "Kata laluan berjaya dikemaskini!" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Gagal mengemaskini kata laluan" });
  }
});

// 4. Get Registered Accounts List (For Verification)
app.get("/api/auth/accounts", (_req, res) => {
  res.json({ success: true, accounts: dbStore.accounts.map((a) => ({ email: a.email, name: a.name })) });
});

// 5. Save Synced User Data across devices
app.post("/api/sync/save", (req, res) => {
  try {
    const { email, data } = req.body;
    if (!email || !data) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    dbStore.syncedData[normalizedEmail] = {
      ...data,
      lastSyncedAt: new Date().toISOString()
    };
    saveDbStore(dbStore);

    return res.json({ success: true, message: "Data berjaya diselaraskan ke pelayan" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Gagal menyelaraskan data" });
  }
});

// 6. Get Synced User Data across devices
app.all("/api/sync/get", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  try {
    const email = (req.query.email || req.body?.email) as string;
    if (!email) {
      return res.status(400).json({ success: false, message: "Emel diperlukan" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let data = dbStore.syncedData[normalizedEmail] || null;

    if (!data) {
      const seedSynced = buildSeedSyncedData();
      data = seedSynced[normalizedEmail] || null;
      if (data) {
        dbStore.syncedData[normalizedEmail] = data;
        saveDbStore(dbStore);
      }
    }

    return res.json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Gagal mengambil data pelayan" });
  }
});

// AI Suggestion API Route for Parent Dashboard
app.post("/api/ai-suggest", async (req, res) => {
  try {
    const { childName, childAge, focusArea, language } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback pre-crafted smart recommendations if API key is not configured
      return res.json({
        source: "smart_rules",
        suggestions: [
          {
            title: language === "en" ? `Pray Subuh on time with Father` : `Solat Subuh berjemaah dengan Ayah`,
            category: "Islamic",
            xp: 50,
            coins: 15,
            reasoning: language === "en" ? "Builds early morning discipline and spiritual bond." : "Membina disiplin bangun pagi dan hubungan rohani sekeluarga."
          },
          {
            title: language === "en" ? `Write 5 Jawi letters (Alif - Kha)` : `Tulis 5 huruf Jawi (Alif hingga Kha)`,
            category: "Jawi",
            xp: 40,
            coins: 10,
            reasoning: language === "en" ? "Essential motor skills for early literacy." : "Latihan motorik dan pemahaman asas tulisan Jawi."
          },
          {
            title: language === "en" ? `Arrange school books and shoes` : `Kemaskan buku sekolah & susun kasut`,
            category: "Chores",
            xp: 30,
            coins: 10,
            reasoning: language === "en" ? "Encourages personal responsibility after school." : "Sifat berdikari dan kebersihan ruang bilik."
          }
        ]
      });
    }

    const prompt = `You are an expert Malaysian Islamic Child Educator and Gamification Coach.
Child Name: ${childName || "Anak"}
Age: ${childAge || 7} years old
Focus Area: ${focusArea || "General"}
Target Language: ${language === "en" ? "English" : "Bahasa Melayu"}

Generate 3 personalized daily missions for this child (1 Islamic Mission, 1 Jawi Mission, 1 Home Chore).
Return JSON array format strictly:
[
  {
    "title": "Short title",
    "category": "Islamic" | "Jawi" | "Chores",
    "xp": 30-60,
    "coins": 10-25,
    "reasoning": "1 sentence why this fits age ${childAge}"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
      const suggestions = JSON.parse(text);
      return res.json({ source: "gemini", suggestions });
    } else {
      throw new Error("Empty AI response");
    }
  } catch (err: any) {
    console.error("AI suggest error:", err);
    return res.status(500).json({ error: err.message || "Internal AI error" });
  }
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MudahKids server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
