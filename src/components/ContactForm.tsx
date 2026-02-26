"use client";

import { useState } from "react";
import { Send, User, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { sendConsultationRequest } from "@/app/actions/contact";

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await sendConsultationRequest(formData);

    setIsPending(false);
    if (result.success) {
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || "Щось пішло не так");
    }
  }

  return (
    <section className="w-full mb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch" id="consultation">
      {/* Text Info */}
      <div className="lg:col-span-12">
           <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
              <span className="w-8 h-[2px] bg-orange-400"></span>
              Залишились питання?
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1A1C1E] tracking-tight">
                Безкоштовна консультація
            </h2>
          </div>
      </div>

      <div className="lg:col-span-5 flex flex-col justify-center bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-premium border border-gray-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-50" />
        
        <h3 className="text-2xl font-black text-[#1A1C1E] mb-6 relative z-10">Потрібна допомога у виборі?</h3>
        <p className="text-gray-500 font-medium leading-relaxed mb-10 relative z-10">
          Наші менеджери допоможуть підібрати ідеальний набір для вашої компанії, розкажуть про склад кожної страви та допоможуть оформити замовлення.
        </p>

        <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                    <Phone className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                </div>
                <div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Гаряча лінія</div>
                   <div className="font-black text-[#1A1C1E]">0 800 33 44 55</div>
                </div>
            </div>
            <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                </div>
                <div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Telegram / Viber</div>
                   <div className="font-black text-[#1A1C1E]">@sushi_icons_support</div>
                </div>
            </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-premium border border-gray-100/50 relative overflow-hidden">
         <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60" />
         
         {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-3xl font-black text-[#1A1C1E] mb-4">Заявку прийнято!</h3>
                <p className="text-gray-500 font-medium max-w-sm">Ми зателефонуємо вам протягом 15 хвилин для консультації.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-10 text-orange-500 font-black uppercase text-xs tracking-widest hover:text-orange-600 transition-colors"
                >
                  Надіслати ще одну
                </button>
            </div>
         ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Ваше ім'я</label>
                        <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input 
                                name="name"
                                required
                                type="text"
                                placeholder="Олександр"
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-14 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Номер телефону</label>
                        <div className="relative group">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input 
                                name="phone"
                                required
                                type="tel"
                                placeholder="+38 (0__) ___ __ __"
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-14 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Ваше питання (необов'язково)</label>
                    <textarea 
                        name="message"
                        rows={3}
                        placeholder="Опишіть ваше питання..."
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-8 py-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 focus:bg-white transition-all font-bold resize-none placeholder:text-gray-300"
                    ></textarea>
                </div>

                {error && <p className="text-red-500 text-sm font-bold ml-2">{error}</p>}

                <button 
                    disabled={isPending}
                    className="w-full h-16 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-3 group"
                >
                    {isPending ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Замовити консультацію
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                </button>
                <p className="text-[10px] text-gray-400 text-center font-medium opacity-70 px-10 leading-relaxed">
                    Натискаючи на кнопку, ви погоджуєтесь з обробкою персональних даних згідно з нашою політикою конфіденційності.
                </p>
            </form>
         )}
      </div>
    </section>
  );
}
