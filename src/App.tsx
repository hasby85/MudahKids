import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
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
import { DocumentationModal } from "./components/DocumentationModal";
import { MembershipPlan } from "./types";

const MainContent: React.FC = () => {
  const { role, user, toast } = useApp();
  const [view, setView] = useState<"landing" | "app" | "jawi" | "hafazan" | "world" | "shop" | "jakim">("landing");
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
        onOpenRegisterModal={() => handleStartRegister("PREMIUM")}
        onOpenLoginModal={handleOpenLogin}
        onLogout={() => setView("landing")}
        onOpenJakimNotes={() => setView("jakim")}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {view === "landing" && !user ? (
          <LandingPage
            onStartRegistration={handleStartRegister}
            onOpenLogin={handleOpenLogin}
            onExploreApp={() => setView("app")}
          />
        ) : (
          <>
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
              </div>

              <button
                onClick={() => setView(view === "landing" ? "app" : "landing")}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 underline px-2 cursor-pointer"
              >
                {view === "landing" ? "Kembali ke Papan Pemuka" : "Lihat Halaman Laman Utama"}
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
            {view === "world" && <NusantaraWorldMap />}
            {view === "shop" && <ShopAndLeaderboard />}
            {view === "jakim" && <JakimReferenceModule />}
          </>
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
