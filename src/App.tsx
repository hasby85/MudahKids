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
import { DocumentationModal } from "./components/DocumentationModal";
import { MembershipPlan } from "./types";

const MainContent: React.FC = () => {
  const { role, user, toast } = useApp();
  const [view, setView] = useState<"landing" | "sales" | "app" | "jawi" | "hafazan" | "world" | "shop" | "jakim" | "diari">("sales");
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
            {/* View Sub-navigation Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
                <button
                  onClick={() => setView("app")}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    view === "app" ? "bg-emerald-600 text-white shadow-2xs font-extrabold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  🏠 {role === "parent" ? "Papan Pemuka Utama" : "Misi Hari Ini"}
                </button>
                <button
                  onClick={() => setView("jawi")}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    view === "jawi" ? "bg-emerald-600 text-white shadow-2xs font-extrabold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  ✏️ Modul Jawi
                </button>
                <button
                  onClick={() => setView("hafazan")}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    view === "hafazan" ? "bg-emerald-600 text-white shadow-2xs font-extrabold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  📜 Modul Hafazan
                </button>
                <button
                  onClick={() => setView("diari")}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    view === "diari" ? "bg-emerald-600 text-white shadow-2xs font-extrabold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  📖 Diari Bacaan Iqra/Quran
                </button>
                <button
                  onClick={() => setView("world")}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    view === "world" ? "bg-emerald-600 text-white shadow-2xs font-extrabold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  🗺️ Nusantara & Bina
                </button>
                <button
                  onClick={() => setView("shop")}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    view === "shop" ? "bg-emerald-600 text-white shadow-2xs font-extrabold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  🛍️ Kedai & Carta
                </button>
                <button
                  onClick={() => setView("jakim")}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    view === "jakim" ? "bg-emerald-600 text-white shadow-2xs font-extrabold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  📖 Panduan JAKIM
                </button>
                <button
                  onClick={() => setView("sales")}
                  className="px-4 py-2 rounded-xl transition-all cursor-pointer bg-amber-400 hover:bg-amber-500 text-stone-900 font-extrabold"
                >
                  Halaman Jualan RM39
                </button>
              </div>

              <button
                onClick={() => setView("sales")}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline px-2 cursor-pointer"
              >
                Lihat Halaman Jualan RM39/Tahun
              </button>
            </div>

            {/* Active View Display */}
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

            {view === "jawi" && <JawiLearningModule />}
            {view === "hafazan" && <HafazanLearningModule />}
            {view === "diari" && <QuranIqraDiary />}
            {view === "world" && <NusantaraWorldMap />}
            {view === "shop" && <ShopAndLeaderboard />}
            {view === "jakim" && <JakimReferenceModule />}
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
