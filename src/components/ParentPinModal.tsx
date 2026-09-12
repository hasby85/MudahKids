import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Lock, ShieldCheck, KeyRound, X, Check, Eye, EyeOff } from "lucide-react";

interface ParentPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { language, parentPin, showToast } = useApp();
  const [inputPin, setInputPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === parentPin) {
      setErrorMsg("");
      setInputPin("");
      showToast(
        language === "en" ? "Access granted to Parent Mode!" : "Akses disahkan! Selamat datang ke Mod Ibu Bapa.",
        "success"
      );
      onSuccess();
    } else {
      setErrorMsg(
        language === "en"
          ? "Incorrect PIN! Please try again."
          : "PIN salah! Sila cuba lagi."
      );
      setInputPin("");
    }
  };

  const handleDigitClick = (digit: string) => {
    if (inputPin.length < 6) {
      setInputPin((prev) => prev + digit);
      setErrorMsg("");
    }
  };

  const handleDeleteDigit = () => {
    setInputPin((prev) => prev.slice(0, -1));
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-3xl mx-auto flex items-center justify-center text-2xl shadow-inner border border-emerald-200">
            🔒
          </div>
          <h2 className="text-xl font-black text-stone-900">
            {language === "en" ? "Parent Security Lock" : "Kunci Keselamatan Ibu Bapa"}
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            {language === "en"
              ? "Enter your 4-digit Parent PIN to access Parent Mode."
              : "Masukkan PIN 4-digit Ibu Bapa untuk mengakses Mod Ibu Bapa."}
          </p>
          <div className="inline-block bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-[11px] font-bold">
            💡 {language === "en" ? "Default PIN: 1234" : "PIN Laluan Asal: 1234"}
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          {/* PIN Input Display */}
          <div className="flex justify-center items-center gap-3 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const hasDigit = inputPin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                    hasDigit
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs"
                      : "border-stone-200 bg-stone-50 text-stone-300"
                  }`}
                >
                  {hasDigit ? (showPin ? inputPin[idx] : "●") : ""}
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 text-center animate-shake">
              {errorMsg}
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigitClick(num)}
                className="py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 font-black text-lg transition-all cursor-pointer shadow-2xs"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs transition-all cursor-pointer"
            >
              {showPin ? "Sembunyi" : "Lihat"}
            </button>
            <button
              type="button"
              onClick={() => handleDigitClick("0")}
              className="py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 font-black text-lg transition-all cursor-pointer shadow-2xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDeleteDigit}
              className="py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-rose-600 font-bold text-xs transition-all cursor-pointer"
            >
              ⌫ Padam
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
          >
            {language === "en" ? "Verify & Enter Parent Mode" : "Sahkan & Masuk Mod Ibu Bapa"}
          </button>
        </form>
      </div>
    </div>
  );
};
