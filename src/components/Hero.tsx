import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Заморожені продукти <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">преміум якості</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Швидка доставка смачних заморожених страв. Отримуйте до 10% бонусів з кожної покупки та оплачуйте ними наступні замовлення!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="#catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Перейти до каталогу
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="#bonuses"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 hover:border-blue-300 rounded-full shadow-sm transition-all duration-200"
            >
              Як працюють бонуси?
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-200/30 blur-3xl" />
      </div>
    </section>
  );
}
