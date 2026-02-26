"use client";

import { Award, Clock, Heart, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Готуємо з любов'ю",
    description: "Кожна страва створюється нашими кухарями з особливою увагою до деталей та смаку."
  },
  {
    icon: ShieldCheck,
    title: "Тільки свіже",
    description: "Ми використовуємо лише перевірені інгредієнти найвищої якості від надійних постачальників."
  },
  {
    icon: Clock,
    title: "Швидка доставка",
    description: "Ваше замовлення прибуде гарячим та вчасно завдяки нашій власній логістиці."
  },
  {
    icon: Award,
    title: "Преміум сервіс",
    description: "Ми прагнемо, щоб кожен ваш візит або замовлення залишали лише приємні враження."
  }
];

export default function AboutSection() {
  return (
    <section className="w-full mb-24" id="about">
      <div className="bg-white rounded-[3rem] p-10 lg:p-20 shadow-premium border border-gray-100/50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-30" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
              <span className="w-8 h-[2px] bg-orange-400"></span>
              Про SUSHI ICONS
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1A1C1E] leading-[1.1] mb-8 tracking-tight">
              Більше, ніж просто <br /> доставка їжі.
            </h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-10 opacity-80">
              Ми створили SUSHI ICONS, щоб змінити ваше уявлення про доставку. Для нас це мистецтво поєднання автентичних рецептів з сучасними технологіями обслуговування. Кожен рол, кожна піца — це результат нашої пристрасті до гастрономії.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-black text-[#1A1C1E] mb-1">5+</div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Років досвіду</div>
              </div>
              <div>
                <div className="text-4xl font-black text-[#1A1C1E] mb-1">50к+</div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Щасливих клієнтів</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((item, idx) => (
              <div key={idx} className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-500">
                  <item.icon className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="font-black text-[#1A1C1E] mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
