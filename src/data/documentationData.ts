export const PRD_DOCUMENTATION = {
  title: "MudahKids - Product Requirement Document (PRD)",
  sections: [
    {
      heading: "1. Executive Summary & Vision",
      content: `MudahKids ialah platform web & aplikasi mudah alih bertaraf pengeluaran (production-grade) khusus untuk pasaran Malaysia. Ia menggabungkan Pengurusan Tugasan Rumah (Chore Management), Pendidikan Islamik, Pembelajaran Jawi, Gamifikasi Nusantara, serta Pembinaan Tabiat Bertanggungjawab dalam SATU ekosistem mesra keluarga.`
    },
    {
      heading: "2. Target Audience & Personas",
      content: `• Ibu Bapa (Parents): Umur 25-45 tahun di Malaysia & Nusantara, mahukan alat berkesan mendidik anak beribadah, rajin membantu dan belajar Jawi tanpa paksaan.
• Kanak-kanak (Children): Umur 4-12 tahun, tertarik dengan haiwan peliharaan maya, avatar pakaian tradisional Melayu/Muslim, dan dunia Nusantara yang boleh dibina dengan syiling.`
    },
    {
      heading: "3. Membership Model & Pricing Architecture",
      content: `• PERMULAAN (RM39 / Selamanya): 2 Profil Anak, 20 tugasan aktif, 5 misi Jawi/hari, 5 misi Islamik/hari, avatar & haiwan asas, laporan 7 hari.
• PREMIUM (RM59 / Selamanya - Paling Disyorkan): Sehingga 5 Profil Anak, tugasan & misi tanpa had, membuka semua permainan & dunia Nusantara, AI Cadangan Tugasan (Gemini 3.6 Flash), Analitik Ibu Bapa & Laporan Bulanan, Backup Awan.

* Penghantaran Akses: Kod akses laluan akan dihantar secara automatik melalui email yang didaftarkan selepas pendaftaran dan pembayaran selesai.`
    }
  ]
};

export const DATABASE_SCHEMA_DOCS = {
  title: "Supabase PostgreSQL Database Schema & Security",
  sqlScript: `-- SQL Migration Script for Supabase PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Accounts Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(20) CHECK (role IN ('parent', 'child', 'admin')),
  membership_plan VARCHAR(20) DEFAULT 'FREE',
  access_code VARCHAR(100) DEFAULT 'Rifqi@2026',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Child Profiles Table
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INT CHECK (age BETWEEN 3 AND 18),
  gender VARCHAR(10) CHECK (gender IN ('boy', 'girl')),
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  coins INT DEFAULT 100,
  diamonds INT DEFAULT 5,
  streak INT DEFAULT 1,
  avatar_data JSONB DEFAULT '{"clothing": "Baju Melayu", "headwear": "Songkok", "accessory": "None"}',
  pet_data JSONB DEFAULT '{"type": "cat", "name": "Comel", "level": 1, "hunger": 80, "happiness": 90, "sleep": 100}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Missions Table
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(20) CHECK (category IN ('Islamic', 'Jawi', 'Chores')),
  difficulty VARCHAR(20) CHECK (difficulty IN ('Mudah', 'Sederhana', 'Cabar')),
  xp_reward INT DEFAULT 30,
  coin_reward INT DEFAULT 10,
  status VARCHAR(20) CHECK (status IN ('todo', 'pending_approval', 'approved', 'rejected')),
  proof_url TEXT,
  proof_note TEXT,
  parent_comment TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents read own record" ON users
  FOR SELECT USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Parents manage child profiles" ON child_profiles
  FOR ALL USING (parent_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Access missions for family" ON missions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM child_profiles cp
      WHERE cp.id = missions.child_id AND (cp.parent_id = auth.uid() OR cp.id = auth.uid())
    )
  );`
};

