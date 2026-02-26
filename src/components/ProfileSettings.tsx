"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { User, Phone, Check, Loader2 } from "lucide-react";

interface ProfileSettingsProps {
  initialData: {
    full_name: string | null;
    phone: string | null;
  };
}

export default function ProfileSettings({ initialData }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || "",
    phone: initialData.phone || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Помилка при збереженні: " + result.error);
      }
    } catch (error) {
      alert("Виникла помилка під час збереження");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100/50">
      <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <User className="w-5 h-5 text-gray-400" />
        Контактні дані
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Ім&apos;я та Прізвище</label>
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Тарас Шевченко"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all font-bold text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Номер телефону</label>
          <div className="relative group">
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="tel" 
              placeholder="+380"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all font-bold text-gray-900"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-3 py-4.5 rounded-[1.25rem] font-black transition-all shadow-lg ${
            showSuccess 
            ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
            : 'bg-[#1A1C1E] text-white hover:bg-[#2A2C2E] active:scale-[0.98] shadow-gray-200'
          } disabled:opacity-50`}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : showSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Збережено
            </>
          ) : (
            "Зберегти зміни"
          )}
        </button>
      </form>
    </div>
  );
}
