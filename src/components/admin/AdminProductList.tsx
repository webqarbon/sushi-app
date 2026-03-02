"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Filter, Edit2, Trash2, X, Link as LinkIcon, Camera, Upload, Plus } from "lucide-react";
import { updateProduct, deleteProduct, createProduct, uploadProductImage } from "@/app/actions/product";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category_id: string;
  description: string;
  categories?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

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
    if (confirm(`Ви впевнені, що хочете видалити ${name}?`)) {
      try {
        await deleteProduct(id);
      } catch (err: any) {
        alert(err.message);
      }
    }
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
      alert('Зображення завантажено успішно!');
    } catch (err: any) {
      alert('Помилка завантаження: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100/50 overflow-hidden">
      {/* Top Header / Actions */}
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/30">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Шукати за назвою..."
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-sm shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative min-w-[200px] group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-sm appearance-none cursor-pointer shadow-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Усі категорії</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={() => setIsAddingNew(true)}
          className="w-full md:w-auto bg-[#1A1C1E] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg hover:translate-y-[-2px] active:translate-y-0"
        >
          <Plus className="w-4 h-4 text-orange-500" />
          <span>Додати товар</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 border-b border-gray-50 bg-gray-50/20">
              <th className="px-8 py-5">Продукт</th>
              <th className="px-8 py-5">Категорія</th>
              <th className="px-8 py-5">Ціна</th>
              <th className="px-8 py-5 text-right">Управління</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-orange-500/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white group-hover:scale-105 transition-transform duration-500">
                      {p.image_url ? (
                          <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                              <Camera className="w-5 h-5" />
                          </div>
                      )}
                    </div>
                    <div>
                      <div className="font-black text-[#1A1C1E] text-base group-hover:text-orange-500 transition-colors uppercase tracking-tight">{p.name}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 opacity-60">ID: {p.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="inline-block px-4 py-1.5 rounded-xl bg-white border border-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {p.categories?.name || "Без категорії"}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="font-black text-[#1A1C1E] text-xl tracking-tighter">
                    {p.price.toFixed(0)} <span className="text-sm opacity-30">₴</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => setEditingProduct(p)}
                      className="p-3.5 rounded-2xl bg-white text-gray-400 hover:text-orange-500 hover:shadow-lg transition-all border border-gray-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
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
        {filteredProducts.length === 0 && (
          <div className="p-20 text-center bg-gray-50/30">
            <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                <Search className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-xl font-black tracking-tighter text-[#1A1C1E] uppercase">Товарів не знайдено</h3>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Спробуйте змінити фільтри</p>
          </div>
        )}
      </div>

      {/* Add New Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1E]/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 border border-white/20">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div>
                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">Додати новий товар</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Створення нової позиції в меню</p>
              </div>
              <button 
                onClick={() => setIsAddingNew(false)}
                className="p-4 bg-white rounded-2xl text-gray-400 hover:text-[#1A1C1E] transition-all shadow-sm hover:shadow-md border border-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={async (formData) => {
              try {
                await createProduct(formData);
                setIsAddingNew(false);
                alert('Товар успішно створено!');
              } catch (err: any) {
                alert(err.message);
              }
            }} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Назва товару</label>
                <input
                  name="name"
                  placeholder="Введіть назву..."
                  className="w-full px-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Ціна (₴)</label>
                    <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-lg"
                    required
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Категорія</label>
                    <div className="relative group">
                        <select
                        name="category_id"
                        className="w-full px-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-lg appearance-none cursor-pointer"
                        required
                        >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        </select>
                        <Filter className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Зображення</label>
                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        <input
                            name="image_url"
                            id="new-image-url"
                            className="w-full pl-14 pr-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-medium text-gray-600 truncate"
                            placeholder="Вставте посилання або завантажте..."
                        />
                    </div>
                    <label className={`cursor-pointer flex items-center justify-center aspect-square h-[64px] bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />
                        {isUploading ? <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full" /> : <Upload className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />}
                    </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Опис</label>
                <textarea
                  name="description"
                  className="w-full px-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-medium h-32 resize-none"
                  placeholder="Вкажіть вагу, склад або опис..."
                />
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-orange-500 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-orange-500/20 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-tighter"
              >
                Створити товар
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1E]/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 border border-white/20">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div>
                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">Редагувати товар</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-mono">UUID: {editingProduct.id.slice(0, 16)}...</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-4 bg-white rounded-2xl text-gray-400 hover:text-[#1A1C1E] transition-all shadow-sm hover:shadow-md border border-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={async (formData) => {
              try {
                await updateProduct(formData);
                setEditingProduct(null);
                alert('Зміни збережено!');
              } catch (err: any) {
                alert(err.message);
              }
            }} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <input type="hidden" name="id" value={editingProduct.id} />
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Назва товару</label>
                <input
                  name="name"
                  defaultValue={editingProduct.name}
                  className="w-full px-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Ціна (₴)</label>
                    <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct.price}
                    className="w-full px-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-lg"
                    required
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Категорія</label>
                    <div className="relative group">
                        <select
                        name="category_id"
                        defaultValue={editingProduct.category_id}
                        className="w-full px-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-bold text-lg appearance-none cursor-pointer"
                        required
                        >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        </select>
                        <Filter className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Зображення</label>
                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        <input
                            name="image_url"
                            id="edit-image-url"
                            defaultValue={editingProduct.image_url}
                            className="w-full pl-14 pr-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-medium text-gray-600 truncate"
                        />
                    </div>
                    <label className={`cursor-pointer flex items-center justify-center aspect-square h-[64px] bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
                        {isUploading ? <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full" /> : <Upload className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />}
                    </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Опис</label>
                <textarea
                  name="description"
                  defaultValue={editingProduct.description}
                  className="w-full px-6 py-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/50 transition-all font-medium h-32 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-orange-500 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-orange-500/20 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-tighter"
              >
                Зберегти зміни
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
