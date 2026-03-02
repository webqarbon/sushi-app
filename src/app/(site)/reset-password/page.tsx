"use client";

import { useState } from "react";
import { updatePassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      setMessage({ type: "error", text: res.error });
      setLoading(false);
    } else {
      setMessage({ type: "success", text: res.success + ". Зараз ви будете перенаправлені." });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8 text-center">
          Новий пароль
        </h1>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
            message.type === "error" ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}>
            {message.text}
          </div>
        )}

        <form action={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Новий пароль</label>
            <input 
              name="password"
              required
              type="password" 
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Підтвердіть пароль</label>
            <input 
              name="confirmPassword"
              required
              type="password" 
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center p-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? "Оновлення..." : "Зберегти пароль"}
          </button>
        </form>
      </div>
    </div>
  );
}
