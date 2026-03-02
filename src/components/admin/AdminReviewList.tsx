"use client";

import { useState } from "react";
import { Star, CheckCircle, XCircle, Clock, Trash2, Search, Filter } from "lucide-react";
import { approveReview, rejectReview } from "@/app/actions/review";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  products?: {
    name: string;
  };
}

export default function AdminReviewList({ initialReviews }: { initialReviews: Review[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredReviews = initialReviews.filter(r => {
    const matchesSearch = r.comment.toLowerCase().includes(search.toLowerCase()) || 
                          r.products?.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      alert('Approved!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview(id);
      alert('Rejected!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100/50 overflow-hidden">
      {/* Actions */}
      <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/30">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Шукати у відгуках..."
            className="w-full pl-16 pr-6 py-4 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-sm shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
                <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        filter === s 
                            ? "bg-[#1A1C1E] text-white shadow-lg" 
                            : "text-gray-400 hover:text-[#1A1C1E] hover:bg-gray-100"
                    }`}
                >
                    {s === 'all' ? 'Усі' : s === 'pending' ? 'Очікують' : s === 'approved' ? 'Схвалені' : 'Відхилені'}
                </button>
            ))}
        </div>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 divide-x divide-y divide-gray-50 bg-gray-50/10">
        {filteredReviews.map((r) => (
          <div key={r.id} className="p-10 bg-white hover:bg-orange-500/[0.01] transition-all group flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-orange-400 text-orange-400' : 'text-gray-100'}`} />
                    ))}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    r.status === 'approved' ? 'bg-green-100 text-green-600' : 
                    r.status === 'pending' ? 'bg-orange-100 text-orange-600 animate-pulse' : 
                    'bg-red-100 text-red-600'
                }`}>
                    {r.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : r.status === 'pending' ? <Clock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {r.status}
                </div>
            </div>

            <div className="mb-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#1A1C1E] opacity-100 mb-1">{r.products?.name}</div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString()}</div>
            </div>

            <p className="text-sm font-medium text-gray-500 mb-8 italic line-clamp-4 flex-1">
                "{r.comment}"
            </p>

            <div className="flex items-center gap-2 mt-auto pt-6 border-t border-gray-50">
                {r.status === 'pending' && (
                    <>
                        <button 
                            onClick={() => handleApprove(r.id)}
                            className="flex-1 bg-green-500 text-white font-black text-[10px] uppercase py-3 rounded-xl shadow-lg hover:shadow-green-500/20 active:scale-95 transition-all"
                        >
                            Схвалити
                        </button>
                        <button 
                            onClick={() => handleReject(r.id)}
                            className="flex-1 bg-red-500 text-white font-black text-[10px] uppercase py-3 rounded-xl shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all"
                        >
                            Відхилити
                        </button>
                    </>
                )}
                {r.status !== 'pending' && (
                     <div className="text-[10px] font-black uppercase tracking-widest text-gray-300 w-full text-center">Дія завершена</div>
                )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredReviews.length === 0 && (
         <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Немає відгуків для обраного фільтру</div>
      )}
    </div>
  );
}
