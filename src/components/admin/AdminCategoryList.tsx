"use client";

import { useState } from "react";
import { Search, Edit2, Trash2, X, Plus, Hash, LayoutGrid } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/category";
import { toast } from "react-hot-toast";
import slugify from "slugify";
import { Category } from "@/types/database";

export default function AdminCategoryList({ initialCategories }: { initialCategories: Category[] }) {
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const filteredCategories = initialCategories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    toast(
      (t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Видалити &quot;{name}&quot;?</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Може вплинути на товари в цій категорії</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={async () => { toast.dismiss(t.id); try { await deleteCategory(id); toast.success('Категорію видалено'); } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Помилка"); } }}
              style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 12, padding: '8px 16px', fontWeight: 800, cursor: 'pointer', fontSize: 12 }}
            >Видалити</button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{ flex: 1, background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: 12, padding: '8px 16px', fontWeight: 800, cursor: 'pointer', fontSize: 12 }}
            >Скасувати</button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Категорії</h1>
          <p className="text-slate-500 font-medium text-sm">Організуйте ваші товари ({filteredCategories.length} всього)</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-slate-900/20 hover:scale-105 transition-all duration-500 active:scale-95 group"
        >
          <Plus className="w-5 h-5 text-orange-500 group-hover:rotate-90 transition-transform" />
          Нова категорія
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center bg-slate-50/30">
            <div className="relative group w-full max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Пошук категорій..."
                    className="w-full pl-16 pr-6 py-4 bg-white rounded-2xl border border-slate-100 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-sm shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-slate-50 bg-slate-50/20">
                <th className="px-6 py-4">Назва категорії</th>
                <th className="px-6 py-4">Слаг (URL)</th>
                <th className="px-6 py-4 text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCategories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-orange-50 transition-colors">
                            <LayoutGrid className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                        </div>
                        <div className="font-black text-slate-900 text-base uppercase tracking-tight">{c.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/5 text-slate-500 text-[11px] font-black uppercase tracking-widest shadow-inner">
                      <Hash className="w-3.5 h-3.5 text-orange-400" />
                      {c.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => setEditingCategory(c)}
                        className="p-3.5 rounded-2xl bg-white text-slate-400 hover:text-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all border border-slate-100 shadow-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id, c.name)}
                        className="p-3.5 rounded-2xl bg-white text-slate-400 hover:text-red-500 hover:shadow-xl hover:shadow-red-500/10 transition-all border border-slate-100 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddingNew && (
        <CategoryModal 
          onClose={() => setIsAddingNew(false)} 
          onSubmit={async (name: string, slug: string) => {
            await createCategory(name, slug);
            setIsAddingNew(false);
          }}
          title="Створити категорію"
        />
      )}

      {editingCategory && (
        <CategoryModal 
          onClose={() => setEditingCategory(null)} 
          initialData={editingCategory}
          onSubmit={async (name: string, slug: string) => {
            await updateCategory(editingCategory.id, name, slug);
            setEditingCategory(null);
          }}
          title="Редагувати категорію"
        />
      )}
    </div>
  );
}

function CategoryModal({ onClose, initialData, onSubmit, title }: { onClose: () => void; initialData?: Category; onSubmit: (name: string, slug: string) => Promise<void>; title: string }) {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      setSlug(slugify(val, { lower: true, locale: 'uk' }));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-premium relative overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-black tracking-tighter uppercase leading-none">{title}</h3>
          <button onClick={onClose} className="p-3 bg-white rounded-xl text-slate-400 border border-slate-100 hover:text-slate-900 transition-all"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Назва категорії</label>
            <input
              className="w-full px-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-base text-slate-900"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="напр. Традиційні роли"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Слаг (URL)</label>
            <div className="relative">
                <Hash className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-xl border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-base text-slate-900"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="category-slug"
                />
            </div>
          </div>
          <button 
            onClick={() => onSubmit(name, slug)}
            className="w-full py-5 bg-orange-500 text-white rounded-xl font-black text-base shadow-xl shadow-orange-500/20 hover:scale-[1.01] transition-all uppercase tracking-tighter"
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}
