"use client";

import { useState } from "react";
import { Search, Edit2, Trash2, X, Plus, Hash } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/category";
import slugify from "slugify";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminCategoryList({ initialCategories }: { initialCategories: Category[] }) {
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const filteredCategories = initialCategories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Ви впевнені, що хочете видалити категорію "${name}"? Це може вплинути на товари в цій категорії.`)) {
      try {
        await deleteCategory(id);
        alert('Категорію видалено!');
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100/50 overflow-hidden">
      {/* Actions */}
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/30">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Шукати категорію..."
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-sm shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button 
          onClick={() => setIsAddingNew(true)}
          className="w-full md:w-auto bg-[#1A1C1E] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg hover:translate-y-[-2px] active:translate-y-0"
        >
          <Plus className="w-4 h-4 text-orange-500" />
          <span>Нова категорія</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 border-b border-gray-50 bg-gray-50/20">
              <th className="px-8 py-5">Назва</th>
              <th className="px-8 py-5">Slug (URL)</th>
              <th className="px-8 py-5 text-right">Управління</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCategories.map((c) => (
              <tr key={c.id} className="hover:bg-orange-500/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="font-black text-[#1A1C1E] text-base group-hover:text-orange-500 transition-colors uppercase tracking-tight">{c.name}</div>
                </td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-[11px] font-bold">
                    <Hash className="w-3 h-3" />
                    {c.slug}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => setEditingCategory(c)}
                      className="p-3.5 rounded-2xl bg-white text-gray-400 hover:text-orange-500 hover:shadow-lg transition-all border border-gray-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-3.5 rounded-2xl bg-white text-gray-400 hover:text-red-500 hover:shadow-lg transition-all border border-gray-50"
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

      {/* Add New Category Modal */}
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

      {/* Edit Category Modal */}
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

function CategoryModal({ onClose, initialData, onSubmit, title }: any) {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      setSlug(slugify(val, { lower: true, locale: 'uk' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1E]/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/20">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">{title}</h3>
          <button onClick={onClose} className="p-4 bg-white rounded-2xl text-gray-400 border border-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-10 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Назва категорії</label>
            <input
              className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-lg"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Вкажіть назву... (Українською)"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Slug (URL)</label>
            <input
              className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-lg"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-shlyakh"
            />
          </div>
          <button 
            onClick={() => onSubmit(name, slug)}
            className="w-full py-6 bg-orange-500 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-orange-500/20 hover:scale-[1.01] transition-all uppercase tracking-tighter"
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}
