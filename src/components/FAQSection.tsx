"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQS as faqs } from "@/constants/content";

export function FAQItem({ faq, isOpen, onClick }: { faq: typeof faqs[0], isOpen: boolean, onClick: () => void }) {
  return (
    <div className={`border-b border-gray-100 last:border-0 transition-all duration-300 ${isOpen ? "pb-6" : "pb-0"}`}>
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-sm sm:text-lg font-bold transition-colors duration-300 ${isOpen ? "text-orange-500" : "text-[#1A1C1E] group-hover:text-orange-500"}`}>
          {faq.question}
        </span>
        <div className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-orange-500 text-white rotate-180" : "bg-gray-50 text-gray-400 group-hover:bg-orange-50"}`}>
          {isOpen ? <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="text-[13px] sm:text-base text-gray-500 font-medium leading-relaxed pr-6 sm:pr-10">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full mb-8" id="faq">
       <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-orange-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
              <span className="w-8 h-[2px] bg-orange-400"></span>
              FAQ
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1C1E] tracking-tight">
                Часті питання
            </h2>
          </div>

          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 shadow-premium border border-gray-100/50">
            {faqs.map((faq, idx) => (
              <FAQItem 
                key={idx} 
                faq={faq} 
                isOpen={openIndex === idx} 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)} 
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 font-medium">
                Не знайшли відповідь? <a href="#consultation" className="text-orange-500 font-black hover:underline ml-1 text-sm uppercase tracking-widest">Напишіть нам ✨</a>
            </p>
          </div>
       </div>
    </section>
  );
}
