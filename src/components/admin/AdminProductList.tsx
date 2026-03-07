"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Filter, Edit2, Trash2, X, Link as LinkIcon, Camera, Upload, Plus, ChevronRight, Hash, Percent, DollarSign, Package } from "lucide-react";
import { updateProduct, deleteProduct, createProduct, uploadProductImage } from "@/app/actions/product";
import { toast } from "react-hot-toast";

import { Product, Category } from "@/types/database";
import { SITE_CONFIG } from "@/constants/site";

export default function AdminProductList({ 
  products, 
  categories 
}: { 
  products: Product[], 
  categories: Category[] 
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || p.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleDelete = async (id: string, name: string) => {
    toast(
      (t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Видалити "{name}"?</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Цю дію не можна скасувати</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={async () => { toast.dismiss(t.id); try { await deleteProduct(id); toast.success('Товар видалено'); } catch (err: any) { toast.error(err.message); } }}
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadProductImage(file);
      if (isEdit && editingProduct) {
        setEditingProduct({ ...editingProduct, image_url: url });
      } else {
        const input = document.getElementById(isEdit ? 'edit-image-url' : 'new-image-url') as HTMLInputElement;
        if (input) input.value = url;
      }
      toast.success('Зображення завантажено!');
    } catch (err: any) {
      toast.error('Помилка: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row items-baseline lg:items-center justify-between gap-6">
        <div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Каталог: {filteredProducts.length} позицій знайдено</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(true)}
          className="w-full lg:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-[2rem] shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20 active:scale-95 transition-all group"
        >
          <Plus className="w-5 h-5 text-orange-500 group-hover:rotate-90 transition-transform" />
          Додати новий товар
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="relative group flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Шукати за назвою..."
              className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-sm shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative min-w-[240px] group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-sm appearance-none cursor-pointer shadow-inner"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Усі категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90 pointer-events-none" />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col p-4 relative overflow-hidden">
             <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden mb-6 bg-slate-50 border border-slate-50 group-hover:scale-[1.02] transition-transform duration-700">
                {p.image_url ? (
                    <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Camera className="w-16 h-16" />
                    </div>
                )}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 flex flex-col gap-2">
                    <button 
                         onClick={() => setEditingProduct(p)}
                         className="p-4 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 shadow-xl border border-white hover:bg-orange-500 hover:text-white transition-all"
                    >
                         <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                         onClick={() => handleDelete(p.id, p.name)}
                         className="p-4 bg-white/90 backdrop-blur-md rounded-2xl text-red-500 shadow-xl border border-white hover:bg-red-500 hover:text-white transition-all"
                    >
                         <Trash2 className="w-5 h-5" />
                    </button>
                </div>
                <div className="absolute bottom-6 left-6">
                    <span className="px-5 py-2 rounded-full bg-white/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-slate-500 border border-white shadow-sm">
                        {p.categories?.name || "Без категорії"}
                    </span>
                </div>
             </div>

             <div className="px-4 pb-4 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4 group-hover:text-orange-500 transition-colors line-clamp-2">{p.name}</h3>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ціна</div>
                         <div className="text-xl font-black text-slate-900 tracking-tighter">{SITE_CONFIG.currency}{p.price.toFixed(0)}</div>
                    </div>
                    <div className="bg-orange-50/30 p-4 rounded-3xl border border-orange-100/50">
                        <div className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Бонус</div>
                        <div className="text-xl font-black text-orange-500 tracking-tighter">{p.bonus_percent}%</div>
                    </div>
                  {(p.reviews_count !== undefined && p.reviews_count > 0) && (
                    <div className="col-span-2 bg-purple-50/30 p-4 rounded-3xl border border-purple-100/50 flex items-center justify-between">
                      <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Рейтинг</div>
                      <div className="text-base font-black text-purple-600">★ {(p.average_rating || 0).toFixed(1)} <span className="text-[9px] text-purple-300">({p.reviews_count})</span></div>
                    </div>
                  )}
              </div>
                 <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Собівартість: {SITE_CONFIG.currency}{p.cost_price || 0}</div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">UUID: {p.id.slice(0, 4)}</div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Add New Modal */}
      {(isAddingNew || editingProduct) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-premium relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2">
                    {editingProduct ? 'Редагувати товар' : 'Додати товар'}
                </h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest font-mono">
                    {editingProduct ? `ID: ${editingProduct.id.slice(0, 16)}` : 'Створення нового об\'єкту'}
                </p>
              </div>
              <button 
                onClick={() => { setIsAddingNew(false); setEditingProduct(null); }}
                className="p-4 bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm border border-slate-100 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form action={async (formData) => {
              try {
                if (editingProduct) await updateProduct(formData);
                else await createProduct(formData);
                setEditingProduct(null);
                setIsAddingNew(false);
                toast.success('Зміни успішно збережено!');
              } catch (err: any) {
                toast.error('Помилка: ' + err.message);
              }
            }} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 flex items-center gap-2">
                    <Package className="w-3 h-3 text-orange-500" /> Назва товару
                </label>
                <input
                  name="name"
                  defaultValue={editingProduct?.name || ""}
                  placeholder="Введіть назву..."
                  className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all font-black text-lg text-slate-900 shadow-inner"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Ціна продажу ({SITE_CONFIG.currency})</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={editingProduct?.price || ""}
                        className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all font-black text-lg text-slate-900 shadow-inner"
                        required
                    />
                </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 font-black text-orange-500">Собівартість ({SITE_CONFIG.currency})</label>
                    <input
                        name="cost_price"
                        type="number"
                        step="0.01"
                        defaultValue={editingProduct?.cost_price || ""}
                        className="w-full px-8 py-5 bg-orange-50/50 rounded-[2rem] border border-orange-100 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all font-black text-lg text-slate-900 shadow-inner"
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Категорія</label>
                    <div className="relative group">
                        <select
                        name="category_id"
                        defaultValue={editingProduct?.category_id || ""}
                        className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all font-black text-base text-slate-900 appearance-none cursor-pointer shadow-inner"
                        required
                        >
                        <option value="" disabled>Оберіть категорію</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        </select>
                        <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 rotate-90 pointer-events-none" />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 font-black text-green-500">% Бонусів нараховано</label>
                    <input
                        name="bonus_percent"
                        type="number"
                        step="0.1"
                        defaultValue={editingProduct?.bonus_percent || 5}
                        className="w-full px-8 py-5 bg-green-50/50 rounded-[2rem] border border-green-100 focus:ring-4 focus:ring-green-500/10 focus:bg-white transition-all font-black text-lg text-slate-900 shadow-inner"
                    />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Зображення товару</label>
                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <input
                            name="image_url"
                            id={editingProduct ? 'edit-image-url' : 'new-image-url'}
                            defaultValue={editingProduct?.image_url || ""}
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all font-medium text-slate-500 text-sm shadow-inner truncate"
                            placeholder="URL або завантажте файл..."
                        />
                    </div>
                    <label className={`cursor-pointer flex items-center justify-center aspect-square h-[66px] bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-orange-500 transition-all group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, !!editingProduct)} />
                        {isUploading ? <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full" /> : <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                    </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Опис та Характеристики</label>
                <textarea
                  name="description"
                  defaultValue={editingProduct?.description || ""}
                  className="w-full px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all font-medium h-32 resize-none text-slate-700 shadow-inner"
                  placeholder="Вага, склад, особливості..."
                />
              </div>

              <button 
                type="submit"
                className="w-full py-8 bg-[#1A1C1E] text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-tighter mt-4"
              >
                {editingProduct ? 'Оновити дані' : 'Створити товар'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
