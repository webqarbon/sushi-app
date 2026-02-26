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
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6 font-primary">Ваші контактні дані</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-500 mb-1.5 ml-1">Ім&apos;я та Прізвище</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Тарас Шевченко"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-11 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-500 mb-1.5 ml-1">Номер телефону</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="tel" 
              placeholder="+380"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-11 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-900"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all ${
            showSuccess 
            ? 'bg-emerald-500 text-white' 
            : 'bg-gray-900 text-white hover:bg-black active:scale-[0.98]'
          } disabled:opacity-50`}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : showSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Збережено!
            </>
          ) : (
            "Зберегти зміни"
          )}
        </button>
      </form>
    </div>
  );
}
