"use client";

import { Category, Product } from "@/types/database";
import ProductCard from "./ProductCard";

interface CatalogProps {
  categories: Category[];
  products: Product[];
  activeCategoryId?: string;
}

export default function Catalog({ categories, products, activeCategoryId }: CatalogProps) {
  if (!categories.length || !products.length) {
    return (
      <div className="text-center py-12 text-gray-500 font-medium">
        Каталог порожній.
      </div>
    );
  }

  // Find the category to display
  const targetCategory = activeCategoryId 
    ? categories.find(c => c.id === activeCategoryId) 
    : categories.sort((a, b) => a.order_index - b.order_index)[0];

  if (!targetCategory) return null;

  const categoryProducts = products.filter(p => p.category_id === targetCategory.id);

  return (
    <div className="flex flex-col gap-12">
      <div key={targetCategory.id}>
        <h2 className="text-3xl font-black tracking-widest text-[#1A1C1E] mb-10 text-center uppercase">
          {targetCategory.name}
        </h2>
        
        {categoryProducts.length === 0 ? (
          <p className="text-center text-gray-400 py-12">У цій категорії поки немає товарів.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
