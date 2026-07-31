import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { SHOP_ITEMS, INITIAL_LEADERBOARD, INITIAL_ACHIEVEMENTS } from "../data/initialData";
import {
  ShoppingBag,
  Trophy,
  Award,
  Crown,
  Coins,
  CheckCircle2,
  Lock,
  Sparkles
} from "lucide-react";

export const ShopAndLeaderboard: React.FC = () => {
  const { activeChild, childrenProfiles, setRole, buyItem, showToast, language } = useApp();
  const [activeTab, setActiveTab] = useState<"shop" | "leaderboard" | "achievements">("shop");
  const [shopCategory, setShopCategory] = useState<"all" | "pet" | "avatar" | "decoration" | "title">("all");

  if (!activeChild) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-4 max-w-xl mx-auto shadow-2xs my-8">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-3xl mx-auto">
          🛍️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-stone-900">
            {language === "en" ? "Reward Shop & Leaderboard" : "Kedai Ganjaran & Carta Kedudukan"}
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            {language === "en"
              ? "Please switch to Parent mode to add a child profile first."
              : "Sila bertukar ke mod Ibu Bapa untuk menambah profil anak terlebih dahulu."}
          </p>
        </div>
        <button
          onClick={() => setRole("parent")}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
        >
          {language === "en" ? "Switch to Parent Mode" : "Tukar ke Mod Ibu Bapa"}
        </button>
      </div>
    );
  }

  const filteredItems = shopCategory === "all"
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((i) => i.category === shopCategory);

  // Leaderboard shows ONLY children in the current family
  const familyChildrenLeaderboard = [...childrenProfiles].sort((a, b) => b.xp - a.xp);

  const categoryLabels = {
    all: language === "en" ? "All Items" : "Semua Barangan",
    pet: language === "en" ? "Pets 🐱" : "Haiwan Peliharaan 🐱",
    avatar: language === "en" ? "Avatars 👦" : "Watak Avatar 👦",
    decoration: language === "en" ? "Decorations 🪔" : "Hiasan Dunia 🪔",
    title: language === "en" ? "Titles 🏅" : "Gelaran Eksklusif 🏅"
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl shadow-2xs">
            🛍️
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900">
              {language === "en" ? "Reward Shop & Family Leaderboard" : "Kedai Ganjaran & Carta Kedudukan Keluarga"}
            </h2>
            <p className="text-stone-500 text-xs">
              {language === "en"
                ? "Exchange earned coins for exclusive pets & avatars, and lead the family chart!"
                : "Tukar syiling hasil usaha anda dengan haiwan & avatar eksklusif, serta capai carta keluarga teratas!"}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("shop")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "shop" ? "bg-emerald-600 text-white shadow-2xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            🛍️ {language === "en" ? "Rewards Shop" : "Kedai MudahKids"}
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "leaderboard" ? "bg-emerald-600 text-white shadow-2xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            🏆 {language === "en" ? "Family Leaderboard" : "Carta Kedudukan Keluarga"}
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "achievements" ? "bg-emerald-600 text-white shadow-2xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            🏅 {language === "en" ? "Badges" : "Pencapaian"}
          </button>
        </div>
      </div>

      {/* TAB 1: SHOP */}
      {activeTab === "shop" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
              {(["all", "pet", "avatar", "decoration", "title"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setShopCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    shopCategory === cat
                      ? "bg-amber-400 text-stone-900 shadow-2xs"
                      : "bg-stone-100 text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>

            <div className="text-xs font-extrabold text-stone-800 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
              🪙 {language === "en" ? "Balance:" : "Baki Syiling:"} {activeChild.coins}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isOwned = activeChild.inventory.includes(item.id);
              const isLocked = activeChild.level < item.unlockedLevel;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-5xl">{item.image}</span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Tahap {item.unlockedLevel}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-stone-900 text-sm">
                      {language === "en" && item.nameEn ? item.nameEn : item.name}
                    </h4>
                    <div className="text-xs font-bold text-amber-600">
                      {item.price} {item.currency === "coins" ? "🪙 Syiling" : "💎 Berlian"}
                    </div>
                  </div>

                  <div>
                    {isOwned ? (
                      <div className="w-full py-2.5 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xs text-center">
                        ✓ {language === "en" ? "Owned" : "Dibeli & Dimiliki"}
                      </div>
                    ) : isLocked ? (
                      <div className="w-full py-2.5 rounded-2xl bg-stone-200 text-stone-500 font-bold text-xs text-center flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          {language === "en"
                            ? `Locked (Level ${item.unlockedLevel})`
                            : `Terkunci (Tahap ${item.unlockedLevel})`}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          const res = buyItem(item);
                          showToast(res.message, res.success ? "success" : "error");
                        }}
                        className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        {language === "en" ? "Buy Now" : "Beli Sekarang"} ({item.price} 🪙)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FAMILY LEADERBOARD ONLY */}
      {activeTab === "leaderboard" && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between">
            <span>
              👨‍👩‍👧‍👦 {language === "en" ? "Family Ranking (All Children)" : "Carta Kedudukan Anak-Anak Dalam Keluarga"}
            </span>
            <span className="text-emerald-700 font-semibold">
              {familyChildrenLeaderboard.length} {language === "en" ? "Children Registered" : "Anak Terdaftar"}
            </span>
          </div>

          <div className="space-y-3">
            {familyChildrenLeaderboard.length > 0 ? (
              familyChildrenLeaderboard.map((child, rank) => {
                const avatarIcon = child.gender === "boy" ? "👦🏻" : "👧🏽";
                const petIcon =
                  child.pet.type === "cat"
                    ? "🐱"
                    : child.pet.type === "rabbit"
                    ? "🐰"
                    : child.pet.type === "camel"
                    ? "🐪"
                    : "🦅";

                return (
                  <div
                    key={child.id}
                    className={`p-4 rounded-3xl border flex items-center justify-between gap-4 transition-all ${
                      child.id === activeChild.id
                        ? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/30 shadow-xs"
                        : "bg-stone-50 border-stone-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                          rank === 0
                            ? "bg-amber-400 text-stone-900"
                            : rank === 1
                            ? "bg-slate-300 text-stone-800"
                            : rank === 2
                            ? "bg-amber-700/30 text-amber-900"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        #{rank + 1}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{avatarIcon}</span>
                        <span className="text-2xl">{petIcon}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-stone-900 text-sm">{child.name}</h4>
                          {child.id === activeChild.id && (
                            <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
                              {language === "en" ? "Active" : "Aktif"}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 font-semibold">
                          🔥 {child.streak} {language === "en" ? "Day Streak" : "Hari Berturut-turut"} • Tahap {child.level}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs font-black text-stone-800 shrink-0">
                      <div className="text-emerald-700">{child.xp} XP</div>
                      <div className="text-amber-600">🪙 {child.coins} Syiling</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-stone-500 text-xs">
                <p className="font-extrabold text-stone-700">
                  {language === "en" ? "No children registered yet." : "Belum ada anak terdaftar dalam keluarga."}
                </p>
                <p>
                  {language === "en"
                    ? "Sila ke Mod Ibu Bapa untuk menambah profil anak-anak anda."
                    : "Sila ke Mod Ibu Bapa untuk menambah profil anak-anak anda."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_ACHIEVEMENTS.map((a) => (
            <div
              key={a.id}
              className={`p-5 rounded-3xl border flex items-center gap-4 ${
                a.unlocked
                  ? "bg-emerald-50/60 border-emerald-200"
                  : "bg-stone-50 border-stone-200 opacity-80"
              }`}
            >
              <div className="text-4xl shrink-0">{a.icon}</div>
              <div className="space-y-1 w-full">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-stone-900 text-sm">
                    {language === "en" && a.titleEn ? a.titleEn : a.title}
                  </h4>
                  <span className="text-xs font-bold text-amber-600">+{a.rewardCoins} 🪙</span>
                </div>
                <p className="text-xs text-stone-500">{a.description}</p>
                <div>
                  <div className="flex justify-between text-[10px] text-stone-500 font-bold mb-1">
                    <span>{language === "en" ? "Progress" : "Kemajuan"}</span>
                    <span>
                      {a.progress} / {a.maxProgress}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${(a.progress / a.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
