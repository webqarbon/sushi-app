"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useCartStore } from "@/store/cart";
import { ArrowLeft, Info, Truck, CreditCard, Gift, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userBonusBalance, setUserBonusBalance] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cityRef: "",
    cityName: "",
    settlementRef: "",
    branchRef: "",
    branchName: "",
    bonusesUsed: 0,
    paymentMethod: "mono",
  });

  // Nova Poshta State
  interface NPCity {
    Ref: string;
    DeliveryCity: string;
    Present: string;
  }
  interface NPBranch {
    Ref: string;
    Description: string;
  }
  const [cities, setCities] = useState<NPCity[]>([]);
  const [branches, setBranches] = useState<NPBranch[]>([]);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [branchSearchTerm, setBranchSearchTerm] = useState("");
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [isBranchLoading, setIsBranchLoading] = useState(false);
  const cityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchCities = (query: string) => {
    if (!query) {
      setCities([]);
      setIsCityLoading(false);
      return;
    }
    setIsCityLoading(true);
    fetch("/api/novaposhta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: {
          CityName: query,
          Limit: 50,
          Page: 1
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.data && data.data[0]?.Addresses) {
        setCities(data.data[0].Addresses);
      } else {
        setCities([]);
      }
    })
    .catch(err => console.error("Error searching cities", err))
    .finally(() => setIsCityLoading(false));
  };

  const loadBranches = (cityRef: string) => {
    if (!cityRef) return;
    setIsBranchLoading(true);
    fetch("/api/novaposhta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          SettlementRef: cityRef,
          Limit: 500,
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.data) {
        setBranches(data.data);
      } else {
        setBranches([]);
      }
    })
    .catch(err => console.error("Error loading branches", err))
    .finally(() => setIsBranchLoading(false));
  };

  const handleCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCitySearchTerm(val);
    setFormData(prev => ({ ...prev, cityRef: "", cityName: "", settlementRef: "", branchRef: "", branchName: "" }));
    setIsCityDropdownOpen(true);
    
    if (cityTimeoutRef.current) clearTimeout(cityTimeoutRef.current);
    cityTimeoutRef.current = setTimeout(() => {
      searchCities(val);
      cityTimeoutRef.current = null;
    }, 250);
  };

  const handleCitySelect = (city: NPCity) => {
    const ref = city.DeliveryCity || city.Ref;
    setFormData(prev => ({ 
      ...prev, 
      cityRef: city.Ref, 
      cityName: city.Present,
      settlementRef: ref,
      branchRef: "",
      branchName: ""
    }));
    setCitySearchTerm(city.Present);
    setIsCityDropdownOpen(false);
    loadBranches(ref);
  };

  const handleBranchSelect = (branch: NPBranch) => {
    setFormData(prev => ({
      ...prev,
      branchRef: branch.Ref,
      branchName: branch.Description
    }));
    setBranchSearchTerm("");
    setIsBranchDropdownOpen(false);
  };

  const handleBranchSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBranchSearchTerm(e.target.value);
  };

  const sortedBranches = useMemo(() => {
    const q = branchSearchTerm.trim().toLowerCase();
    if (!q) return branches;
    const filtered = branches.filter(b => b.Description.toLowerCase().includes(q));
    const numMatch = q.match(/^\d+$/);
    return filtered.sort((a, b) => {
      const descA = a.Description;
      const descB = b.Description;
      const numA = descA.match(/№\s*(\d+)/)?.[1] ?? "";
      const numB = descB.match(/№\s*(\d+)/)?.[1] ?? "";
      if (numMatch) {
        const exactA = numA === q ? 1 : numA.startsWith(q) ? 2 : descA.toLowerCase().includes(q) ? 3 : 4;
        const exactB = numB === q ? 1 : numB.startsWith(q) ? 2 : descB.toLowerCase().includes(q) ? 3 : 4;
        return exactA - exactB;
      }
      const idxA = descA.toLowerCase().indexOf(q);
      const idxB = descB.toLowerCase().indexOf(q);
      if (idxA === -1 && idxB === -1) return 0;
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }, [branches, branchSearchTerm]);

  useEffect(() => () => {
    if (cityTimeoutRef.current) clearTimeout(cityTimeoutRef.current);
  }, []);

  // Derived calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = Math.max(0, subtotal - formData.bonusesUsed);

  // Fetch true user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("bonus_balance, full_name, phone")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserBonusBalance(Number(profile.bonus_balance) || 0);
          setFormData(prev => ({
            ...prev,
            name: profile.full_name || prev.name,
            phone: profile.phone || prev.phone,
          }));
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    fetchProfile();
  }, []);

  const maxBonusesAllowed = Math.min(userBonusBalance, subtotal * 0.5);

  const handleBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(",", ".");
    let val = parseFloat(raw) || 0;
    if (Number.isNaN(val)) val = 0;
    if (val > maxBonusesAllowed) val = maxBonusesAllowed;
    if (val < 0) val = 0;
    setFormData(prev => ({ ...prev, bonusesUsed: val }));
  };

  const potentialBonuses = items.reduce((acc, item) => {
    const bonus = (item.product.price * (item.product.bonus_percent || 0)) / 100;
    return acc + (bonus * item.quantity);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Final validation before submit
      const finalLimit = Math.min(userBonusBalance, maxBonusesAllowed);
      const safeBonuses = Math.min(formData.bonusesUsed, finalLimit);

// ... logic for submit
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          ...formData,
          bonusesUsed: safeBonuses,
          total_price: subtotal - safeBonuses
        }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        // Redirect to Monobank
        clearCart(); // Clear BEFORE redirecting to ensure it's empty even if user goes back
        // Also set success flag so that if monobank redirects back to /success, it works
        sessionStorage.setItem('orderSuccess', 'true');
        window.location.href = data.url;
        return; // Important: prevent further logic
      } else if (data.success) {
        // Manual details
        clearCart();
        sessionStorage.setItem('orderSuccess', 'true');
        router.push("/success");
        return; // Important: prevent further logic
      }
    } catch (error: unknown) {
      console.error("Checkout Error:", error);
      toast.error('Виникла помилка під час оформлення замовлення');
    } finally {
      // We don't necessarily want to set isSubmitting(false) if we are redirecting away,
      // but it's safe to keep it here if the logic above returns correctly.
      // However, to prevent "empty cart" flash, we can check if data.url or data.success was true
      // and NOT set isSubmitting to false if we are navigating.
      // But a simpler way is to check items.length only if NOT isSubmitting.
    }
  };

  const showEmptyState = items.length === 0 && !isSubmitting;

  if (showEmptyState) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Ваш кошик порожній</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-700 underline underline-offset-4">
          Повернутися до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Повернутися
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Оформлення замовлення</h1>

          {!isLoggedIn && (
            <div className="bg-white rounded-[2.5rem] p-8 text-[#1A1C1E] relative overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 group animate-in slide-in-from-top-4 duration-700">
               {/* Decorative background elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/5 blur-[80px] rounded-full translate-y-1/3 -translate-x-1/4" />
               
               <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 relative">
                     <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-lg shadow-orange-500/20 relative z-10">
                        <Gift className="w-10 h-10 text-white" />
                     </div>
                     <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#1A1C1E]/5 backdrop-blur-md rounded-2xl flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform duration-500 delay-75">
                        <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                     </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                     <h2 className="text-2xl font-black mb-2 uppercase tracking-tight text-[#1A1C1E]">Не втрачайте <span className="text-orange-500">{potentialBonuses.toFixed(0)} ₴</span> бонусами!</h2>
                     <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md">
                        За це замовлення ви можете отримати кешбек на бонусний баланс. Авторизуйтесь, щоб ми нарахували їх вам.
                     </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                     <Link 
                        href="/auth?mode=login" 
                        className="px-8 py-4 bg-[#1A1C1E] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all text-center active:scale-95 shadow-xl shadow-black/5"
                     >
                        Увійти
                     </Link>
                     <Link 
                        href="/auth?mode=register" 
                        className="px-8 py-4 bg-gray-50 text-[#1A1C1E] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all text-center border border-gray-200 active:scale-95"
                     >
                        Реєстрація
                     </Link>
                  </div>
               </div>
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Contact Details */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                1. Ваші дані
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ім&apos;я та Прізвище</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Тарас Шевченко"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Номер телефону</label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="+380"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 relative">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                2. Доставка Новою Поштою
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                
                {/* City Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Місто</label>
                  <div className="relative">
                    <input 
                      required 
                      type="text"
                      placeholder="Почніть вводити місто..."
                      value={citySearchTerm}
                      onChange={handleCitySearchChange}
                      onFocus={() => { if (cities.length > 0 || citySearchTerm) setIsCityDropdownOpen(true) }}
                      onBlur={() => setTimeout(() => setIsCityDropdownOpen(false), 200)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                    />
                    {isCityLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  {isCityDropdownOpen && (
                    <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {isCityLoading && cities.length === 0 ? (
                        <li className="px-4 py-4 text-sm text-gray-500 text-center">Завантаження...</li>
                      ) : (
                        cities.map((city, idx) => (
                        <li 
                          key={idx}
                          onClick={() => handleCitySelect(city)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-800 border-b border-gray-100 last:border-b-0"
                        >
                          {city.Present}
                        </li>
                      )))}
                    </ul>
                  )}
                </div>

                {/* Branch Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Відділення / Поштомат</label>
                  <button
                    type="button"
                    disabled={!formData.cityRef}
                    onClick={() => {
                      const ref = formData.settlementRef || formData.cityRef;
                      if (ref) {
                        if (branches.length === 0) loadBranches(ref);
                        setIsBranchDropdownOpen(!isBranchDropdownOpen);
                      }
                    }}
                    className={`w-full text-left bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium truncate ${!formData.cityRef && "opacity-50 cursor-not-allowed"}`}
                  >
                    {formData.branchName || "Оберіть відділення..."}
                  </button>
                  
                  {isBranchDropdownOpen && (formData.cityRef || formData.settlementRef) && (
                    <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-gray-100 relative">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Введіть номер або адресу..."
                          value={branchSearchTerm}
                          onChange={handleBranchSearchChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-blue-500"
                        />
                      </div>
                      <ul className="overflow-y-auto overflow-x-hidden p-0 m-0">
                        {isBranchLoading && branches.length === 0 ? (
                          <li className="px-4 py-6 text-sm text-gray-500 text-center">Завантаження...</li>
                        ) : sortedBranches.length === 0 ? (
                          <li className="px-4 py-6 text-sm text-gray-500 text-center">Відділень не знайдено</li>
                        ) : (
                          sortedBranches.map(branch => (
                            <li 
                              key={branch.Ref}
                              onClick={() => handleBranchSelect(branch)}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-800 border-b border-gray-100 last:border-b-0 break-words"
                            >
                              {branch.Description}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                  {/* Hidden required input to force HTML5 validation */}
                  <input type="hidden" required value={formData.branchRef} />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                3. Оплата та Бонуси
              </h2>

              <div className="mb-8 p-5 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-start gap-3">
                <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-900 text-sm font-medium leading-relaxed">
                  <strong className="block mb-1 text-base">Всі замовлення за повною передплатою</strong>
                  Ми працюємо виключно за повною оплатою. Це забезпечує швидку відправку та гарантує, що продукти залишаться ідеально замороженими до моменту отримання.
                </p>
              </div>

              {/* Loyalty System */}
              <div className="mb-8 p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem]">
                <label className="flex flex-col mb-1 font-black text-blue-900 uppercase text-xs tracking-widest pl-1">
                  Використати бонуси
                  <span className="text-[10px] font-bold text-blue-500/80 mt-1 lowercase tracking-normal">
                    Доступно: {Number(userBonusBalance).toFixed(2)} ₴ (можна списати до 50% від суми)
                  </span>
                </label>
                <div className="flex flex-col gap-5 mt-4">
                  <div className="relative group max-w-[240px]">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-blue-900/40 text-sm">₴</div>
                    <input 
                      type="number" 
                      min={0}
                      max={maxBonusesAllowed}
                      step={0.01}
                      value={formData.bonusesUsed || ""}
                      onChange={handleBonusChange}
                      className="w-full bg-white border border-blue-200 rounded-2xl pl-10 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-blue-900 shadow-inner"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {[25, 50].map((percent) => {
                      const amountFromPercent = (subtotal * percent) / 100;
                      const val = Math.min(amountFromPercent, maxBonusesAllowed);
                      const isActive = formData.bonusesUsed > 0 && Math.abs(formData.bonusesUsed - val) < 0.01;
                      return (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bonusesUsed: val }))}
                        className={`px-6 py-3 border-2 transition-all text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm ${
                            isActive ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-blue-100 text-blue-600 hover:border-blue-300"
                        }`}
                      >
                        {percent}%
                      </button>
                    );})}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, bonusesUsed: maxBonusesAllowed }))}
                      className="px-6 py-3 bg-blue-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-black transition-all shadow-md active:scale-95"
                    >
                      Максимум (50%)
                    </button>
                  </div>
                  
                  {formData.bonusesUsed > 0 && (
                      <p className="text-[10px] font-bold text-blue-400 italic">
                        * Ви економите {formData.bonusesUsed.toFixed(2)} ₴ за рахунок бонусів
                      </p>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-col gap-4">
                <label className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'mono' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="mono" 
                    className="w-5 h-5 text-gray-900 focus:ring-gray-900"
                    checked={formData.paymentMethod === 'mono'}
                    onChange={() => setFormData({...formData, paymentMethod: 'mono'})}
                  />
                  <span className="ml-4 font-bold text-gray-900 text-lg">Plata by Mono (онлайн карткою)</span>
                </label>
                
                <label className={`relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'details' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="details" 
                    className="w-5 h-5 text-gray-900 focus:ring-gray-900" 
                    checked={formData.paymentMethod === 'details'}
                    onChange={() => setFormData({...formData, paymentMethod: 'details'})}
                  />
                  <span className="ml-4 font-bold text-gray-900 text-lg">Оплата за реквізитами (ручна перевірка)</span>
                </label>
              </div>
            </section>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Ваше замовлення</h3>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start text-sm font-medium">
                  <div className="flex-1 pr-4">
                    <span className="text-gray-900">{item.product.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="text-gray-900 shrink-0">{(item.product.price * item.quantity).toFixed(0)} ₴</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 flex flex-col gap-3">
              <div className="flex justify-between text-gray-600 font-medium pb-2">
                <span>Вартість товарів</span>
                <span>{subtotal.toFixed(0)} ₴</span>
              </div>
              
              {formData.bonusesUsed > 0 && (
                <div className="flex justify-between text-blue-600 font-bold pb-2">
                  <span>Списані бонуси</span>
                  <span>-{formData.bonusesUsed.toFixed(2)} ₴</span>
                </div>
              )}

              <div className="flex justify-between text-2xl font-black text-gray-900 pt-4 border-t border-gray-100">
                <span>Усього</span>
                <span>{total.toFixed(0)} ₴</span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full mt-8 flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-lg"
            >
              {isSubmitting ? "Обробка..." : "Підтвердити замовлення"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
