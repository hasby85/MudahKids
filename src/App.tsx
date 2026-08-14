import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { SalesPage } from "./components/SalesPage";
import { RegisterModal } from "./components/RegisterModal";
import { LoginModal } from "./components/LoginModal";
import { ResetPasswordModal } from "./components/ResetPasswordModal";
import { ParentDashboard } from "./components/ParentDashboard";
import { ChildDashboard } from "./components/ChildDashboard";
import { JawiLearningModule } from "./components/JawiLearningModule";
import { NusantaraWorldMap } from "./components/NusantaraWorldMap";
import { ShopAndLeaderboard } from "./components/ShopAndLeaderboard";
import { JakimReferenceModule } from "./components/JakimReferenceModule";
import { HafazanLearningModule } from "./components/HafazanLearningModule";
import { QuranIqraDiary } from "./components/QuranIqraDiary";
import { SolatTrackerModule } from "./components/SolatTrackerModule";
import { DocumentationModal } from "./components/DocumentationModal";
import { MembershipPlan } from "./types";

const MainContent: React.FC = () => {
  const { role, user, toast } = useApp();
  const [view, setView] = useState<"landing" | "sales" | "app" | "solat" | "jawi" | "hafazan" | "world" | "shop" | "jakim" | "diari">("sales");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedPlanForRegister, setSelectedPlanForRegister] = useState<MembershipPlan>("PREMIUM");
  const [showDocsModal, setShowDocsModal] = useState(false);

  const handleStartRegister = (plan: MembershipPlan) => {
    setSelectedPlanForRegister(plan);
    setShowLoginModal(false);
    setShowResetPasswordModal(false);
    setShowRegisterModal(true);
  };

  const handleOpenLogin = () => {
    setShowRegisterModal(false);
    setShowResetPasswordModal(false);
    setShowLoginModal(true);
  };

  const handleOpenResetPassword = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowResetPasswordModal(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col selection:bg-emerald-200">
      {/* Global Header */}
      <Header
        currentView={view}
        onOpenRegisterModal={() => handleStartRegister("PREMIUM")}
        onOpenLoginModal={handleOpenLogin}
        onLogout={() => setView("landing")}
        onOpenJakimNotes={() => setView("jakim")}
        onOpenSalesPage={() => setView("sales")}
      />

      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-2xl shadow-xl font-extrabold text-xs flex items-center gap-2 border ${
              toast.type === "success"
                ? "bg-emerald-600 text-white border-emerald-500"
                : toast.type === "error"
                ? "bg-red-600 text-white border-red-500"
                : "bg-stone-900 text-amber-300 border-stone-800"
            }`}
          >
            <span>{toast.type === "success" ? "🎉" : toast.type === "error" ? "⚠️" : "📢"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container View Switcher */}
      <main className="flex-1 w-full mx-auto">
        {view === "sales" ? (
          <SalesPage
            onStartRegistration={handleStartRegister}
            onExploreApp={() => setView("app")}
          />
        ) : view === "landing" && !user ? (
          <LandingPage
            onStartRegistration={handleStartRegister}
            onOpenLogin={handleOpenLogin}
            onExploreApp={() => setView("app")}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Left Vertical Sidebar Navigation */}
              <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20">
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-3xl border-2 border-stone-200 shadow-sm">
                  <div className="text-[11px] font-black text-stone-400 uppercase tracking-wider px-3 pt-1 pb-2 hidden lg:block">
                    📌 Navigation Menu
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-2">
                    <button
                      onClick={() => setView("app")}
                      className={`px-3.5 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center justify-start gap-3 transition-all cursor-pointer border text-left ${
                        view === "app"
                          ? "bg-amber-400 text-stone-900 border-amber-300 shadow-sm scale-102"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-amber-100"
                      }`}
                    >
                      <span className="text-lg">🏠</span>
                      <span className="truncate">{role === "parent" ? "Pemuka Utama" : "Utama & Misi"}</span>
                    </button>

                    <button
                      onClick={() => setView("jawi")}
                      className={`px-3.5 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center justify-start gap-3 transition-all cursor-pointer border text-left ${
                        view === "jawi"
                          ? "bg-sky-500 text-white border-sky-400 shadow-sm scale-102"
                          : "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100"
                      }`}
                    >
                      <span className="text-lg">✏️</span>
                      <span className="truncate">Modul Jawi</span>
                    </button>

                    <button
                      onClick={() => setView("hafazan")}
                      className={`px-3.5 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center justify-start gap-3 transition-all cursor-pointer border text-left ${
                        view === "hafazan"
                          ? "bg-teal-600 text-white border-teal-500 shadow-sm scale-102"
                          : "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100"
                      }`}
                    >
                      <span className="text-lg">📜</span>
                      <span className="truncate">Modul Hafazan</span>
                    </button>

                    <button
                      onClick={() => setView("solat")}
                      className={`px-3.5 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center justify-start gap-3 transition-all cursor-pointer border text-left ${
                        view === "solat"
                          ? "bg-amber-500 text-stone-900 border-amber-400 shadow-sm scale-102"
                          : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <span className="text-lg">🕌</span>
                      <span className="truncate">Solat 5 Waktu</span>
                    </button>

                    <button
                      onClick={() => setView("diari")}
                      className={`px-3.5 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center justify-start gap-3 transition-all cursor-pointer border text-left ${
                        view === "diari"
                          ? "bg-rose-500 text-white border-rose-400 shadow-sm scale-102"
                          : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                      }`}
                    >
                      <span className="text-lg">📖</span>
                      <span className="truncate">Iqra & Al Quran</span>
                    </button>

                    <button
                      onClick={() => setView("world")}
                      className={`px-3.5 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center justify-start gap-3 transition-all cursor-pointer border text-left ${
                        view === "world"
                          ? "bg-purple-600 text-white border-purple-500 shadow-sm scale-102"
                          : "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
                      }`}
                    >
                      <span className="text-lg">🗺️</span>
                      <span className="truncate">Nusantara & Bina</span>
                    </button>

                    <button
                      onClick={() => setView("shop")}
                      className={`px-3.5 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center justify-start gap-3 transition-all cursor-pointer border text-left ${
                        view === "shop"
                          ? "bg-orange-500 text-white border-orange-400 shadow-sm scale-102"
                          : "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
                      }`}
                    >
                      <span className="text-lg">🛍️</span>
                      <span className="truncate">Kedai & Carta</span>
                    </button>

                    <button
                      onClick={() => setView("jakim")}
                      className={`px-3.5 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center justify-start gap-3 transition-all cursor-pointer border text-left ${
                        view === "jakim"
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-sm scale-102"
                          : "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      <span className="text-lg">📘</span>
                      <span className="truncate">Panduan & Rujukan</span>
                    </button>
                  </div>
                </div>
              </aside>

              {/* Main Content Area on the Right */}
              <div className="flex-1 w-full min-w-0">
                {view === "app" && (
                  <>
                    {role === "parent" && <ParentDashboard onOpenLoginModal={handleOpenLogin} />}
                    {role === "child" && (
                      <ChildDashboard
                        onNavigateToWorld={() => setView("world")}
                        onNavigateToShop={() => setView("shop")}
                        onNavigateToLeaderboard={() => setView("shop")}
                        onNavigateToJawi={() => setView("jawi")}
                        onNavigateToHafazan={() => setView("hafazan")}
                      />
                    )}
                  </>
                )}

                {view === "solat" && <SolatTrackerModule />}
                {view === "jawi" && <JawiLearningModule />}
                {view === "hafazan" && <HafazanLearningModule />}
                {view === "diari" && <QuranIqraDiary />}
                {view === "world" && <NusantaraWorldMap />}
                {view === "shop" && <ShopAndLeaderboard />}
                {view === "jakim" && <JakimReferenceModule />}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Registration Modal */}
      {showRegisterModal && (
        <RegisterModal
          initialPlan={selectedPlanForRegister}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false);
            setView("app");
          }}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            setView("app");
          }}
          onOpenRegister={() => handleStartRegister("PREMIUM")}
          onOpenResetPassword={handleOpenResetPassword}
        />
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <ResetPasswordModal
          onClose={() => setShowResetPasswordModal(false)}
          onBackToLogin={handleOpenLogin}
        />
      )}

      {/* Documentation Modal */}
      {showDocsModal && (
        <DocumentationModal onClose={() => setShowDocsModal(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
