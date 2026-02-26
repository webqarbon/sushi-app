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
        className="w-full flex items-center justify-center gap-3 p-5 bg-white hover:bg-gray-50 text-gray-700 font-black rounded-[1.5rem] border border-gray-100 shadow-sm transition-all active:scale-[0.98] group"
      >
        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
          <Lock className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
        </div>
        Змінити пароль
      </button>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100/50 shadow-sm animate-in fade-in zoom-in duration-300">
      <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <Lock className="w-5 h-5 text-gray-400" />
        Зміна пароля
      </h3>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-bold border ${
          message.type === "error" ? "bg-red-50 text-red-600 border-red-100/50" : "bg-emerald-50 text-emerald-600 border-emerald-100/50"
        }`}>
          {message.text}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Новий пароль</label>
          <input 
            name="password"
            required
            type="password" 
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all font-bold text-gray-900"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Підтвердіть пароль</label>
          <input 
            name="confirmPassword"
            required
            type="password" 
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all font-bold text-gray-900"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 p-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[1.25rem] shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "..." : "Оновити пароль"}
          </button>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-6 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-[1.25rem] transition-all border border-gray-100"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}
