import React from "react";
import { useApp } from "../context/AppContext";
import { MembershipPlan } from "../types";
import {
  Sparkles,
  ArrowRight,
  Mail,
  LogIn
} from "lucide-react";

interface LandingPageProps {
  onStartRegistration: (plan: MembershipPlan) => void;
  onExploreApp: () => void;
  onOpenLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRegistration,
  onExploreApp,
  onOpenLogin
}) => {
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 bg-gradient-to-b from-emerald-50/80 via-stone-50 to-stone-50">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              {language === "en"
                ? "Malaysia's #1 Gamified Kids & Family App"
                : "Aplikasi Gamifikasi Didikan Anak & Tugasan Rumah #1 Malaysia"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-stone-900 leading-tight">
            Mudah<span className="text-emerald-600">Kids</span>
          </h1>

          <p className="text-lg md:text-xl font-bold text-amber-600 tracking-wide">
            {language === "en"
              ? "Learn • Practice • Help • Play"
              : "Belajar • Beribadah • Membantu • Bermain"}
          </p>

          <p className="max-w-2xl mx-auto text-stone-600 text-sm md:text-base leading-relaxed font-normal">
            {language === "en"
              ? "Combining Chore Management, Jawi Learning Hub, Nusantara World Gamification, Reward Shop & Family Analytics into ONE simple, beautiful platform for ages 4-12."
              : "Menggabungkan Pengurusan Tugasan Rumah, Modul Pembelajaran Jawi, Gamifikasi Dunia Nusantara, Kedai Ganjaran & Analitik Ibu Bapa dalam SATU aplikasi mudah dan menarik untuk umur 4-12 tahun."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onStartRegistration("PREMIUM")}
              className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm md:text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>{language === "en" ? "Register Parent Account" : "Daftar Akaun Ibu Bapa"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-sm md:text-base shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === "en" ? "Parent Log In" : "Log Masuk Ibu Bapa"}</span>
              </button>
            )}
            <button
              onClick={onExploreApp}
              className="px-7 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm md:text-base border border-stone-300 shadow-2xs transition-all cursor-pointer"
            >
              {language === "en" ? "Explore Live Demo" : "Cuba Demo Langsung"}
            </button>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-medium max-w-xl mx-auto flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {language === "en"
                ? "Access code will be sent automatically to your registered email upon completion of registration and payment."
                : "Kod akses laluan akan dihantar secara automatik melalui email yang didaftarkan selepas pendaftaran dan pembayaran selesai."}
            </span>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900">
            {language === "en" ? "6 Pillars in One Unified Experience" : "6 Teras Utama dalam SATU Aplikasi"}
          </h2>
          <p className="text-stone-500 text-sm">
            {language === "en"
              ? "Designed specifically for Malaysian families with rich Nusantara culture and engaging gamification."
              : "Direka khas untuk keluarga Malaysia berasaskan nilai budaya Nusantara dan gamifikasi menarik."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              🧹
            </div>
            <h3 className="font-extrabold text-stone-900 text-lg">
              {language === "en" ? "Chore & Daily Missions" : "Pengurusan Tugasan & Amalan"}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === "en"
                ? "Manage bed making, plant watering, dishwashing, and homework with photo/voice proof & 1-tap parent approval."
                : "Tugasan kemas katil, siram pokok, basuh pinggan dan kerja sekolah dengan sistem bukti gambar/suara & kelulusan 1-tap ibu bapa."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              🎁
            </div>
            <h3 className="font-extrabold text-stone-900 text-lg">
              {language === "en" ? "Reward Shop & Leaderboard" : "Kedai Ganjaran & Carta Kedudukan"}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === "en"
                ? "Redeem earned coins for avatar items, pets, and family rewards while climbing family & school leaderboards."
                : "Tebuk syiling untuk aksesori avatar, haiwan peliharaan, dan ganjaran keluarga sambil bersaing di tangga juara."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
              ✏️
            </div>
            <h3 className="font-extrabold text-stone-900 text-lg">
              {language === "en" ? "Jawi Learning Hub" : "Pusat Pembelajaran Jawi"}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === "en"
                ? "Interactive letter tracing, word spelling, picture matching, memory games, and short stories reading."
                : "Modul latihan menekap huruf (tracing), susun perkataan Jawi, padanan gambar, kuiz memori dan bacaan kisah pendek Jawi."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
              🗺️
            </div>
            <h3 className="font-extrabold text-stone-900 text-lg">
              {language === "en" ? "Nusantara World & Build" : "Dunia Nusantara & Mod Pembinaan"}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === "en"
                ? "Use earned coins to unlock Village, Mosque, and School zones, and build houses, gardens, and fountains."
                : "Gunakan syiling yang diperoleh untuk membuka kawasan Kampung, Masjid, Sekolah dan membina rumah, kebun serta air pancut."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xl">
              🐱
            </div>
            <h3 className="font-extrabold text-stone-900 text-lg">
              {language === "en" ? "Pet & Avatar Evolution" : "Penjagaan Haiwan & Avatar"}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === "en"
                ? "Care for virtual pets (cat, owl, camel) and customize traditional Malay outfits, Songkok, and Hijab."
                : "Jaga haiwan peliharaan (kucing, unta, burung hantu) & pakai pakaian Baju Melayu, Baju Kurung, Songkok dan Hijab."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              📊
            </div>
            <h3 className="font-extrabold text-stone-900 text-lg">
              {language === "en" ? "Parent Analytics & AI" : "Analitik Ibu Bapa & Cadangan AI"}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === "en"
                ? "Track task completion rates, Jawi learning progress, habit growth graphs & AI smart mission recommendations."
                : "Analitik kadar tugasan, tahap pembelajaran Jawi, graf pertumbuhan tabiat & cadangan pintar AI Gemini untuk tugasan anak."}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t border-stone-200 bg-white text-center text-xs text-stone-500">
        <p className="font-bold text-stone-700">MudahKids © 2026 — {language === "en" ? "All Rights Reserved" : "Hak Cipta Terpelihara"}</p>
        <p className="mt-1">
          {language === "en"
            ? "Learn • Practice • Help • Play for Malaysian & Nusantara Families."
            : "Belajar • Beribadah • Membantu • Bermain untuk Pasaran Malaysia & Nusantara."}
        </p>
      </footer>
    </div>
  );
};
