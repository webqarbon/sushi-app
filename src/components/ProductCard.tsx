import { Plus } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const bonusUah = (product.price * product.bonus_percent) / 100;
  
  // Weights and counts are usually in description or we can mock them for the design
  // Let's try to extract from description or use placeholder if not found
  const weightInfo = product.description?.match(/\d+\s*(г|шт)/g)?.join(" | ") || "32 шт | 1355 г";

  return (
    <div className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 border border-white p-2">
      {/* Image Area */}
      <div className="relative aspect-square bg-[#F9FAFB] rounded-[2rem] overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            Немає фото
          </div>
        )}
        
        {/* Bonus Badge */}
        <div className="absolute top-4 right-4 bg-orange-400 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
          +{bonusUah.toFixed(0)} бонуси
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 text-center">
        {/* Characteristics */}
        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
          {weightInfo}
        </div>

        <h3 className="font-black text-xl text-[#1A1C1E] leading-tight mb-3 px-2 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-400 font-medium mb-6 line-clamp-2 px-4 leading-relaxed">
          {product.description}
        </p>

        {/* Footer: Price and Add Button */}
        <div className="mt-auto flex items-center justify-between bg-gray-50 rounded-3xl p-2 pl-6">
          <span className="text-2xl font-black text-[#1A1C1E]">{product.price.toFixed(0)} ₴</span>
          
          <button
            onClick={() => addItem(product)}
            className="flex items-center justify-center w-12 h-12 bg-white text-[#1A1C1E] rounded-2xl shadow-sm hover:bg-orange-400 hover:text-white transition-all active:scale-90"
            aria-label="Додати в кошик"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
