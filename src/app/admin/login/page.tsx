"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Lock, Mail, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // If user is already logged in as admin, send them to dashboard
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const isAdmin = user.user_metadata?.role === "admin";
        
        if (isAdmin) {
          router.push("/admin");
        }
      }
    };
    checkUser();
  }, [supabase, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is actually an admin
      const user = data.user;
      const isAdmin = user.user_metadata?.role === "admin";

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error("У вас немає прав доступу до адмін-панелі");
      }

      toast.success("Вітаємо, Адмін!");
      router.push("/admin");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Помилка авторизації";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200 rounded-full blur-3xl -ml-48 -mb-48 opacity-30" />

      <div className="w-full max-w-md relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Повернутися на сайт
        </Link>

        <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-premium border border-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16" />
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-xl shadow-xl shadow-slate-900/10 mb-5">
                <ShieldCheck className="w-7 h-7 text-orange-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">
              Admin Login
            </h1>
            <p className="text-sm font-medium text-slate-400">
              Вхід тільки для персоналу магазину
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all"
                  placeholder="admin@frozen-market.ua"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden group"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Вхід в систему
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse group-hover:scale-125 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
             <div className="h-[1px] bg-slate-50 mb-6" />
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                © 2026 FROZEN MARKET SECURITY<br />ACCESS LOGGED BY IP
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
