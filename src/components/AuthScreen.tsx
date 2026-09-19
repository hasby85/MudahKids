import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { MembershipPlan } from "../types";
import {
  Lock,
  Mail,
  User,
  Phone,
  Crown,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface AuthScreenProps {
  initialTab?: "login" | "register";
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialTab = "login",
  onSuccess
}) => {
  const {
    language,
    loginAccount,
    registerAccount,
    resetPassword,
    registeredAccounts,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<"login" | "register" | "reset">(initialTab);

  // Sync with initialTab if changed from parent
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAccessCode, setRegAccessCode] = useState("");
  const [regPlan] = useState<MembershipPlan>("PREMIUM");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Reset password form state
  const [resetEmail, setResetEmail] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError(
        language === "en"
          ? "Please enter both email/phone and password."
          : "Sila masukkan emel/telefon dan kata laluan."
      );
      return;
    }

    setLoginLoading(true);
    try {
      const res = await loginAccount(loginEmail.trim(), loginPassword.trim());
      if (!res.success) {
        setLoginError(res.message);
      } else {
        onSuccess();
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Submit Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setRegError(
        language === "en"
          ? "Please fill in all required fields."
          : "Sila lengkapkan semua maklumat yang diperlukan."
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(
        language === "en"
          ? "Passwords do not match!"
          : "Kata laluan dan pengesahan kata laluan tidak sepadan!"
      );
      return;
    }

    if (!regAccessCode.trim()) {
      setRegError(
        language === "en"
          ? "Please enter the activation access code received in your payment confirmation email."
          : "Sila masukkan kod akses pengaktifan yang dihantar melalui emel pengesahan pembayaran anda."
      );
      return;
    }

    if (regAccessCode.trim() !== "MudahKids2026") {
      setRegError(
        language === "en"
          ? "Invalid access code! Please check your email for the correct code."
          : "Kod akses tidak sah! Sila semak emel anda untuk mendapatkan kod akses yang betul."
      );
      return;
    }

    setRegLoading(true);
    try {
      const res = await registerAccount({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword.trim(),
        passwordConfirm: regConfirmPassword.trim(),
        role: "parent",
        plan: regPlan,
        accessCode: regAccessCode.trim()
      });

      if (!res.success) {
        setRegError(res.message);
      } else {
        onSuccess();
      }
    } finally {
      setRegLoading(false);
    }
  };

  // Reset Password Step 1: Verify Email
  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");

    const normEmail = resetEmail.trim().toLowerCase();
    if (!normEmail) {
      setResetError(
        language === "en"
          ? "Please enter your registered email."
          : "Sila masukkan emel berdaftar anda."
      );
      return;
    }

    const exists = registeredAccounts.some(
      (u) => u.email.trim().toLowerCase() === normEmail
    );

    if (!exists) {
      setResetError(
        language === "en"
          ? "No registered account found with this email."
          : "Tiada akaun berdaftar dengan emel ini."
      );
      return;
    }

    setResetStep(2);
  };

  // Reset Password Step 2: Set New Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");

    if (!resetNewPassword || !resetConfirmPassword) {
      setResetError(
        language === "en"
          ? "Please fill in all password fields."
          : "Sila isi semua ruangan kata laluan."
      );
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError(
        language === "en"
          ? "Passwords do not match!"
          : "Kata laluan dan pengesahan kata laluan tidak sama!"
      );
      return;
    }

    setResetLoading(true);
    try {
      const res = await resetPassword(resetEmail, resetNewPassword);
      if (!res.success) {
        setResetError(res.message);
      } else {
        setActiveTab("login");
        setResetStep(1);
        setLoginEmail(resetEmail);
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-70px)] bg-gradient-to-b from-stone-100/80 via-emerald-50/20 to-stone-100/60 py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        {/* Brand Header Banner */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>MudahKids • Portal Keluarga & Anak Soleh</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Selamat Datang ke <span className="text-emerald-600">MudahKids</span>
          </h2>

          <p className="text-xs sm:text-sm font-semibold text-stone-600 max-w-md mx-auto">
            {language === "en"
              ? "Sign in or register your parent account to manage your family's daily missions, prayer tracking, and games."
              : "Log masuk atau daftar akaun ibu bapa untuk mengurus amalan solat anak, pembelajaran jawi & hafazan, dan arked permainan."}
          </p>
        </div>

        {/* Auth Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-stone-200/80 backdrop-blur-sm">
          {/* Segmented Control Tabs */}
          {activeTab !== "reset" ? (
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-stone-100 border border-stone-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setLoginError("");
                }}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "login"
                    ? "bg-white text-emerald-800 shadow-sm border border-stone-200"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>{language === "en" ? "Sign In" : "Log Masuk"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setRegError("");
                }}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "register"
                    ? "bg-white text-emerald-800 shadow-sm border border-stone-200"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500" />
                <span>{language === "en" ? "Register Account" : "Daftar Akaun"}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setResetError("");
                  setResetStep(1);
                }}
                className="text-xs font-extrabold text-stone-600 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>←</span>
                <span>{language === "en" ? "Back to Sign In" : "Kembali ke Log Masuk"}</span>
              </button>
              <span className="text-xs font-black text-amber-600">
                {language === "en" ? "Reset Password" : "Tetapan Semula Kata Laluan"}
              </span>
            </div>
          )}

          {/* TAB 1: LOG IN */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div>{loginError}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                  {language === "en" ? "Registered Email / Phone / Username *" : "Emel / No. Telefon / Username Berdaftar *"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="nama@example.com / 012XXXXXXX"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-stone-700">
                    {language === "en" ? "Password *" : "Kata Laluan *"}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("reset");
                      setResetStep(1);
                      setResetEmail(loginEmail);
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    {language === "en" ? "Forgot Password?" : "Lupa Kata Laluan?"}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 hover:scale-101"
              >
                {loginLoading ? (
                  <span>{language === "en" ? "Logging in..." : "Sedang Log Masuk..."}</span>
                ) : (
                  <>
                    <span>{language === "en" ? "Sign In to Dashboard" : "Log Masuk ke Dashboard"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div>{regError}</div>
                </div>
              )}

              {/* Package Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-xs text-amber-300">
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>PAKEJ LENGKAP KELUARGA MUDAHKIDS</span>
                  </div>
                  <span className="text-[10px] font-black text-amber-300 bg-emerald-900/70 px-2 py-0.5 rounded-full border border-amber-300/40">
                    Akses Selamanya
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100">
                  Satu akaun untuk seisi keluarga • Sehingga 5 Profil Anak • Modul Solat, Jawi, Hafazan & Permainan
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-700 mb-1">
                  {language === "en" ? "Parent Name *" : "Nama Ibu Bapa / Penjaga *"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Contoh: Encik Hafiz & Puan Sarah"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    {language === "en" ? "Email Address *" : "Emel Berdaftar *"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="nama@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    {language === "en" ? "WhatsApp Phone No." : "No. WhatsApp"}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      placeholder="012-3456789"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    {language === "en" ? "Password *" : "Kata Laluan *"}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-stone-700 mb-1">
                    {language === "en" ? "Confirm Password *" : "Sahkan Kata Laluan *"}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Access Code Input */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>{language === "en" ? "Activation Access Code *" : "Kod Akses Pengaktifan *"}</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300">
                    {language === "en" ? "Check Email ✉️" : "Semak Emel ✉️"}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder={language === "en" ? "Enter code from payment confirmation email" : "Masukkan kod dari emel pengesahan bayaran"}
                  value={regAccessCode}
                  onChange={(e) => setRegAccessCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                  {language === "en"
                    ? "The activation access code will be sent to your email once your payment is completed. Please check your inbox or spam folder."
                    : "Kod akses pengaktifan akan diberikan melalui emel sebaik sahaja anda selesai membuat pembayaran. Sila semak emel anda untuk mendapatkan kod tersebut."}
                </p>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 hover:scale-101"
              >
                {regLoading ? (
                  <span>{language === "en" ? "Registering..." : "Sedang Mendaftar..."}</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 fill-stone-950" />
                    <span>{language === "en" ? "Complete Registration" : "Sahkan & Daftar Akaun"}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: RESET PASSWORD */}
          {activeTab === "reset" && (
            <div className="space-y-4">
              {resetError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div>{resetError}</div>
                </div>
              )}

              {resetStep === 1 ? (
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-black text-stone-900">
                      {language === "en" ? "Enter Registered Email" : "Masukkan Emel Berdaftar"}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {language === "en"
                        ? "We will check your email to reset your parent account password."
                        : "Sistem akan mengesahkan emel untuk menetapkan semula kata laluan anda."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      {language === "en" ? "Registered Email Address *" : "Alamat Emel Berdaftar *"}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        placeholder="nama@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        autoCapitalize="none"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === "en" ? "Verify Email" : "Sahkan Emel"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Emel disahkan: {resetEmail}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      {language === "en" ? "New Password *" : "Kata Laluan Baharu *"}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      {language === "en" ? "Confirm New Password *" : "Sahkan Kata Laluan Baharu *"}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={resetConfirmPassword}
                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {resetLoading ? (
                      <span>{language === "en" ? "Updating..." : "Menyimpan Kata Laluan..."}</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === "en" ? "Save New Password" : "Simpan Kata Laluan Baharu"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Security / Trust Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-500 font-semibold">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Data Tersimpan Selamat & Diselaraskan Awan</span>
          </div>
          <span>•</span>
          <div>Untuk Seisi Keluarga & Kanak-kanak</div>
        </div>
      </div>
    </div>
  );
};
