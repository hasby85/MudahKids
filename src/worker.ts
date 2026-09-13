import { SEED_ACCOUNTS, buildSeedSyncedData } from "./data/seedStore";

export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  MUDAHKIDS_KV?: any;
}

let inMemoryStore: any = normalizeStore({
  accounts: SEED_ACCOUNTS,
  syncedData: buildSeedSyncedData()
});

function normalizeStore(data: any) {
  const accounts: any[] = Array.isArray(data?.accounts) ? [...data.accounts] : [];
  const accountMap = new Map<string, any>();

  // Ensure default seed accounts are always present
  SEED_ACCOUNTS.forEach((seedAcc) => {
    accountMap.set(seedAcc.email.trim().toLowerCase(), { ...seedAcc });
  });

  accounts.forEach((a: any) => {
    if (a && a.email) {
      const normEmail = a.email.trim().toLowerCase();
      accountMap.set(normEmail, { ...a, email: normEmail });
    }
  });

  const seedSyncedData = buildSeedSyncedData();
  const rawSynced = data?.syncedData || {};
  const syncedData: Record<string, any> = { ...seedSyncedData, ...rawSynced };

  return { accounts: Array.from(accountMap.values()), syncedData };
}

async function fetchMasterStore(env?: Env) {
  if (env?.MUDAHKIDS_KV) {
    try {
      const kvVal = await env.MUDAHKIDS_KV.get("store_data", "json");
      if (kvVal) {
        inMemoryStore = normalizeStore(kvVal);
        return inMemoryStore;
      }
    } catch (e) {}
  }
  return inMemoryStore;
}

async function saveMasterStore(store: any, env?: Env) {
  inMemoryStore = normalizeStore(store);
  if (env?.MUDAHKIDS_KV) {
    try {
      await env.MUDAHKIDS_KV.put("store_data", JSON.stringify(inMemoryStore));
    } catch (e) {}
  }
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
        const store = await fetchMasterStore(env);
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

          const store = await fetchMasterStore(env);
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
          await saveMasterStore(store, env);

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

          const store = await fetchMasterStore(env);
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

          const store = await fetchMasterStore(env);
          const idx = store.accounts.findIndex((a: any) => a.email.trim().toLowerCase() === normalizedEmail);

          if (idx === -1) {
            return new Response(
              JSON.stringify({ success: false, message: "Emel tidak dijumpai dalam sistem." }),
              { headers, status: 404 }
            );
          }

          store.accounts[idx].password = newPassword;
          await saveMasterStore(store, env);

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
            const store = await fetchMasterStore(env);
            store.syncedData[normalizedEmail] = { ...data, lastSyncedAt: new Date().toISOString() };
            await saveMasterStore(store, env);
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
            const store = await fetchMasterStore(env);
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
