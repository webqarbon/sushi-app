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
        <span className={`text-lg font-black transition-colors duration-300 ${isOpen ? "text-orange-500" : "text-[#1A1C1E] group-hover:text-orange-500"}`}>
          {faq.question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-orange-500 text-white rotate-180" : "bg-gray-50 text-gray-400 group-hover:bg-orange-50"}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="text-gray-500 font-medium leading-relaxed pr-10">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full mb-32" id="faq">
       <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
              <span className="w-8 h-[2px] bg-orange-400"></span>
              FAQ
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1A1C1E] tracking-tight">
                Часті питання
            </h2>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-premium border border-gray-100/50">
            {faqs.map((faq, idx) => (
              <FAQItem 
                key={idx} 
                faq={faq} 
                isOpen={openIndex === idx} 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)} 
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400 font-medium">
                Не знайшли відповідь? <a href="#consultation" className="text-orange-500 font-black hover:underline ml-1 text-sm uppercase tracking-widest">Напишіть нам ✨</a>
            </p>
          </div>
       </div>
    </section>
  );
}
