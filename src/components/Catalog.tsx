import { Category, Product } from "@/types/database";
import ProductCard from "./ProductCard";

interface CatalogProps {
  categories: Category[];
  products: Product[];
}

export default function Catalog({ categories, products }: CatalogProps) {
  if (!categories.length || !products.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        Каталог порожній.
      </div>
    );
  }

  // Sort categories by index
  const sortedCategories = [...categories].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="flex flex-col gap-16">
      {sortedCategories.map((category) => {
        const categoryProducts = products.filter(p => p.category_id === category.id);
        
        if (categoryProducts.length === 0) return null;

        return (
          <div key={category.id} id={category.slug} className="scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
