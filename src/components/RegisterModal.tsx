import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MembershipPlan } from "../types";
import { X, Lock, Mail, User, Phone, Crown, CheckCircle } from "lucide-react";

interface RegisterModalProps {
  initialPlan: MembershipPlan;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  initialPlan,
  onClose,
  onSuccess
}) => {
  const { language, registerAccount } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan>(initialPlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg(
        language === "en"
          ? "Please fill in all required fields."
          : "Sila isi semua ruangan yang diwajibkan."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        language === "en"
          ? "Passwords do not match!"
          : "Kata laluan dan pengesahan kata laluan tidak sama!"
      );
      return;
    }

    const result = registerAccount({
      name,
      email,
      phone,
      password,
      passwordConfirm: confirmPassword,
      role: "parent",
      plan: selectedPlan,
      accessCode: "Rifqi@2026"
    });

    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {language === "en" ? "Parent Account Registration" : "Pendaftaran Akaun Ibu Bapa"}
            </span>
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            {language === "en" ? "Start With MudahKids" : "Mula Langkah MudahKids"}
          </h2>
          <p className="text-stone-500 text-xs">
            {language === "en"
              ? "Create your parent account to manage missions and learning."
              : "Cipta akaun ibu bapa untuk mengurus tugasan & pembelajaran anak."}
          </p>
        </div>

        {/* Single Package Banner */}
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-black text-xs text-amber-300">
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{language === "en" ? "MUDAHKIDS FULL FAMILY PACKAGE" : "PAKEJ LENGKAP MUDAHKIDS"}</span>
            </div>
            <span className="text-xs font-black text-amber-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-amber-300/40">
              <span className="text-xs font-bold text-amber-300">{language === "en" ? "Lifetime Access" : "Akses Selamanya"}</span>
            </span>
          </div>
          <p className="text-[11px] text-emerald-100">
            {language === "en"
              ? "One-time payment for lifetime access • Up to 5 Child Profiles • All Modules Unlocked"
              : "Sekali bayar untuk akses selamanya • Sehingga 5 Profil Anak • Semua Modul Unlocked"}
          </p>
        </div>

        {/* Email Access Code Delivery Notice */}
        <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
          <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
            <Mail className="w-4 h-4 text-amber-600" />
            <span>
              {language === "en" ? "Access Code Delivery Notice:" : "Pemberitahuan Penghantaran Kod Akses:"}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {language === "en"
              ? "Access code will be sent automatically to your registered email after completion of registration and payment."
              : "Kod akses laluan akan dihantar secara automatik melalui email yang didaftarkan selepas pendaftaran dan pembayaran selesai."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-1">
              {language === "en" ? "Parent Name *" : "Nama Ibu Bapa / Bapa / Ibu *"}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={language === "en" ? "E.g. Hafiz & Sarah" : "Contoh: Encik Hafiz & Puan Sarah"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-1">
              {language === "en" ? "Email Address *" : "Emel *"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="nama@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-1">
              {language === "en" ? "Phone Number (WhatsApp)" : "No Telefon (WhatsApp)"}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="tel"
                placeholder="012-3456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-stone-700 mb-1">
                {language === "en" ? "Password *" : "Kata Laluan *"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-stone-700 mb-1">
                {language === "en" ? "Confirm Password *" : "Sahkan Kata Laluan *"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              {language === "en"
                ? `Complete Registration`
                : `Selesaikan Pendaftaran`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
