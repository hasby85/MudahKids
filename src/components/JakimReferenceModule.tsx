import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { JakimNote } from "../types";
import {
  BookOpen,
  Search,
  BookMarked,
  Sparkles,
  Heart,
  PlusCircle,
  X,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  UserCheck,
  Check
} from "lucide-react";

interface JakimReferenceModuleProps {
  onClose?: () => void;
}

export const JakimReferenceModule: React.FC<JakimReferenceModuleProps> = ({ onClose }) => {
  const { language, role, showToast, jakimNotes, addJakimNote } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<"all" | "boy" | "girl">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNote, setActiveNote] = useState<JakimNote | null>(null);

  // Parent Add Note Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<JakimNote["category"]>("custom_parent");
  const [newArabicText, setNewArabicText] = useState("");
  const [newLatinText, setNewLatinText] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newExplanation, setNewExplanation] = useState("");

  const filteredNotes = jakimNotes.filter((note) => {
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    const matchesGender =
      genderFilter === "all" || note.genderTarget === "all" || note.genderTarget === genderFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.latinText && note.latinText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesGender && matchesSearch;
  });

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExplanation.trim()) return;

    addJakimNote({
      category: newCategory,
      title: newTitle.trim(),
      arabicText: newArabicText.trim() || undefined,
      latinText: newLatinText.trim() || undefined,
      translation: newTranslation.trim() || newExplanation.trim(),
      explanation: newExplanation.trim(),
      genderTarget: genderFilter,
      addedByParent: true
    });

    setShowAddModal(false);
    setNewTitle("");
    setNewArabicText("");
    setNewLatinText("");
    setNewTranslation("");
    setNewExplanation("");
  };

  return (
    <div className="bg-stone-50 min-h-screen p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl font-black select-none pointer-events-none">
          📖
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-stone-900 font-black text-xs px-3 py-1 rounded-full shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === "en" ? "JAKIM Standard Approved" : "Piawaian Agama Islam JAKIM"}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {language === "en" ? "Prayer Guide & Islamic Reference" : "Panduan Solat & Rujukan Agama"}
            </h1>
            <p className="text-emerald-100 text-xs md:text-sm font-medium leading-relaxed">
              Panduan lengkap solat fardhu bagi anak lelaki & perempuan, 13 rukun solat, wuduk sempurna, dan doa harian mengikut ketetapan Jabatan Kemajuan Agama Islam Malaysia (JAKIM).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {role === "parent" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === "en" ? "Add Custom Note" : "Tambah Nota Ibu Bapa"}</span>
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 md:p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "en" ? "Search JAKIM notes, solat, wuduk, doa..." : "Cari nota solat, wuduk, doa, rukun..."}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Gender Target Selector */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
            <button
              onClick={() => setGenderFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                genderFilter === "all" ? "bg-white text-emerald-800 shadow-2xs" : "text-stone-600"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setGenderFilter("boy")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                genderFilter === "boy" ? "bg-sky-600 text-white shadow-2xs" : "text-stone-600"
              }`}
            >
              👦 Anak Lelaki
            </button>
            <button
              onClick={() => setGenderFilter("girl")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                genderFilter === "girl" ? "bg-pink-600 text-white shadow-2xs" : "text-stone-600"
              }`}
            >
              👧 Anak Perempuan
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            📚 Semua Nota ({jakimNotes.length})
          </button>
          <button
            onClick={() => setSelectedCategory("bacaan_solat")}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === "bacaan_solat"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <span>📖 Bacaan Dalam Solat</span>
          </button>
          <button
            onClick={() => setSelectedCategory("doa_harian")}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === "doa_harian"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <span>🤲 Doa Harian (Al-Quran)</span>
          </button>
          <button
            onClick={() => setSelectedCategory("solat_lelaki")}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === "solat_lelaki"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <span>👦 Solat Lelaki</span>
          </button>
          <button
            onClick={() => setSelectedCategory("solat_perempuan")}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === "solat_perempuan"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <span>🧕 Solat Perempuan</span>
          </button>
          <button
            onClick={() => setSelectedCategory("syarat_rukun")}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === "syarat_rukun"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <span>✨ 13 Rukun Solat</span>
          </button>
          <button
            onClick={() => setSelectedCategory("wuduk")}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === "wuduk"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <span>💧 Wuduk Sempurna</span>
          </button>
        </div>
      </div>

      {/* Grid List of Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => setActiveNote(note)}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      note.category === "bacaan_solat"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : note.category === "doa_harian"
                        ? "bg-teal-100 text-teal-900 border border-teal-300"
                        : note.category === "wuduk"
                        ? "bg-cyan-100 text-cyan-900 border border-cyan-300"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {note.category === "bacaan_solat"
                      ? "📖 Bacaan Solat"
                      : note.category === "doa_harian"
                      ? "🤲 Doa Harian"
                      : note.category === "wuduk"
                      ? "💧 Wuduk"
                      : note.category === "syarat_rukun"
                      ? "✨ 13 Rukun"
                      : note.category === "solat_lelaki"
                      ? "👦 Solat Lelaki"
                      : note.category === "solat_perempuan"
                      ? "🧕 Solat Perempuan"
                      : "📝 Nota"}
                  </span>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      note.genderTarget === "boy"
                        ? "bg-sky-100 text-sky-800"
                        : note.genderTarget === "girl"
                        ? "bg-pink-100 text-pink-800"
                        : "text-stone-500 bg-stone-100"
                    }`}
                  >
                    {note.genderTarget === "boy"
                      ? "👦 Lelaki"
                      : note.genderTarget === "girl"
                      ? "👧 Perempuan"
                      : "✨ Umum"}
                  </span>
                </div>

                {note.addedByParent && (
                  <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Nota Ibu Bapa
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-stone-900 text-base group-hover:text-emerald-700 transition-colors">
                {note.title}
              </h3>
              <p className="text-stone-600 text-xs line-clamp-2">{note.explanation}</p>

              {note.arabicText && (
                <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-right font-serif text-lg font-bold text-amber-950">
                  {note.arabicText}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-extrabold">
              <span>{note.steps ? `${note.steps.length} Langkah Panduan` : "Lihat Nota Lengkap"}</span>
              <span className="text-stone-400 group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-extrabold text-stone-800">Tiada Nota Dijumpai</h3>
          <p className="text-xs text-stone-500">
            Cuba tukar kata kunci carian atau tetapan kategori di atas.
          </p>
        </div>
      )}

      {/* Detail Modal for Selected Note */}
      {activeNote && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setActiveNote(null)}
              className="absolute top-4 right-4 p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Rujukan Piawaian JAKIM</span>
              </div>
              <h2 className="text-xl font-black text-stone-900">{activeNote.title}</h2>
              <p className="text-xs text-stone-600 font-medium">{activeNote.explanation}</p>
            </div>

            {/* Arabic / Latin Reading Box */}
            {(activeNote.arabicText || activeNote.latinText) && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-3xl border border-amber-200 space-y-3 text-center">
                {activeNote.arabicText && (
                  <div className="text-2xl md:text-3xl font-serif font-bold text-amber-950 dir-rtl leading-loose">
                    {activeNote.arabicText}
                  </div>
                )}
                {activeNote.latinText && (
                  <div className="text-xs font-bold text-amber-900 italic">
                    "{activeNote.latinText}"
                  </div>
                )}
                {activeNote.translation && (
                  <div className="text-xs font-semibold text-stone-700 pt-2 border-t border-amber-200/60">
                    Maksud: {activeNote.translation}
                  </div>
                )}
              </div>
            )}

            {/* Steps Timeline if present */}
            {activeNote.steps && activeNote.steps.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-500">
                  Langkah & Tatacara Mengikut Tertib:
                </h3>
                <div className="space-y-2.5">
                  {activeNote.steps.map((s) => (
                    <div
                      key={s.stepNumber}
                      className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {s.illustrationEmoji || s.stepNumber}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="font-extrabold text-stone-900 text-xs">{s.title}</div>
                        <div className="text-stone-600 text-xs leading-relaxed">{s.detail}</div>

                        {(s.arabicText || s.latinText) && (
                          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-1.5 mt-2">
                            {s.arabicText && (
                              <div className="text-lg md:text-xl font-serif font-bold text-amber-950 text-right dir-rtl leading-relaxed">
                                {s.arabicText}
                              </div>
                            )}
                            {s.latinText && (
                              <div className="text-[11px] font-bold text-amber-900 italic">
                                "{s.latinText}"
                              </div>
                            )}
                            {s.translation && (
                              <div className="text-[11px] text-stone-700 font-medium pt-1 border-t border-amber-200/60">
                                Maksud: {s.translation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveNote(null)}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
              >
                Faham & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Parent to Add Custom JAKIM Note */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-900">Tambah Nota / Rujukan Agama Ibu Bapa</h3>
              <p className="text-xs text-stone-500">
                Tambah nota panduan solat, doa, atau hafazan tambahan untuk rujukan anak-anak.
              </p>
            </div>

            <form onSubmit={handleAddNoteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">Tajuk Nota</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Doa Qunut Solat Subuh / Adab Hormat Guru"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="solat_lelaki">Solat Lelaki</option>
                  <option value="solat_perempuan">Solat Perempuan</option>
                  <option value="syarat_rukun">Rukun / Niat Solat</option>
                  <option value="wuduk">Panduan Wuduk</option>
                  <option value="doa_harian">Doa Harian</option>
                  <option value="custom_parent">Nota Am Ibu Bapa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">Teks Arab (Pilihan)</label>
                <input
                  type="text"
                  value={newArabicText}
                  onChange={(e) => setNewArabicText(e.target.value)}
                  placeholder="Contoh: اَللّهُمَّ اهْدِنِيْ فِيْمَنْ هَدَيْتَ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">Bacaan Rumi (Pilihan)</label>
                <input
                  type="text"
                  value={newLatinText}
                  onChange={(e) => setNewLatinText(e.target.value)}
                  placeholder="Contoh: Allahummahdini fiman hadait"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">Penerangan / Maksud</label>
                <textarea
                  rows={3}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Terangkan secara jelas untuk anak fahami..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-2xs transition-all cursor-pointer"
                >
                  Simpan Nota Baharu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
