import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Mail, Lock, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react";

interface ResetPasswordModalProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  onClose,
  onBackToLogin
}) => {
  const { language, resetPassword, registeredAccounts } = useApp();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const normalizedEmail = email.trim().toLowerCase();
    const exists = registeredAccounts.some(
      (u) => u.email.trim().toLowerCase() === normalizedEmail
    );

    if (!normalizedEmail) {
      setErrorMsg(
        language === "en"
          ? "Please enter your registered email address."
          : "Sila masukkan emel berdaftar anda."
      );
      return;
    }

    if (!exists) {
      setErrorMsg(
        language === "en"
          ? "No account found matching this email address."
          : "Emel ini tidak dijumpai dalam rekod pendaftaran sistem."
      );
      return;
    }

    setStep(2);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newPassword || !confirmPassword) {
      setErrorMsg(
        language === "en"
          ? "Please fill in all password fields."
          : "Sila isi semua ruangan kata laluan."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(
        language === "en"
          ? "Passwords do not match!"
          : "Kata laluan dan pengesahan kata laluan tidak sama!"
      );
      return;
    }

    const res = resetPassword(email, newPassword);

    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      onBackToLogin();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl shadow-2xs">
            🔑
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            {language === "en" ? "Reset Password" : "Reset Kata Laluan"}
          </h2>
          <p className="text-stone-500 text-xs">
            {step === 1
              ? language === "en"
                ? "Enter your registered email address to verify your account."
                : "Masukkan emel berdaftar anda untuk pengesahan rekod sistem."
              : language === "en"
              ? "Create a new password for your parent account."
              : "Cipta kata laluan baharu untuk akaun ibu bapa anda."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-stone-700 mb-1">
                {language === "en" ? "Registered Email Address *" : "Emel Berdaftar *"}`
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  placeholder="nama@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{language === "en" ? "Verify Email" : "Sahkan Emel Berdaftar"}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === "en" ? "Email verified:" : "Emel disahkan:"}{" "}
                <strong className="font-extrabold">{email}</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-stone-700 mb-1">
                {language === "en" ? "New Password *" : "Kata Laluan Baharu *"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-stone-700 mb-1">
                {language === "en" ? "Confirm New Password *" : "Sahkan Kata Laluan Baharu *"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === "en" ? "Update Password" : "Kemaskini Kata Laluan"}</span>
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-stone-100 text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === "en" ? "Back to Log In" : "Kembali ke Log Masuk"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
