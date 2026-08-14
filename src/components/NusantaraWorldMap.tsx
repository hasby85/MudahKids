import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { NUSANTARA_WORLDS } from "../data/initialData";
import { BuiltStructure } from "../types";
import {
  Compass,
  Hammer,
  Lock,
  Unlock,
  Coins,
  Sparkles,
  TreePine,
  Home,
  CheckCircle2,
  MapPin
} from "lucide-react";

export const NusantaraWorldMap: React.FC = () => {
  const { activeChild, setRole, updateChildProfile, addStructureToWorld, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<"map" | "builder">("map");
  const [selectedWorldId, setSelectedWorldId] = useState("kampung");

  if (!activeChild) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-4 max-w-xl mx-auto shadow-2xs my-8">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-3xl mx-auto">
          🗺️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-stone-900">Dunia Nusantara</h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            Sila bertukar ke mod Ibu Bapa untuk menambah profil anak terlebih dahulu.
          </p>
        </div>
        <button
          onClick={() => setRole("parent")}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
        >
          Tukar ke Mod Ibu Bapa
        </button>
      </div>
    );
  }

  // Builder Item Selector State
  const [selectedStructureType, setSelectedStructureType] = useState<string>("House");

  const BUILDABLE_ITEMS = [
    { type: "House", name: "Rumah Panggung", cost: 30, emoji: "🏡" },
    { type: "Mosque", name: "Masjid Minangkabau", cost: 50, emoji: "🕌" },
    { type: "School", name: "Sekolah Pondok", cost: 40, emoji: "🏫" },
    { type: "Library", name: "Perpustakaan", cost: 45, emoji: "📚" },
    { type: "Farm", name: "Sawah Padi", cost: 25, emoji: "🌾" },
    { type: "Garden", name: "Taman Bunga", cost: 20, emoji: "🌸" },
    { type: "Bridge", name: "Jambatan Kayu", cost: 15, emoji: "🌉" },
    { type: "Fountain", name: "Air Pancut", cost: 35, emoji: "⛲" },
    { type: "Lamp", name: "Pelita Panjut", cost: 10, emoji: "🪔" },
    { type: "Trees", name: "Pokok Kelapa", cost: 10, emoji: "🌴" }
  ];

  const handleUnlockWorld = (worldId: string, cost: number) => {
    if (activeChild.coins < cost) {
      showToast("Syiling tidak mencukupi untuk membuka kawasan ini!", "error");
      return;
    }
    updateChildProfile({
      coins: activeChild.coins - cost,
      unlockedWorlds: [...activeChild.unlockedWorlds, worldId]
    });
    showToast("Tahniah! Kawasan Nusantara baharu berjaya dibuka!", "success");
  };

  const handlePlaceStructure = (gridX: number, gridY: number) => {
    const item = BUILDABLE_ITEMS.find((b) => b.type === selectedStructureType);
    if (!item) return;

    if (activeChild.coins < item.cost) {
      showToast("Syiling tidak mencukupi untuk membina bangunan ini!", "error");
      return;
    }

    updateChildProfile({ coins: activeChild.coins - item.cost });
    addStructureToWorld({
      type: item.type,
      name: item.name,
      x: gridX,
      y: gridY
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl">
            🗺️
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900">Dunia Nusantara & Mode Bina</h2>
            <p className="text-stone-500 text-xs">
              Jelajah 15 dunia bersejarah dan bina perkampungan impian anda!
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("map")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "map" ? "bg-emerald-600 text-white shadow-2xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            🗺️ Peta Dunia Nusantara
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "builder" ? "bg-emerald-600 text-white shadow-2xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            🔨 Mode Bina (Build Mode)
          </button>
        </div>
      </div>

      {/* MODE 1: WORLD MAP */}
      {activeTab === "map" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NUSANTARA_WORLDS.map((w) => {
              const isUnlocked = activeChild.unlockedWorlds.includes(w.id);
              return (
                <div
                  key={w.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                    isUnlocked
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-stone-50 border-stone-200 opacity-80"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{w.icon}</span>
                      {isUnlocked ? (
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          ✓ Terbuka
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>{w.unlockCost} 🪙</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-stone-900 text-base">{w.name}</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">{w.description}</p>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          setSelectedWorldId(w.id);
                          setActiveTab("builder");
                        }}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        Masuk & Bina Kawasan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnlockWorld(w.id, w.unlockCost)}
                        className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Buka Kawasan ({w.unlockCost} 🪙)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: BUILDER CANVAS GRID */}
      {activeTab === "builder" && (
        <div className="space-y-6">
          {/* Builder Item Selector */}
          <div className="p-4 bg-amber-50/70 rounded-3xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                Pilih Bangunan Untuk Dibina:
              </span>
              <span className="text-xs font-bold text-stone-600">Baki Syiling: 🪙 {activeChild.coins}</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {BUILDABLE_ITEMS.map((b) => (
                <button
                  key={b.type}
                  onClick={() => setSelectedStructureType(b.type)}
                  className={`p-3 rounded-2xl border text-center shrink-0 transition-all cursor-pointer ${
                    selectedStructureType === b.type
                      ? "bg-amber-400 text-stone-900 border-amber-500 shadow-sm scale-105"
                      : "bg-white text-stone-800 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <div className="text-2xl">{b.emoji}</div>
                  <div className="text-[11px] font-extrabold mt-1">{b.name}</div>
                  <div className="text-[10px] font-semibold text-stone-500">{b.cost} 🪙</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Tile Grid (5x4) */}
          <div className="p-6 bg-stone-100 rounded-3xl border border-stone-300">
            <p className="text-xs text-stone-500 text-center mb-4 font-bold">
              Klik pada mana-mana petak tanah untuk membina {selectedStructureType}!
            </p>

            <div className="grid grid-cols-5 gap-3 max-w-xl mx-auto">
              {[0, 1, 2, 3, 4].map((x) =>
                [0, 1, 2, 3].map((y) => {
                  const existing = activeChild.builtStructures.find(
                    (s) => s.x === x && s.y === y
                  );
                  const itemInfo = BUILDABLE_ITEMS.find((b) => b.type === existing?.type);

                  return (
                    <button
                      key={`${x}-${y}`}
                      onClick={() => !existing && handlePlaceStructure(x, y)}
                      className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        existing
                          ? "bg-emerald-100 border-emerald-400 shadow-2xs"
                          : "bg-emerald-50/40 border-dashed border-stone-300 hover:border-emerald-500 hover:bg-emerald-100/30"
                      }`}
                    >
                      {existing ? (
                        <>
                          <span className="text-3xl">{itemInfo?.emoji || "🏠"}</span>
                          <span className="text-[10px] font-bold text-emerald-900 mt-1 line-clamp-1">
                            {existing.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-stone-400">+ Bina</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
