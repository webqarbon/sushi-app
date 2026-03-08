"use client";

import { useState } from "react";
import { Star, CheckCircle, XCircle, Clock, Search, MessageCircle, User } from "lucide-react";
import { approveReview, rejectReview } from "@/app/actions/review";
import { toast } from "react-hot-toast";
import { Review } from "@/types/database";

export default function AdminReviewList({ initialReviews }: { initialReviews: Review[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredReviews = initialReviews.filter(r => {
    const matchesSearch = 
      r.comment.toLowerCase().includes(search.toLowerCase()) || 
      (r.products?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.profiles?.full_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = initialReviews.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Відгуки</h1>
          <p className="text-slate-500 font-medium tracking-tight">
            На модерації: <span className="text-orange-500 font-black">{pendingCount}</span> &nbsp;|&nbsp; 
            Всього: <span className="text-slate-900 font-black">{initialReviews.length}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-[2rem] border border-slate-100 shadow-sm">
          {["all", "pending", "approved", "rejected"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                filter === s ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {s === "all" ? "Всі" : s === "pending" ? "Нові" : s === "approved" ? "Схвалені" : "Відхилені"}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="relative group w-full max-w-lg">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Пошук за відгуком, товаром або автором..."
            className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-sm shadow-inner"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredReviews.map(r => <ReviewCard key={r.id} review={r} />)}
      </div>

      {filteredReviews.length === 0 && (
        <div className="p-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
            <MessageCircle className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Відгуків не знайдено</h3>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-3">Спробуйте змінити фільтри</p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const handleApprove = async () => {
    try { await approveReview(review.id); toast.success("✅ Відгук схвалено!"); } 
    catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Помилка"); }
  };

  const handleReject = async () => {
    try { await rejectReview(review.id); toast.success("❌ Відгук відхилено"); } 
    catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Помилка"); }
  };

  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 blur-3xl -z-10 rounded-full" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1.5 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-orange-400 text-orange-400" : "text-slate-100"}`} />
          ))}
        </div>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
          review.status === "approved" ? "bg-green-100 text-green-600 border border-green-200/50" : 
          review.status === "pending" ? "bg-orange-100 text-orange-600 border border-orange-200/50 animate-pulse" : 
          "bg-red-100 text-red-600 border border-red-200/50"
        }`}>
          {review.status === "approved" ? <CheckCircle className="w-3.5 h-3.5" /> : review.status === "pending" ? <Clock className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {review.status === "approved" ? "Схвалено" : review.status === "pending" ? "Новий" : "Відхилено"}
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="text-sm font-black text-slate-900">{review.profiles?.full_name || "Анонім"}</div>
          <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{review.products?.name}</div>
        </div>
      </div>

      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Clock className="w-3 h-3" />
        {new Date(review.created_at).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" })}
      </div>

      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 mb-8 min-h-[100px] flex-1">
        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">&quot;{review.comment}&quot;</p>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        {review.status === "pending" ? (
          <>
            <button onClick={handleApprove} className="flex-1 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-green-500 hover:shadow-green-500/20 active:scale-95 transition-all">
              Схвалити
            </button>
            <button onClick={handleReject} className="flex-1 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl border border-slate-100 hover:text-red-500 hover:bg-slate-50 active:scale-95 transition-all">
              Відхилити
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 py-4 italic">
            Модерацію завершено
          </div>
        )}
      </div>
    </div>
  );
}
