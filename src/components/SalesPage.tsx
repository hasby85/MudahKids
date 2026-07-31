import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MembershipPlan } from "../types";
import {
  CheckCircle2,
  Sparkles,
  Crown,
  Volume2,
  Play,
  Pause,
  ShieldCheck,
  Star,
  BookOpen,
  Award,
  Check,
  Zap,
  Lock,
  Gift,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  LayoutDashboard,
  Globe,
  Sliders,
  ArrowDown,
  Layers
} from "lucide-react";

interface SalesPageProps {
  onStartRegistration: (plan: MembershipPlan) => void;
  onExploreApp?: () => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onStartRegistration }) => {
  const { language } = useApp();

  // State for interactive demo player in sales page
  const [activeDemoTab, setActiveDemoTab] = useState<"jawi" | "hafazan" | "world">("jawi");
  const [demoAudioPlaying, setDemoAudioPlaying] = useState(false);
  const [demoJawiLetter, setDemoJawiLetter] = useState("ا");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Play audio sound for live interactive demo
  const handlePlayDemoSound = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      setDemoAudioPlaying(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("id") ||
          v.name.toLowerCase().includes("indonesi")
      );
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onend = () => setDemoAudioPlaying(false);
      utterance.onerror = () => setDemoAudioPlaying(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setDemoAudioPlaying(false);
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById("pricing-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      {/* Top Urgency Header Bar */}
      <div className="bg-amber-400 text-stone-900 py-2.5 px-4 text-center text-xs font-black tracking-wide border-b border-amber-500 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-stone-900 text-amber-300 text-[10px] uppercase font-black px-2 py-0.5 rounded-md">
            TAWARAN KHAS 2026
          </span>
          <span>
            Pendaftaran Akses Penuh Sekeluarga Hanya RM39 / Tahun (Jimat Lebih 95% Dari Harga Asal)
          </span>
        </div>
      </div>

      {/* Main Hero Sales Hook */}
      <section className="pt-12 pb-16 px-4 bg-gradient-to-b from-emerald-900 via-emerald-950 to-stone-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600 text-amber-300 text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>SISTEM PEMBELAJARAN ISLAMIK & JAWI INTERAKTIF NO. 1 MALAYSIA</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white font-sans">
            Anak Asyik Main Gajet? Bantu Anak Kuasai <span className="text-amber-400">Jawi, Hafazan Surah & Solat</span> Dengan Mudah & Seronok Dalam Masa 14 Hari!
          </h1>

          <p className="text-emerald-100 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Satu-satunya platform gamifikasi patuh syariah yang menggantikan ketagihan gajet anak kepada amalan pahala, hafazan bacaan dan amalan sunnah harian.
          </p>

          {/* Quick Nav anchor to pricing */}
          <div className="pt-2">
            <button
              onClick={scrollToPricing}
              className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 text-xs font-bold underline cursor-pointer"
            >
              <span>Lihat Pakej Langganan RM39/Tahun Di Bawah</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Problem & Empathy Section */}
      <section className="py-16 px-4 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-red-700 bg-red-100 px-3.5 py-1 rounded-full">
              CABARAN IBU BAPA HARI INI
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900">
              Adakah Anda Menghadapi Masalah Ini Dengan Anak Anda?
            </h2>
            <p className="text-stone-600 text-sm max-w-xl mx-auto">
              Ramai ibu bapa di Malaysia risau melihat perkembangan rohani dan akademik anak-anak dalam persekitaran digital hari ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="font-extrabold text-stone-900 text-base">Anak Cepat Bosan Bila Belajar Jawi & Mengaji</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Buku teks tradisional kurang menarik perhatian anak yang sudah terbiasa dengan animasi pantas dan permainan video digital.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="font-extrabold text-stone-900 text-base">Ketagihan Gajet & Permainan Tidak Berfaedah</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Masa anak habis dipersia dengan video dan aplikasi tanpa unsur pendidikan agama atau pembentukan sahsiah murni.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="font-extrabold text-stone-900 text-base">Ibu Bapa Sibuk & Tiada Masa Menyemak Latihan</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Keputusan kerja dan kesibukan harian menyukarkan ibu bapa untuk memantau kemajuan bacaan hafazan dan jawi anak secara konsisten.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="font-extrabold text-stone-900 text-base">Yuran Kelas Tambahan & Ustaz Peribadi Yang Tinggi</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Mengupah tutor peribadi memerlukan belanja ratusan ringgit setiap bulan manakala jadual kelas luaran kekadang bertembung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution: MudahKids */}
      <section className="py-16 px-4 bg-emerald-50/60 border-b border-stone-200">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-200 px-3.5 py-1 rounded-full">
            SOLUSI LENGKAP MUDAHKIDS
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900">
            Memperkenalkan Platform MudahKids
          </h2>
          <p className="text-stone-700 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Sistem pembelajaran gamifikasi yang direka khusus mengikut kurikulum pendidikan Islam Malaysia. Anak belajar Jawi, membaca surah hafazan, melakukan tugasan rumah dan membina kampung virtual Nusantara sambil mengumpul syiling dan ganjaran.
          </p>
        </div>
      </section>

      {/* Interactive System Demo / Player Section */}
      <section className="py-16 px-4 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full">
              DEMO INTERAKTIF LANGSUNG
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900">
              Uji Cuba Sistem MudahKids Sekarang
            </h2>
            <p className="text-stone-500 text-xs md:text-sm">
              Sila tekan butang di bawah untuk mendengar audio sebutan dan mencuba fungsi pembelajaran sebenar.
            </p>
          </div>

          <div className="bg-stone-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-stone-800 space-y-6">
            {/* Demo Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 border-b border-stone-800 pb-4">
              <button
                onClick={() => setActiveDemoTab("jawi")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeDemoTab === "jawi"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-stone-800 text-stone-400 hover:text-white"
                }`}
              >
                1. Demo Sebutan Jawi
              </button>
              <button
                onClick={() => setActiveDemoTab("hafazan")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeDemoTab === "hafazan"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-stone-800 text-stone-400 hover:text-white"
                }`}
              >
                2. Demo Audio Hafazan
              </button>
              <button
                onClick={() => setActiveDemoTab("world")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeDemoTab === "world"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-stone-800 text-stone-400 hover:text-white"
                }`}
              >
                3. Demo Pembinaan Nusantara
              </button>
            </div>

            {/* Demo Player Display */}
            {activeDemoTab === "jawi" && (
              <div className="space-y-6 text-center">
                <p className="text-xs text-stone-300 font-medium">
                  Pilih huruf Jawi di bawah dan tekan butang pembesar suara untuk mendengar sebutan Bahasa Melayu Standard:
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { letter: "ا", name: "Alif" },
                    { letter: "ب", name: "Ba" },
                    { letter: "ت", name: "Ta" },
                    { letter: "ث", name: "Sa" },
                    { letter: "ج", name: "Jim" },
                    { letter: "چ", name: "Cha" },
                    { letter: "ح", name: "Ha" },
                    { letter: "خ", name: "Kha" }
                  ].map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setDemoJawiLetter(item.letter);
                        handlePlayDemoSound(item.name);
                      }}
                      className={`w-14 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                        demoJawiLetter === item.letter
                          ? "bg-emerald-600 border-amber-300 text-white font-black shadow-lg scale-105"
                          : "bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700"
                      }`}
                    >
                      <span className="text-2xl font-black font-serif">{item.letter}</span>
                      <span className="text-[10px] font-bold text-emerald-300">{item.name}</span>
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-between max-w-md mx-auto">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Huruf Dipilih</span>
                    <h4 className="text-xl font-bold text-white">Huruf {demoJawiLetter}</h4>
                  </div>
                  <button
                    onClick={() => handlePlayDemoSound(demoJawiLetter)}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-stone-900" />
                    <span>Dengar Sebutan</span>
                  </button>
                </div>
              </div>
            )}

            {activeDemoTab === "hafazan" && (
              <div className="space-y-6 text-center max-w-md mx-auto">
                <p className="text-xs text-stone-300 font-medium">
                  Sistem ulangan audio 3x hafazan surah pendek (Standard Tajwid Malaysia):
                </p>

                <div className="p-5 rounded-2xl bg-stone-800 border border-stone-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-300">Surah Al-Ikhlas (Ayat 1)</span>
                    <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                      Ulangan 3x
                    </span>
                  </div>

                  <div className="text-2xl font-serif text-right text-stone-100 py-2">
                    قُلْ هُوَ اللَّهُ أَحَدٌ
                  </div>

                  <button
                    onClick={() => handlePlayDemoSound("Qul huwallahu ahad. Qul huwallahu ahad. Qul huwallahu ahad.")}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {demoAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{demoAudioPlaying ? "Sedang Memutar Audio..." : "Mainkan Hafazan Audio 3x"}</span>
                  </button>
                </div>
              </div>
            )}

            {activeDemoTab === "world" && (
              <div className="space-y-6 text-center max-w-md mx-auto">
                <p className="text-xs text-stone-300 font-medium">
                  Anak membina Masjid, Sekolah dan Kebun menggunakan syiling ganjaran amalan harian:
                </p>

                <div className="p-4 rounded-2xl bg-stone-800 border border-stone-700 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-700">
                      <span className="text-[10px] font-bold text-amber-300">MASJID KAMPUNG</span>
                      <p className="text-xs text-stone-300 mt-1">Status: Siap Dibina</p>
                      <span className="text-[10px] text-emerald-400 font-bold block mt-1">+50 Syiling Pahala</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-700">
                      <span className="text-[10px] font-bold text-emerald-300">SEKOLAH AGAMA</span>
                      <p className="text-xs text-stone-300 mt-1">Status: Siap Dibina</p>
                      <span className="text-[10px] text-emerald-400 font-bold block mt-1">+30 Syiling Pahala</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Exact System Dashboard SVG Mockups & Value Stack */}
      <section className="py-16 px-4 bg-stone-100/70 border-b border-stone-200">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full">
              PENAWARAN FITUR & MOCKUP SISTEM
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900">
              6 Modul Utama & Nilai Sebenar Sistem MudahKids
            </h2>
            <p className="text-stone-600 text-sm max-w-xl mx-auto">
              Setiap modul dibina berasaskan antara muka papan pemuka sebenar sistem MudahKids tanpa sebarang gambar AI tiruan.
            </p>
          </div>

          {/* Feature 1: Modul Jawi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                FITUR 1
              </div>
              <h3 className="text-2xl font-black text-stone-900">Modul Pembelajaran Jawi Interaktif</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Latihan menekap huruf (tracing), sebutan fonetik Melayu Malaysia, susun perkataan Jawi, kuiz memori dan bacaan peribahasa Jawi.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-between">
                <span>Nilai Pasaran Modul Ini:</span>
                <span className="text-sm font-black text-amber-700">RM199 / TAHUN</span>
              </div>
            </div>

            {/* SVG Mockup Jawi Module */}
            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">mudahkids.app/jawi</span>
              </div>
              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center bg-stone-800 p-2.5 rounded-xl">
                  <span className="text-xs font-extrabold text-amber-300">Modul Jawi Level 1</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold">100 XP</span>
                </div>
                <div className="bg-stone-800 p-4 rounded-xl text-center space-y-2 border border-stone-700">
                  <div className="text-4xl font-serif text-white font-black">چ</div>
                  <span className="text-xs text-emerald-400 font-bold block">Huruf Cha (Cha)</span>
                  <div className="text-[10px] text-stone-400">Contoh: چوان (Cawan)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Modul Hafazan & Al-Quran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <div className="space-y-4 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                FITUR 2
              </div>
              <h3 className="text-2xl font-black text-stone-900">Modul Hafazan Surah & Audio Quran</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pemain audio surah-surah lazim dengan penetapan ulangan 3x ayat, petunjuk tajwid warna dan rekod hafazan anak.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-between">
                <span>Nilai Pasaran Modul Ini:</span>
                <span className="text-sm font-black text-amber-700">RM150 / TAHUN</span>
              </div>
            </div>

            {/* SVG Mockup Hafazan Module */}
            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 shadow-md md:order-1">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">mudahkids.app/hafazan</span>
              </div>
              <div className="pt-4 space-y-3">
                <div className="bg-stone-800 p-3 rounded-xl space-y-2 border border-stone-700">
                  <div className="flex justify-between text-xs text-amber-300 font-extrabold">
                    <span>Surah Al-Fatihah</span>
                    <span>7 Ayat</span>
                  </div>
                  <div className="p-3 bg-stone-900 rounded-lg text-right font-serif text-lg text-stone-100">
                    الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-emerald-400 font-bold">Status: Hafal 100%</span>
                    <span className="text-[10px] text-stone-400">Ulangan Audio 3x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Dunia Nusantara & Pembinaan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                FITUR 3
              </div>
              <h3 className="text-2xl font-black text-stone-900">Dunia Nusantara & Virtual City Builder</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Aplikasi peta Nusantara 15 zon (Kampung, Masjid, Sekolah) untuk dibina menggunakan syiling ganjaran amalan harian anak.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-between">
                <span>Nilai Pasaran Modul Ini:</span>
                <span className="text-sm font-black text-amber-700">RM120 / TAHUN</span>
              </div>
            </div>

            {/* SVG Mockup World Builder */}
            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">mudahkids.app/nusantara</span>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-stone-800 border border-emerald-500/40 text-center">
                  <span className="text-[10px] font-extrabold text-amber-300 block">KAMPUNG TRADISI</span>
                  <span className="text-xs font-bold text-stone-200 block mt-1">Masjid & Kebun</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-800 border border-stone-700 text-center">
                  <span className="text-[10px] font-extrabold text-emerald-400 block">SEKOLAH AGAMA</span>
                  <span className="text-xs font-bold text-stone-200 block mt-1">Perpustakaan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Rujukan JAKIM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <div className="space-y-4 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                FITUR 4
              </div>
              <h3 className="text-2xl font-black text-stone-900">Panduan & Nota Rujukan JAKIM</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pusat rujukan langkah solat 5 waktu, syarat wuduk, rukun Islam/Iman dan doa harian yang disahkan sesuai sukatan JAKIM.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-between">
                <span>Nilai Pasaran Modul Ini:</span>
                <span className="text-sm font-black text-amber-700">RM99 / TAHUN</span>
              </div>
            </div>

            {/* SVG Mockup JAKIM Module */}
            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 shadow-md md:order-1">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">mudahkids.app/jakim</span>
              </div>
              <div className="pt-4 space-y-2">
                <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-between">
                  <span className="text-xs text-white font-bold">Panduan Solat Fardhu & Wuduk</span>
                  <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">Sah JAKIM</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-between">
                  <span className="text-xs text-white font-bold">Doa Harian & Adab Berguru</span>
                  <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">Rujukan Lengkap</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 5: Parent Analytics & Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                FITUR 5
              </div>
              <h3 className="text-2xl font-black text-stone-900">Papan Pemuka Ibu Bapa & Laporan Real-Time</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pantau kadar penyelesaian tugasan rumah, peratusan kelulusan Jawi, keselamatan kunci PIN ibu bapa dan cadangan tugasan pintar AI Gemini.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-between">
                <span>Nilai Pasaran Modul Ini:</span>
                <span className="text-sm font-black text-amber-700">RM149 / TAHUN</span>
              </div>
            </div>

            {/* SVG Mockup Parent Dashboard */}
            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">mudahkids.app/parent-analytics</span>
              </div>
              <div className="pt-4 space-y-3">
                <div className="p-3 bg-stone-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs text-stone-200 font-bold">
                    <span>Kemajuan Jawi Anak</span>
                    <span className="text-emerald-400">85% Completed</span>
                  </div>
                  <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 6: Reward Shop & Avatars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <div className="space-y-4 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                FITUR 6
              </div>
              <h3 className="text-2xl font-black text-stone-900">Kedai Ganjaran, Avatar & Haiwan Peliharaan</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Anak menembus syiling pahala untuk pakaian Songkok, Baju Melayu, Hijab, kucing comel dan gelaran eksklusif carta keluarga.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-between">
                <span>Nilai Pasaran Modul Ini:</span>
                <span className="text-sm font-black text-amber-700">RM80 / TAHUN</span>
              </div>
            </div>

            {/* SVG Mockup Shop Module */}
            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 shadow-md md:order-1">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">mudahkids.app/shop</span>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-2">
                <div className="p-3 bg-stone-800 rounded-xl text-center space-y-1">
                  <span className="text-xs font-bold text-amber-300 block">Songkok Diraja</span>
                  <span className="text-[10px] text-stone-300">50 Syiling</span>
                </div>
                <div className="p-3 bg-stone-800 rounded-xl text-center space-y-1">
                  <span className="text-xs font-bold text-amber-300 block">Kucing Comel</span>
                  <span className="text-[10px] text-stone-300">100 Syiling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Stack & Price Summary Table */}
      <section className="py-16 px-4 bg-emerald-950 text-white border-b border-stone-800">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-emerald-900 px-3.5 py-1 rounded-full border border-amber-300/30">
              RANGKUMAN NILAI KESELURUHAN
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Berapa Nilai Sebenar Pakej Lengkap MudahKids?
            </h2>
          </div>

          <div className="bg-emerald-900/80 p-6 md:p-8 rounded-3xl border border-emerald-700/60 space-y-4">
            <div className="flex justify-between items-center text-xs md:text-sm border-b border-emerald-800 pb-3">
              <span className="font-semibold text-emerald-100">1. Modul Pembelajaran Jawi Interaktif</span>
              <span className="font-bold text-amber-300">RM199 / tahun</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm border-b border-emerald-800 pb-3">
              <span className="font-semibold text-emerald-100">2. Modul Hafazan Surah & Audio Al-Quran</span>
              <span className="font-bold text-amber-300">RM150 / tahun</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm border-b border-emerald-800 pb-3">
              <span className="font-semibold text-emerald-100">3. Peta Dunia Nusantara & Virtual City Builder</span>
              <span className="font-bold text-amber-300">RM120 / tahun</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm border-b border-emerald-800 pb-3">
              <span className="font-semibold text-emerald-100">4. Hub Rujukan Panduan Solat & Wuduk JAKIM</span>
              <span className="font-bold text-amber-300">RM99 / tahun</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm border-b border-emerald-800 pb-3">
              <span className="font-semibold text-emerald-100">5. Papan Pemuka Laporan Ibu Bapa & AI Gemini</span>
              <span className="font-bold text-amber-300">RM149 / tahun</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm border-b border-emerald-800 pb-3">
              <span className="font-semibold text-emerald-100">6. Kedai Ganjaran Syiling & Lencana Motivasi</span>
              <span className="font-bold text-amber-300">RM80 / tahun</span>
            </div>

            <div className="pt-2 flex justify-between items-center text-sm md:text-base font-extrabold text-stone-200">
              <span>JUMLAH NILAI KESELURUHAN:</span>
              <span className="text-red-400 line-through">RM797 / TAHUN</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-400 text-stone-900 text-center space-y-1 mt-4">
              <span className="text-xs font-black uppercase tracking-wider block">HARGA PROMOSI KHAS HARI INI</span>
              <div className="text-3xl md:text-4xl font-black">HANYA RM39 / TAHUN</div>
              <p className="text-[11px] font-bold text-stone-800">
                Akses Penuh Untuk 1 Tahun Sekeluarga (Sehingga 5 Anak) • Tanpa Sebarang Cas Tersembunyi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Social Proof */}
      <section className="py-16 px-4 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
              TESTIMONI IBU BAPA MALAYSIA
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900">
              Apa Kata Ibu Bapa Yang Telah Menggunakan MudahKids?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                "Anak saya umur 7 tahun dulu liat sangat nak belajar Jawi. Selepas 1 minggu guna MudahKids, dia sendiri rajin buka aplikasi sebab nak kumpul syiling bina kampung Nusantara!"
              </p>
              <div className="pt-2 border-t border-stone-200 text-xs">
                <span className="font-extrabold text-stone-900 block">Puan Sarah Ahmad</span>
                <span className="text-stone-500 text-[11px]">Ibu Kepada 2 Anak (Bangi, Selangor)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                "Sangat berbaloi dengan harga RM39 setahun. Modul hafazan ada ulangan audio 3x dan sebutan Jawi sangat jelas ikut gaya Bahasa Melayu Malaysia."
              </p>
              <div className="pt-2 border-t border-stone-200 text-xs">
                <span className="font-extrabold text-stone-900 block">Encik Hafiz Razak</span>
                <span className="text-stone-500 text-[11px]">Bapa (Shah Alam, Selangor)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                "Sebagai guru Fardhu Ain, saya sangat mengesyorkan MudahKids untuk murid sekolah rendah. Nota JAKIM dan modul solat amat tepat."
              </p>
              <div className="pt-2 border-t border-stone-200 text-xs">
                <span className="font-extrabold text-stone-900 block">Ustazah Aminah Yusof</span>
                <span className="text-stone-500 text-[11px]">Pendidik KAFA (Melaka)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Pricing Table & Direct Checkout CTA */}
      <section id="pricing-section" className="py-20 px-4 bg-gradient-to-b from-stone-100 to-emerald-50">
        <div className="max-w-xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-200 px-3.5 py-1 rounded-full">
              PAKEJ LANGGANAN RASMI
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900">
              Daftar Sekarang Untuk Mula
            </h2>
            <p className="text-xs md:text-sm text-stone-600">
              Klik butang di bawah untuk membuka borang pendaftaran dan proses pembayaran yang selamat.
            </p>
          </div>

          {/* Pricing Box */}
          <div className="relative p-8 rounded-3xl bg-emerald-900 text-white shadow-2xl border-4 border-amber-400 space-y-6 text-left">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-900 font-black text-xs uppercase tracking-widest px-5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-stone-900" />
              <span>PAKEJ TAHUNAN SEKELUARGA</span>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-baseline justify-between border-b border-emerald-800 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-amber-300">LANGGANAN 1 TAHUN</h3>
                  <span className="text-xs text-emerald-200 font-semibold">MudahKids Sekeluarga</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-black text-amber-300">RM39</div>
                  <span className="text-[10px] text-emerald-300 font-medium">/ tahun sahaja</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-emerald-100 pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Sehingga 5 Profil Anak Dalam Satu Akaun</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Akses Penuh Semua Modul Jawi, Hafazan & Nusantara</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Akses Panduan Rujukan JAKIM & Amalan Solat</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Kedai Ganjaran Syiling, Avatar & Haiwan Peliharaan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Laporan Prestasi Real-Time & Kunci PIN Ibu Bapa</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Penghantaran Kod Akses Serta-Merta Ke Emel</span>
                </li>
              </ul>
            </div>

            {/* THE ONLY CHECKOUT BUTTON ON THE SALES PAGE */}
            <button
              onClick={() => onStartRegistration("PREMIUM")}
              className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-black text-base shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 text-center block"
            >
              LANGGAN SEKARANG - RM39 / TAHUN
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-300 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Pembayaran Selamat • Kod Akses Dihantar Serta-Merta Melalui Emel</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 px-4 bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-stone-600 bg-stone-100 px-3.5 py-1 rounded-full">
              SOALAN LAZIM (FAQ)
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900">
              Soalan Sering Ditanya
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Bagaimanakah cara saya menerima kod akses selepas mendaftar?",
                a: "Selepas borang pendaftaran dan pembayaran RM39 selesai, sistem akan menghantar kod akses unik secara automatik ke emel yang anda daftarkan."
              },
              {
                q: "Adakah terdapat sebarang cas bulanan atau tersembunyi?",
                a: "Tidak. Yuran RM39 adalah untuk langganan penuh selama 1 tahun sekeluarga tanpa sebarang pemotongan bulanan secara senyap."
              },
              {
                q: "Berapakah bilangan profil anak yang boleh didaftarkan?",
                a: "Satu akaun ibu bapa menyokong sehingga 5 profil anak secara serentak."
              },
              {
                q: "Adakah MudahKids boleh dibuka di telefon bimbit dan tablet?",
                a: "Ya. MudahKids direka responsif sepenuhnya untuk telefon bimbit, tablet, iPad mahupun komputer laptop."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full p-4 text-left font-extrabold text-stone-900 text-xs md:text-sm flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaqIdx === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {openFaqIdx === idx && (
                  <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-stone-200 bg-stone-100 text-center text-xs text-stone-500">
        <p className="font-bold text-stone-700">MudahKids Malaysia © 2026 — Hak Cipta Terpelihara</p>
        <p className="mt-1">
          Sistem Pembelajaran Jawi, Hafazan & Didikan Anak Islamik Terunggul
        </p>
      </footer>
    </div>
  );
};
