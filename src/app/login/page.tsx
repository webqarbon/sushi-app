"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { login, signup } from "@/app/actions/auth";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSubmit = async (formData: FormData) => {
    if (isLogin) {
      await login(formData);
    } else {
      await signup(formData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100">
        
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8 text-center">
          {isLogin ? "Вхід" : "Реєстрація"}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-3.5 px-4 rounded-xl transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Продовжити з Google
        </button>

        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="shrink-0 px-4 text-gray-400 text-sm font-medium">або</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ім&apos;я та Прізвище</label>
              <input 
                name="fullName"
                required
                type="text" 
                placeholder="Іван Франко"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input 
              name="email"
              required
              type="email" 
              placeholder="name@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
            <input 
              name="password"
              required
              type="password" 
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-2 flex items-center justify-center p-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            {isLogin ? "Увійти" : "Зареєструватися"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-gray-600">
          {isLogin ? "Ще не маєте акаунту?" : "Вже зареєстровані?"}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-blue-600 hover:text-blue-700 font-bold hover:underline"
          >
            {isLogin ? "Створити акаунт" : "Увійти"}
          </button>
        </div>

      </div>
    </div>
  );
}
