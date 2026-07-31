import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ParentPinModal } from "./ParentPinModal";
import {
  Sparkles,
  User,
  Heart,
  Globe,
  Coins,
  Award,
  Volume2,
  VolumeX,
  Crown,
  LogIn,
  LogOut,
  BookOpen
} from "lucide-react";

interface HeaderProps {
  onOpenDocs?: () => void;
  onOpenRegisterModal: () => void;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
  onOpenJakimNotes?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRegisterModal,
  onOpenLoginModal,
  onLogout,
  onOpenJakimNotes
}) => {
  const {
    language,
    setLanguage,
    role,
    setRole,
    user,
    logoutAccount,
    activeChild,
    childrenProfiles,
    activeChildId,
    setActiveChildId,
    soundEnabled,
    setSoundEnabled
  } = useApp();

  const [showPinModal, setShowPinModal] = useState(false);

  const handleSwitchToParent = () => {
    if (role === "child") {
      setShowPinModal(true);
    } else {
      setRole("parent");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-amber-300 font-black text-xl shadow-md border-2 border-amber-300/40">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight text-stone-900 font-sans">
                  Mudah<span className="text-emerald-600">Kids</span>
                </h1>
                {user && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300">
                    <Crown className="w-3 h-3 text-amber-500" />
                    {language === "en" ? "FULL ACCESS (RM39)" : "AKSES PENUH (RM39)"}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-stone-500">
                {language === "en" ? "Learn • Pray • Help • Play" : "Belajar • Beribadah • Membantu • Bermain"}
              </p>
            </div>
          </div>

          {/* JAKIM Reference Quick Button */}
          {onOpenJakimNotes && (
            <button
              onClick={onOpenJakimNotes}
              className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>📖 Nota & Rujukan JAKIM</span>
            </button>
          )}

          {/* Child Selector & Stats Badge (If Child Mode) */}
          {role === "child" && activeChild && (
            <div className="flex flex-wrap items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
              {activeChild.activeTitle && (
                <span className="bg-amber-300 text-stone-900 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-400">
                  <Crown className="w-3 h-3 text-amber-900" />
                  {activeChild.activeTitle}
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🪙</span>
                <span className="font-extrabold text-stone-800 text-sm">{activeChild.coins}</span>
                <span className="text-xs text-stone-400 font-medium">
                  {language === "en" ? "Coins" : "Syiling"}
                </span>
              </div>
              <div className="w-px h-4 bg-stone-200" />
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-stone-800 text-sm">Lvl {activeChild.level}</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-md">
                  {activeChild.xp} XP
                </span>
              </div>
              <div className="w-px h-4 bg-stone-200" />
              <div className="flex items-center gap-1">
                <span className="text-base">🔥</span>
                <span className="font-bold text-amber-600 text-xs">{activeChild.streak}d</span>
              </div>
            </div>
          )}

          {/* Role Switcher Controls */}
          <div className="flex items-center gap-2">
            {/* Active Profile Dropdown if multiple children */}
            {childrenProfiles.length > 1 && (
              <select
                value={activeChildId}
                onChange={(e) => setActiveChildId(e.target.value)}
                className="text-xs font-semibold bg-stone-100 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {childrenProfiles.map((c) => (
                  <option key={c.id} value={c.id}>
                    👦 {c.name} ({c.age} {language === "en" ? "yrs" : "thn"})
                  </option>
                ))}
              </select>
            )}

            {/* Mode Tabs */}
            <div className="bg-stone-200/80 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={handleSwitchToParent}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  role === "parent"
                    ? "bg-white text-emerald-700 shadow-2xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>🔒 {language === "en" ? "Parent" : "Ibu Bapa"}</span>
              </button>
              <button
                onClick={() => setRole("child")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  role === "child"
                    ? "bg-emerald-600 text-white shadow-2xs font-bold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Child" : "Anak"}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "bm" ? "en" : "bm")}
              className="px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === "bm" ? "🇲🇾 BM" : "🇬🇧 EN"}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-600 shadow-2xs"
              title="Kesan Bunyi"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            {/* Login / Logout Buttons */}
            {user ? (
              <button
                onClick={() => {
                  logoutAccount();
                  if (onLogout) onLogout();
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 font-bold text-xs border border-stone-300 transition-all flex items-center gap-1 cursor-pointer"
                title={language === "en" ? "Log Out" : "Log Keluar"}
              >
                <LogOut className="w-3.5 h-3.5 text-stone-500 hover:text-red-600" />
                <span>{language === "en" ? "Log Out" : "Log Keluar"}</span>
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Log In" : "Log Masuk"}</span>
              </button>
            )}

            {/* Register / Plan CTA */}
            <button
              onClick={onOpenRegisterModal}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-stone-900" />
              <span>{user ? (language === "en" ? "Account Plan" : "Pelan Akaun") : (language === "en" ? "Register" : "Daftar")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Parent PIN Lock Modal */}
      <ParentPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => {
          setRole("parent");
          setShowPinModal(false);
        }}
      />
    </>
  );
};
