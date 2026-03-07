"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if the user arrived here from a valid checkout
    const hasSuccessFlag = sessionStorage.getItem("orderSuccess") === "true";
    
    if (!hasSuccessFlag) {
      // Unauthorised access, redirect to homepage immediately
      router.replace("/");
    } else {
      // Authorised. Clear the flag so they can't refresh the page and view it again
      setIsAuthorized(true);
      sessionStorage.removeItem("orderSuccess");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[70vh]">
         {/* Optional loading state while redirecting */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 text-center max-w-md w-full border border-gray-100 animate-in zoom-in-95 duration-500">
        <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
          Дякуємо! <br/> Замовлення прийнято
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed font-medium">
          Найближчим часом ми розпочнемо комплектацію вашого замовлення. Інформація щодо доставки надійде у вигляді SMS.
        </p>
        <Link 
          href="/"
          className="w-full inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        >
          Повернутися на Головну
        </Link>
      </div>
    </div>
  );
}
