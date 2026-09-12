import React, { useState } from "react";
import {
  PRD_DOCUMENTATION,
  DATABASE_SCHEMA_DOCS,
  ER_DIAGRAM_ASCII,
  WIREFRAMES_ASCII,
  FORMULAS_AND_GAMIFICATION,
  CLOUDFLARE_DEPLOYMENT_GUIDE
} from "../data/documentationData";
import { X, BookOpen, Database, Code, Layout, Cpu, ShieldAlert, Check } from "lucide-react";

interface DocumentationModalProps {
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "prd" | "schema" | "er" | "wireframes" | "formulas" | "cloudflare"
  >("prd");

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-stone-200 relative my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-black text-stone-900">Seni Bina & Dokumentasi PRD MudahKids</h2>
              <p className="text-xs text-stone-500">
                Spesifikasi penuh PRD, Skema Supabase SQL, ER Diagram & Panduan Cloudflare.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-stone-200 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab("prd")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "prd" ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700"
            }`}
          >
            📋 PRD
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "schema" ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700"
            }`}
          >
            💾 Supabase SQL
          </button>
          <button
            onClick={() => setActiveTab("er")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "er" ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700"
            }`}
          >
            🔀 ER Diagram
          </button>
          <button
            onClick={() => setActiveTab("wireframes")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "wireframes" ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700"
            }`}
          >
            🖼️ Wireframes
          </button>
          <button
            onClick={() => setActiveTab("formulas")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "formulas" ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700"
            }`}
          >
            🧮 Rumus & Gamifikasi
          </button>
          <button
            onClick={() => setActiveTab("cloudflare")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "cloudflare" ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700"
            }`}
          >
            ☁️ Cloudflare Guide
          </button>
        </div>

        {/* Scrollable Content View */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs font-sans text-stone-800">
          {activeTab === "prd" && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-emerald-800">{PRD_DOCUMENTATION.title}</h3>
              {PRD_DOCUMENTATION.sections.map((sec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <h4 className="font-extrabold text-stone-900 text-sm">{sec.heading}</h4>
                  <p className="whitespace-pre-line text-stone-600 leading-relaxed">{sec.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "schema" && (
            <div className="space-y-2">
              <h3 className="text-base font-black text-emerald-800">{DATABASE_SCHEMA_DOCS.title}</h3>
              <pre className="p-4 bg-stone-900 text-emerald-400 rounded-2xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                {DATABASE_SCHEMA_DOCS.sqlScript}
              </pre>
            </div>
          )}

          {activeTab === "er" && (
            <div className="space-y-2">
              <h3 className="text-base font-black text-emerald-800">Entity Relationship Diagram (ERD)</h3>
              <pre className="p-4 bg-stone-900 text-amber-300 rounded-2xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                {ER_DIAGRAM_ASCII}
              </pre>
            </div>
          )}

          {activeTab === "wireframes" && (
            <div className="space-y-2">
              <h3 className="text-base font-black text-emerald-800">UI Wireframes (ASCII)</h3>
              <pre className="p-4 bg-stone-900 text-sky-300 rounded-2xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                {WIREFRAMES_ASCII}
              </pre>
            </div>
          )}

          {activeTab === "formulas" && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-emerald-800">Rumus Gamifikasi & Formula Ekonomi</h3>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <div>
                  <strong>Rumus XP Level:</strong> <code className="bg-white px-2 py-0.5 rounded font-mono">{FORMULAS_AND_GAMIFICATION.xpFormula}</code>
                </div>
                <div>
                  <strong>Rumus Ganjaran Syiling:</strong> <code className="bg-white px-2 py-0.5 rounded font-mono">{FORMULAS_AND_GAMIFICATION.coinFormula}</code>
                </div>
                <div>
                  <strong>Formula Peningkatan Level:</strong> <code className="bg-white px-2 py-0.5 rounded font-mono">{FORMULAS_AND_GAMIFICATION.levelFormula}</code>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-stone-900">Peraturan Gamifikasi:</h4>
                <ul className="list-disc list-inside space-y-1 text-stone-600">
                  {FORMULAS_AND_GAMIFICATION.rules.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "cloudflare" && (
            <div className="space-y-2">
              <h3 className="text-base font-black text-emerald-800">Panduan Cloudflare Deployment</h3>
              <pre className="p-4 bg-stone-900 text-emerald-300 rounded-2xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                {CLOUDFLARE_DEPLOYMENT_GUIDE}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
