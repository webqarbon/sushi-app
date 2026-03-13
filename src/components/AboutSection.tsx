"use client";

import { FEATURES as features } from "@/constants/content";
import { SITE_CONFIG } from "@/constants/site";

export default function AboutSection() {
  return (
    <section className="w-full" id="about">
      <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-20 shadow-premium border border-gray-100/50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-30" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-orange-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
              <span className="w-8 h-[2px] bg-orange-400"></span>
              Про {SITE_CONFIG.name}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1C1E] leading-[1.1] mb-8 tracking-tight">
              Більше, ніж просто <br className="hidden sm:block" /> доставка продуктів.
            </h2>
            <p className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed mb-8 sm:mb-10 opacity-80">
              Ми створили {SITE_CONFIG.name}, щоб змінити ваше уявлення про заморожені продукти. Це мистецтво поєднання кращих інгредієнтів та сервісу.
            </p>

            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-[#1A1C1E] mb-0.5">5+</div>
                <div className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Років досвіду</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-[#1A1C1E] mb-0.5">50к+</div>
                <div className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Щасливих клієнтів</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {features.map((item, idx) => (
              <div key={idx} className="bg-gray-50/50 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.25rem] border border-gray-100/30 hover:bg-white hover:shadow-premium transition-all duration-500 group flex flex-col items-start text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors duration-500 shrink-0">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-[#1A1C1E] mb-2 leading-tight min-h-[2.5em] flex items-center">{item.title}</h3>
                <p className="text-[12px] sm:text-sm text-gray-500/80 font-medium leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
