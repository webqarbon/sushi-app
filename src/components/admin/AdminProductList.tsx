"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Filter, Edit2, Trash2, X, Link as LinkIcon, Camera } from "lucide-react";
import { updateProduct, deleteProduct } from "@/app/actions/product";

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

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative sm:w-64 group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <select
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium appearance-none cursor-pointer"
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-black text-gray-400 border-b border-gray-100">
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                    {p.image_url ? (
                        <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <Camera className="w-4 h-4" />
                        </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-[#1A1C1E]">{p.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">ID: {p.id.slice(0, 8)}...</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-tight">
                    {p.categories?.name || "No Category"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-black text-orange-500 text-lg tracking-tighter">
                    {p.price.toFixed(0)} <span className="text-[10px] uppercase border-b-2 border-orange-500/30">₴</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingProduct(p)}
                      className="p-2.5 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
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
          <div className="p-20 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-[#1A1C1E]">No products found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1E]/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 border border-white/20">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">EDIT PRODUCT</h3>
                <p className="text-gray-500 text-xs font-bold font-mono">UUID: {editingProduct.id}</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-3 bg-white rounded-2xl text-gray-400 hover:text-[#1A1C1E] transition-all shadow-sm hover:shadow-md border border-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={async (formData) => {
              try {
                await updateProduct(formData);
                setEditingProduct(null);
                alert('Success!');
              } catch (err: any) {
                alert(err.message);
              }
            }} className="p-8 space-y-6">
              <input type="hidden" name="id" value={editingProduct.id} />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Product Name</label>
                <input
                  name="name"
                  defaultValue={editingProduct.name}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Price (₴)</label>
                    <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct.price}
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-lg"
                    required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Category</label>
                    <div className="relative group">
                        <select
                        name="category_id"
                        defaultValue={editingProduct.category_id}
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-lg appearance-none cursor-pointer"
                        required
                        >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        </select>
                        <Filter className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Image URL</label>
                <div className="relative group">
                    <Camera className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        name="image_url"
                        defaultValue={editingProduct.image_url}
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-gray-600 truncate"
                        placeholder="https://..."
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingProduct.description}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium h-32 resize-none"
                  placeholder="Опис товару..."
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-orange-500 text-white rounded-[28px] font-black text-xl shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
