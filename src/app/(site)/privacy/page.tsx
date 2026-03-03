import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Політика конфіденційності | FROZEN Market",
  description: "Умови захисту та обробки персональних даних клієнтів FROZEN Market.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors mb-10"
      >
        ← На головну
      </Link>

      <h1 className="text-4xl font-black text-[#1A1C1E] tracking-tight mb-4">
        Політика конфіденційності
      </h1>
      <p className="text-sm text-gray-400 font-medium mb-12">
        Редакція від 01.01.2026
      </p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-600 font-medium leading-relaxed">
        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">1. Загальні положення</h2>
          <p>
            FROZEN Market (далі — «Компанія») поважає конфіденційність своїх клієнтів
            та зобовʼязується захищати їхні персональні дані відповідно до вимог
            законодавства України про захист персональних даних.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">2. Які дані ми збираємо</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Імʼя та прізвище</li>
            <li>Номер телефону</li>
            <li>Адреса електронної пошти</li>
            <li>Адреса доставки (місто та відділення Нової Пошти)</li>
            <li>Історія замовлень</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">3. Мета збору даних</h2>
          <p>
            Персональні дані використовуються виключно для обробки замовлень,
            звʼязку з клієнтом щодо замовлення, нарахування та обліку бонусів,
            а також для покращення якості обслуговування.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">4. Захист даних</h2>
          <p>
            Компанія не передає персональні дані третім особам без згоди клієнта,
            за виключенням випадків, передбачених законодавством. Дані зберігаються
            на захищених серверах Supabase з використанням шифрування.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">5. Права клієнта</h2>
          <p>
            Клієнт має право на доступ до своїх персональних даних, їх виправлення
            або видалення. Для цього зверніться до нас за телефоном{" "}
            <a href="tel:+380953727599" className="text-orange-500 hover:underline font-black">
              (095) 372 75 99
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1A1C1E] mb-4">6. Контакти</h2>
          <p>
            З питань захисту персональних даних звертайтесь за адресою:{" "}
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