export const ER_DIAGRAM_ASCII = `
+-----------------------+          +------------------------+
|        USERS          |          |     CHILD_PROFILES     |
+-----------------------+          +------------------------+
| id (PK) UUID          |1        *| id (PK) UUID           |
| email VARCHAR         |----------| parent_id (FK) UUID    |
| name VARCHAR          |          | name VARCHAR           |
| role (parent/admin)   |          | age INT, gender VARCHAR|
| plan (FREE/PREMIUM)   |          | xp, coins, level INT   |
| access_code VARCHAR   |          | avatar_data JSONB      |
+-----------------------+          | pet_data JSONB         |
                                   +------------------------+
                                                | 1
                                                |
                                                | *
                                   +------------------------+
                                   |        MISSIONS        |
                                   +------------------------+
                                   | id (PK) UUID           |
                                   | child_id (FK) UUID     |
                                   | title, category VARCHAR|
                                   | xp_reward, coin_reward |
                                   | status (todo/approved) |
                                   | proof_url TEXT         |
                                   +------------------------+
`;

export const WIREFRAMES_ASCII = `
===================================================================================
                             CHILD DASHBOARD WIREFRAME
===================================================================================
[ HEADER: MudahKids Logo | Child Selector (Umar) | 🪙 480 | ⭐ Lvl 3 | 🌐 BM/EN ]
-----------------------------------------------------------------------------------
[ HERO CARD: BANNER ]
  [ Big Interactive Avatar & Pet ]    [ Daily Spin Wheel / Mystery Box ]
  [ "Syabas Umar! Solat Subuh Selesai" ] [ Streak: 🔥 12 Hari Berturut-turut ]
-----------------------------------------------------------------------------------
[ TABS: 🕌 Islamic Missions | ✏️ Jawi Learning | 🧹 Chores | 🗺️ Nusantara World ]
-----------------------------------------------------------------------------------
[ MISSION CARD LIST ]
  +-------------------------------------------------------------------------------+
  | [🕌] Solat Subuh Berjemaah Tepat Waktu   [+50 XP | +20 Coins]   ( Selesai ✓ ) |
  | [✏️] Trace Letter Alif & Ba (Jawi)        [+40 XP | +15 Coins]   ( Hantar Proof )|
  | [🧹] Kemas Katil & Selimut Sendiri      [+25 XP | +10 Coins]   ( Mula )      |
  +-------------------------------------------------------------------------------+
[ FOOTER NAV: 🏠 Home | 🗺️ World Builder | 🛍️ Shop | 🏆 Leaderboard | 📊 Stats ]
===================================================================================
`;

export const FORMULAS_AND_GAMIFICATION = {
  xpFormula: "XP_Required = 100 * (Current_Level ^ 1.5)",
  coinFormula: "Coins_Awarded = Base_Coins * Category_Multiplier + (Streak_Days * 2)",
  levelFormula: "Current_Level = Math.floor(Math.pow(Total_XP / 100, 1 / 1.5)) + 1",
  rules: [
    "1. 1-Tap Approval oleh Ibu Bapa memberikan bonus 10% syiling ganjaran.",
    "2. Setiap 7 hari streak tanpa terputus memberikan Pet Evolution Scroll & Mystery Box.",
    "3. Pembinaan bangunan Nusantara memerlukan penukaran syiling yang diperoleh daripada tugasan."
  ]
};

export const CLOUDFLARE_DEPLOYMENT_GUIDE = `
# Cloudflare Pages & Workers Deployment Guide for MudahKids

1. **Pre-requisites**:
   - Cloudflare Account with Workers/Pages enabled.
   - Node.js v20+ and Wrangler CLI (\`npm i -g wrangler\`).

2. **Build Configuration**:
   - Build Command: \`npm run build\`
   - Output Directory: \`dist\`
   - Environment Variables:
     - \`GEMINI_API_KEY\`: Secret key from Google AI Studio.
     - \`SUPABASE_URL\`: Your Supabase Project URL.
     - \`SUPABASE_ANON_KEY\`: Supabase Anonymous Public Key.

3. **Deploying via Wrangler**:
   \`\`\`bash
   # Build the bundle
   npm run build

   # Publish to Cloudflare Pages
   npx wrangler pages deploy dist --project-name=mudahkids
   \`\`\`

4. **Cloudflare Worker Setup (for API endpoints)**:
   - Configure \`wrangler.toml\` with serverless route bindings for \`/api/*\` proxying.
`;
