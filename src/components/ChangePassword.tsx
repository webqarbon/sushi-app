"use client";

import { useState } from "react";
import { updatePassword } from "@/app/actions/auth";
import { Lock } from "lucide-react";

export default function ChangePassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage(null);
    
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Паролі не збігаються" });
      setLoading(false);
      return;
    }

    const res = await updatePassword(formData);
    if (res.error) {
      setMessage({ type: "error", text: res.error as string });
    } else if (res.success) {
      setMessage({ type: "success", text: res.success as string });
      // Reset form or close after success
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 2000);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl border border-gray-100 transition-all active:scale-[0.98]"
      >
        <Lock className="w-4 h-4" />
        Змінити пароль
      </button>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5 text-gray-400" />
        Зміна пароля
      </h3>

      {message && (
        <div className={`p-3 rounded-xl mb-4 text-xs font-medium border ${
          message.type === "error" ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
        }`}>
          {message.text}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Новий пароль</label>
          <input 
            name="password"
            required
            type="password" 
            placeholder="••••••••"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Підтвердіть пароль</label>
          <input 
            name="confirmPassword"
            required
            type="password" 
            placeholder="••••••••"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-sm"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 p-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 text-sm"
          >
            {loading ? "..." : "Оновити"}
          </button>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-xl transition-all text-sm"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}
