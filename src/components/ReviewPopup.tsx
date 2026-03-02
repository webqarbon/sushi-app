"use client";

import { useState } from "react";
import { Star, X, MessageSquare, ArrowRight } from "lucide-react";
import { submitReview } from "@/app/actions/review";

interface ReviewPopupProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export default function ReviewPopup({ productId, productName, onClose }: ReviewPopupProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return alert("Будь ласка, оберіть рейтинг");

    setIsSubmitting(true);
    try {
      await submitReview(productId, rating, comment);
      alert("Відгук надіслано на перевірку адміністратору. Дякуємо!");
      onClose();
    } catch (err: any) {
      alert("Помилка: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1A1C1E]/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white/90 w-full max-w-lg rounded-[3rem] shadow-premium relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 border border-white/40">
        
        {/* Header */}
        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-white/50 relative overflow-hidden">
            <div className="absolute top-0 right-10 w-32 h-32 bg-orange-400/5 blur-3xl rounded-full" />
            <div>
                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Залишити відгук</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{productName}</p>
            </div>
            <button onClick={onClose} className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl text-gray-400 hover:text-[#1A1C1E] transition-all border border-gray-100">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          
          {/* Stars */}
          <div className="flex flex-col items-center gap-6">
            <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Оберіть вашу оцінку</div>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-3 rounded-2xl transition-all duration-300 group ${
                    rating >= star ? 'bg-orange-400 shadow-lg shadow-orange-400/20' : 'bg-gray-50 hover:bg-orange-50'
                  }`}
                >
                  <Star 
                    className={`w-8 h-8 transition-all ${
                      rating >= star ? 'fill-white text-white scale-110' : 'text-gray-200 group-hover:text-orange-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <div className="text-xl font-black text-orange-500 tracking-tight">
                {rating === 5 ? "Відмінно" : rating === 4 ? "Добре" : rating === 3 ? "Задовільно" : rating === 2 ? "Могло бути краще" : "Погано"}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 pl-1">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Ваш коментар</label>
            </div>
            <textarea
              className="w-full px-8 py-6 bg-gray-50/50 rounded-3xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-medium text-gray-700 min-h-[160px] resize-none"
              placeholder="Що вам сподобалось у цій страві?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-6 rounded-[2.25rem] font-black text-lg transition-all flex items-center justify-center gap-4 group uppercase tracking-tighter ${
              isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1A1C1E] text-white hover:bg-orange-500 shadow-xl hover:shadow-orange-500/20 active:scale-95'
            }`}
          >
            {isSubmitting ? <span className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-white" /> : (
                <>
                    Надіслати відгук
                    <ArrowRight className="w-5 h-5 text-orange-400 group-hover:text-white transition-colors" />
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
