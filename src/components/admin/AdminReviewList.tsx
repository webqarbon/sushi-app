"use client";

import { useState } from "react";
import { Star, CheckCircle, XCircle, Clock, Trash2, Search, Filter, MessageCircle, ArrowRight } from "lucide-react";
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

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Reviews</h1>
          <p className="text-slate-500 font-medium tracking-tight">
            Pending: <span className="text-orange-500">{initialReviews.filter(r => r.status === 'pending').length}</span> | 
            Total: {initialReviews.length}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
                <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                        filter === s 
                            ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                            : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                    {s === 'all' ? 'All' : s === 'pending' ? 'Pending' : s === 'approved' ? 'Approved' : 'Rejected'}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="relative group w-full max-w-lg">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                  type="text"
                  placeholder="Search in reviews or products..."
                  className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-sm shadow-inner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
          </div>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredReviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
      
      {filteredReviews.length === 0 && (
         <div className="p-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
                <MessageCircle className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">No reviews found</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-3">Try changing your filters</p>
         </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
    const handleApprove = async () => {
        try { await approveReview(review.id); alert('Review Approved!'); } catch (err: any) { alert(err.message); }
    };

    const handleReject = async () => {
        try { await rejectReview(review.id); alert('Review Rejected!'); } catch (err: any) { alert(err.message); }
    };

    return (
        <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 blur-3xl -z-10 rounded-full" />
            
            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1.5 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-orange-400 text-orange-400' : 'text-slate-100'}`} />
                    ))}
                </div>
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                    review.status === 'approved' ? 'bg-green-100 text-green-600 border border-green-200/50' : 
                    review.status === 'pending' ? 'bg-orange-100 text-orange-600 border border-orange-200/50 animate-pulse' : 
                    'bg-red-100 text-red-600 border border-red-200/50'
                }`}>
                    {review.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> : review.status === 'pending' ? <Clock className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {review.status}
                </div>
            </div>

            <div className="mb-6">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">Product</div>
                <div className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-orange-500 transition-colors">{review.products?.name}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {new Date(review.created_at).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 mb-10 min-h-[140px] flex-1">
                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                    "{review.comment}"
                </p>
            </div>

            <div className="flex items-center gap-4 mt-auto">
                {review.status === 'pending' ? (
                    <>
                        <button 
                            onClick={handleApprove}
                            className="flex-1 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-green-500 hover:shadow-green-500/20 active:scale-95 transition-all outline-none"
                        >
                            Approve
                        </button>
                        <button 
                            onClick={handleReject}
                            className="flex-1 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl border border-slate-100 hover:text-red-500 hover:bg-slate-50 active:scale-95 transition-all outline-none"
                        >
                            Reject
                        </button>
                    </>
                ) : (
                    <div className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 py-4 italic">
                        Moderation Complete
                    </div>
                )}
            </div>
        </div>
    );
}
