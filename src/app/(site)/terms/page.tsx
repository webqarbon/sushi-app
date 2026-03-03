import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Публічна оферта | FROZEN Market",
  description: "Умови публічного договору оферти FROZEN Market.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors mb-10"
      >
        ← На головну
      </Link>

      <h1 className="text-4xl font-black text-[#1A1C1E] tracking-tight mb-4">
        Публічна оферта
      </h1>
      <p className="text-sm text-gray-400 font-medium mb-12">
        Редакція від 01.01.2026
      </p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-600 font-medium leading-relaxed">
        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">1. Предмет договору</h2>
          <p>
            Цей документ є публічною офертою FROZEN Market (далі — «Продавець»)
            про продаж заморожених продуктів харчування через інтернет-магазин за
            адресою frozen-market.ua. Оформлення замовлення означає повне прийняття
            умов цієї оферти.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">2. Умови оплати</h2>
          <p>
            Всі замовлення здійснюються за умови стовідсоткової передоплати. Оплата
            приймається через платіжний сервіс Monobank (Plata by Mono) або банківські
            реквізити. Після підтвердження оплати замовлення передається до відправки.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">3. Умови доставки</h2>
          <p>
            Доставка здійснюється службою Нова Пошта по всій Україні. Термін
            доставки — від 1 до 3 робочих днів залежно від регіону. Замовник
            несе відповідальність за коректність вказаних даних доставки.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">4. Повернення та обмін</h2>
          <p>
            У звʼязку зі специфікою заморожених продуктів харчування, повернення
            та обмін товарів належної якості не здійснюється після їх отримання.
            У разі отримання пошкодженого або неякісного товару зверніться до нас
            протягом 24 годин від дня отримання.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">5. Бонусна програма</h2>
          <p>
            За кожне оплачене замовлення нараховуються бонуси відповідно до вказаного
            відсотка для кожного товару. Бонуси можна використати для оплати до 50%
            вартості наступних замовлень. 1 бонус = 1 гривня. Продавець залишає за собою
            право змінювати умови бонусної програми.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">6. Контакти</h2>
          <p>
            З питань щодо умов оферти:{" "}
            <a href="tel:+380953727599" className="text-orange-500 hover:underline font-black">
              (095) 372 75 99
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
