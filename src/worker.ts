export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const MASTER_CLOUD_STORE_URL = "https://jsonblob.com/api/jsonBlob/019ff11c-dfc0-7f84-80c6-4b38b28bc3a7";
let activeMasterUrl = MASTER_CLOUD_STORE_URL;

function compactStoreForCloud(store: any) {
  const normalized = normalizeStore(store);
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

function normalizeStore(data: any) {
  if (!data) return { accounts: [], syncedData: {} };
  const accounts: any[] = Array.isArray(data.accounts) ? [...data.accounts] : [];
  const syncedData: Record<string, any> = data.syncedData || {};

  if (syncedData) {
    Object.keys(syncedData).forEach((emailKey) => {
      const u = syncedData[emailKey]?.user;
      if (u && u.email) {
        const normEmail = u.email.trim().toLowerCase();
        const existingIdx = accounts.findIndex((a: any) => a.email && a.email.trim().toLowerCase() === normEmail);
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

async function fetchMasterStore() {
  try {
    const res = await fetch(activeMasterUrl, {
      headers: { "Accept": "application/json" }
    });
    if (res.ok) {
      const data = await res.json();
      return normalizeStore(data);
    }
  } catch (e) {}
  return { accounts: [], syncedData: {} };
}

async function saveMasterStore(store: any) {
  try {
    const compact = compactStoreForCloud(store);
    const bodyStr = JSON.stringify(compact);
    const res = await fetch(activeMasterUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: bodyStr
    });

    if (!res.ok && (res.status === 404 || res.status === 413)) {
      const createRes = await fetch("https://jsonblob.com/api/jsonBlob", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: bodyStr
      });
      if (createRes.ok) {
        const newLoc = createRes.headers.get("location");
        if (newLoc) {
          activeMasterUrl = newLoc.startsWith("http") ? newLoc : `https://jsonblob.com${newLoc}`;
        }
      }
    }
  } catch (e) {}
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const headers = new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      });

      if (request.method === "OPTIONS") {
        return new Response(null, { headers, status: 204 });
      }

      if (url.pathname === "/api/auth/accounts") {
        const store = await fetchMasterStore();
        return new Response(JSON.stringify({ success: true, accounts: store.accounts }), { headers });
      }

      if (url.pathname === "/api/auth/register" && request.method === "POST") {
        try {
          const body = (await request.json()) as any;
          const { name, email, phone, password, plan, accessCode } = body;
          const normalizedEmail = (email || "").trim().toLowerCase();

          if (!accessCode || accessCode.trim() !== "MudahKids2026") {
            return new Response(
              JSON.stringify({ success: false, message: "Kod akses tidak sah! Sila semak emel untuk 'MudahKids2026'." }),
              { headers, status: 400 }
            );
          }

          const store = await fetchMasterStore();
          if (store.accounts.some((a: any) => a.email.trim().toLowerCase() === normalizedEmail)) {
            return new Response(
              JSON.stringify({ success: false, message: "Emel ini telah pun didaftarkan." }),
              { headers, status: 400 }
            );
          }

          const newUser = {
            id: `u-${Date.now()}`,
            name: (name || "").trim(),
            email: normalizedEmail,
            phone: (phone || "").trim(),
            role: "parent",
            plan: plan || "PREMIUM",
            accessCode: "MudahKids2026",
            password: password,
            createdAt: new Date().toISOString()
          };

          store.accounts.push(newUser);
          await saveMasterStore(store);

          return new Response(JSON.stringify({ success: true, user: newUser }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ success: false, message: e.message }), { headers, status: 500 });
        }
      }

      if (url.pathname === "/api/auth/login" && request.method === "POST") {
        try {
          const body = (await request.json()) as any;
          const { email, password } = body;
          const normalizedEmail = (email || "").trim().toLowerCase();

          const store = await fetchMasterStore();
          const user = store.accounts.find((a: any) => a.email.trim().toLowerCase() === normalizedEmail);

          if (!user) {
            return new Response(
              JSON.stringify({ success: false, message: "Emel tidak dijumpai dalam rekod pendaftaran sistem." }),
              { headers, status: 404 }
            );
          }

          if (user.password && user.password !== password) {
            return new Response(
              JSON.stringify({ success: false, message: "Kata laluan tidak tepat! Akses ditolak." }),
              { headers, status: 401 }
            );
          }

          const syncedData = store.syncedData[normalizedEmail] || null;
          return new Response(JSON.stringify({ success: true, user, syncedData }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ success: false, message: e.message }), { headers, status: 500 });
        }
      }

      if (url.pathname === "/api/auth/reset-password" && request.method === "POST") {
        try {
          const body = (await request.json()) as any;
          const { email, newPassword } = body;
          const normalizedEmail = (email || "").trim().toLowerCase();

          const store = await fetchMasterStore();
          const idx = store.accounts.findIndex((a: any) => a.email.trim().toLowerCase() === normalizedEmail);

          if (idx === -1) {
            return new Response(
              JSON.stringify({ success: false, message: "Emel tidak dijumpai dalam sistem." }),
              { headers, status: 404 }
            );
          }

          store.accounts[idx].password = newPassword;
          await saveMasterStore(store);

          return new Response(JSON.stringify({ success: true }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ success: false, message: e.message }), { headers, status: 500 });
        }
      }

      if (url.pathname === "/api/sync/save" && request.method === "POST") {
        try {
          const body = (await request.json()) as any;
          const { email, data } = body;
          if (email) {
            const normalizedEmail = email.trim().toLowerCase();
            const store = await fetchMasterStore();
            store.syncedData[normalizedEmail] = { ...data, lastSyncedAt: new Date().toISOString() };
            await saveMasterStore(store);
          }
          return new Response(JSON.stringify({ success: true }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ success: false, message: e.message }), { headers, status: 500 });
        }
      }

      if (url.pathname === "/api/sync/get") {
        try {
          let email = url.searchParams.get("email");
          if (!email && request.method === "POST") {
            const body = (await request.json().catch(() => ({}))) as any;
            email = body.email;
          }
          if (email) {
            const normalizedEmail = email.trim().toLowerCase();
            const store = await fetchMasterStore();
            const data = store.syncedData[normalizedEmail] || null;
            return new Response(JSON.stringify({ success: true, data }), { headers });
          }
          return new Response(JSON.stringify({ success: false, message: "Emel diperlukan" }), { headers, status: 400 });
        } catch (e: any) {
          return new Response(JSON.stringify({ success: false, message: e.message }), { headers, status: 500 });
        }
      }
    }

    // Pass through to static assets
    return env.ASSETS.fetch(request);
  }
};
