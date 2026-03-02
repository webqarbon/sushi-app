"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Filter, Edit2, Trash2, X, Link as LinkIcon, Camera, Upload, Plus, ChevronRight } from "lucide-react";
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
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Products</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage your product catalog ({filteredProducts.length} items found)</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-xl shadow-slate-900/20 hover:scale-105 transition-all duration-500 active:scale-95 group"
        >
          <Plus className="w-5 h-5 text-orange-500 group-hover:rotate-90 transition-transform duration-500" />
          Create New Product
        </button>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by product name..."
              className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative min-w-[240px] group">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-sm appearance-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
      </div>

      {/* Products Grid/Table Layout */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-slate-50 bg-slate-50/30">
                <th className="px-10 py-6">Product Information</th>
                <th className="px-10 py-6">Category</th>
                <th className="px-10 py-6">Price</th>
                <th className="px-10 py-6 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-white group-hover:scale-110 transition-transform duration-500">
                        {p.image_url ? (
                            <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                <Camera className="w-6 h-6" />
                            </div>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-base uppercase tracking-tight">{p.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60 flex items-center gap-2">
                            ID: {p.id.slice(0, 8)} 
                            <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="inline-block px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest shadow-inner">
                      {p.categories?.name || "No Category"}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="font-black text-slate-900 text-2xl tracking-tighter">
                      {p.price.toFixed(0)} <span className="text-sm opacity-30 italic">UAH</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => setEditingProduct(p)}
                        className="p-3.5 rounded-2xl bg-white text-slate-400 hover:text-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all border border-slate-100"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-3.5 rounded-2xl bg-white text-slate-400 hover:text-red-500 hover:shadow-xl hover:shadow-red-500/10 transition-all border border-slate-100"
                        title="Delete Product"
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
            <div className="p-32 text-center">
              <div className="bg-slate-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
                  <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">No products found</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-3">Try adjusting your filters or search keywords</p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-premium relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2">Create Product</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">New menu item entry</p>
              </div>
              <button 
                onClick={() => setIsAddingNew(false)}
                className="p-4 bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm border border-slate-100 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form action={async (formData) => {
              try {
                await createProduct(formData);
                setIsAddingNew(false);
                alert('Product created successfully!');
              } catch (err: any) {
                alert(err.message);
              }
            }} className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Product Name</label>
                <input
                  name="name"
                  placeholder="e.g. Philadelphia Sushi Roll"
                  className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-xl text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Price (₴)</label>
                    <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-xl text-slate-900"
                    required
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Category</label>
                    <div className="relative group">
                        <select
                        name="category_id"
                        className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-xl text-slate-900 appearance-none cursor-pointer"
                        required
                        >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        </select>
                        <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 rotate-90 pointer-events-none" />
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Product Image</label>
                <div className="flex gap-6">
                    <div className="relative flex-1 group">
                        <LinkIcon className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                        <input
                            name="image_url"
                            id="new-image-url"
                            className="w-full pl-16 pr-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-600 truncate"
                            placeholder="Paste URL or upload file..."
                        />
                    </div>
                    <label className={`cursor-pointer flex items-center justify-center aspect-square h-[76px] bg-slate-900 text-white rounded-[1.75rem] shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20 transition-all group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />
                        {isUploading ? <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" /> : <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                    </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Description / Specs</label>
                <textarea
                  name="description"
                  className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium h-40 resize-none text-slate-700"
                  placeholder="Weight, ingredients, or short story..."
                />
              </div>

              <button 
                type="submit"
                className="w-full py-8 bg-orange-500 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_20px_50px_-15px_rgba(249,115,22,0.4)] hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-tighter"
              >
                Create Product Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-premium relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2">Edit Product</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest font-mono">UUID: {editingProduct.id.slice(0, 16)}...</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-4 bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm border border-slate-100 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form action={async (formData) => {
              try {
                await updateProduct(formData);
                setEditingProduct(null);
                alert('Changes saved!');
              } catch (err: any) {
                alert(err.message);
              }
            }} className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <input type="hidden" name="id" value={editingProduct.id} />
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Product Name</label>
                <input
                  name="name"
                  defaultValue={editingProduct.name}
                  className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-xl text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Price (₴)</label>
                    <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct.price}
                    className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-xl text-slate-900"
                    required
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Category</label>
                    <div className="relative group">
                        <select
                        name="category_id"
                        defaultValue={editingProduct.category_id}
                        className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-black text-xl text-slate-900 appearance-none cursor-pointer"
                        required
                        >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        </select>
                        <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 rotate-90 pointer-events-none" />
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Product Image</label>
                <div className="flex gap-6">
                    <div className="relative flex-1 group">
                        <LinkIcon className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                        <input
                            name="image_url"
                            id="edit-image-url"
                            defaultValue={editingProduct.image_url}
                            className="w-full pl-16 pr-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-600 truncate"
                        />
                    </div>
                    <label className={`cursor-pointer flex items-center justify-center aspect-square h-[76px] bg-slate-900 text-white rounded-[1.75rem] shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20 transition-all group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
                        {isUploading ? <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" /> : <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                    </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Description / Specs</label>
                <textarea
                  name="description"
                  defaultValue={editingProduct.description}
                  className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium h-40 resize-none text-slate-700"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-8 bg-[#1A1C1E] text-white rounded-[2.5rem] font-black text-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-tighter"
              >
                Save Changes Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
