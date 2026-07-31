import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Lock, Mail, LogIn, KeyRound, UserPlus } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
  onOpenRegister: () => void;
  onOpenResetPassword: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onSuccess,
  onOpenRegister,
  onOpenResetPassword
}) => {
  const { language, loginAccount } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg(
        language === "en"
          ? "Please enter both email and password."
          : "Sila masukkan emel dan kata laluan."
      );
      return;
    }

    const result = loginAccount(email, password);

    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      onSuccess();
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
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl shadow-2xs">
            🔑
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            {language === "en" ? "Parent Log In" : "Log Masuk Ibu Bapa"}
          </h2>
          <p className="text-stone-500 text-xs">
            {language === "en"
              ? "Enter your registered email and password to access your dashboard."
              : "Masukkan emel dan kata laluan yang didaftarkan untuk mengakses akaun anda."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-1">
              {language === "en" ? "Registered Email *" : "Emel Berdaftar *"}
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-extrabold text-stone-700">
                {language === "en" ? "Password *" : "Kata Laluan *"}
              </label>
              <button
                type="button"
                onClick={onOpenResetPassword}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>{language === "en" ? "Forgot password?" : "Lupa kata laluan?"}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{language === "en" ? "Log In" : "Log Masuk"}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-600">
            {language === "en" ? "Don't have an account yet?" : "Belum mendaftar akaun?"}{" "}
            <button
              type="button"
              onClick={onOpenRegister}
              className="font-extrabold text-emerald-700 hover:underline cursor-pointer inline-flex items-center gap-1 ml-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === "en" ? "Register Parent Account" : "Daftar Akaun Ibu Bapa"}</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
