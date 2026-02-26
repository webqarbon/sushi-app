"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { ArrowLeft, Info, Truck, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userBonusBalance, setUserBonusBalance] = useState<number>(0);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cityRef: "",
    cityName: "",
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
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const searchCities = (query: string) => {
    if (!query) return setCities([]);
    
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
    .catch(err => console.error("Error searching cities", err));
  };

  const loadBranches = (cityRef: string, query: string = "") => {
    fetch("/api/novaposhta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          SettlementRef: cityRef,
          FindByString: query,
          Limit: 50,
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.data) {
        setBranches(data.data);
      }
    })
    .catch(err => console.error("Error loading branches", err));
  };

  const handleCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCitySearchTerm(val);
    setFormData({ ...formData, cityRef: "", cityName: "", branchRef: "", branchName: "" }); // Reset on manual type
    setIsCityDropdownOpen(true);
    
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => searchCities(val), 500));
  };

  const handleCitySelect = (city: NPCity) => {
    setFormData({ 
      ...formData, 
      cityRef: city.Ref, 
      cityName: city.Present,
      branchRef: "",
      branchName: ""
    });
    setCitySearchTerm(city.Present);
    setIsCityDropdownOpen(false);
    loadBranches(city.DeliveryCity);
  };

  const handleBranchSelect = (branch: NPBranch) => {
    setFormData({
      ...formData,
      branchRef: branch.Ref,
      branchName: branch.Description
    });
    setIsBranchDropdownOpen(false);
  };

  // Derived calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = Math.max(0, subtotal - formData.bonusesUsed);

  // Fetch true user data on mount
  useState(() => {
    const fetchProfile = async () => {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
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
      }
    };
    fetchProfile();
  });

  const handleBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value) || 0;
    if (val > userBonusBalance) val = userBonusBalance;
    if (val > subtotal) val = subtotal;
    setFormData({ ...formData, bonusesUsed: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Post to Server Action or API route here.
      // Wait for 1s to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          ...formData,
          total_price: total
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        // Redirect to Monobank
        clearCart(); // Clear BEFORE redirecting to ensure it's empty even if user goes back
        window.location.href = data.url;
        return; // Important: prevent further logic
      } else if (data.success) {
        // Manual details
        clearCart();
        router.push("/success");
        return; // Important: prevent further logic
      }
    } catch (error: unknown) {
      console.error("Checkout Error:", error);
      alert("Виникла помилка під час оформлення замовлення");
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
                  <input 
                    required 
                    type="text"
                    placeholder="Почніть вводити місто..."
                    value={citySearchTerm}
                    onChange={handleCitySearchChange}
                    onFocus={() => { if(cities.length > 0) setIsCityDropdownOpen(true) }}
                    onBlur={() => setTimeout(() => setIsCityDropdownOpen(false), 200)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                  />
                  {isCityDropdownOpen && cities.length > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {cities.map((city, idx) => (
                        <li 
                          key={idx}
                          onClick={() => handleCitySelect(city)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-800 border-b border-gray-100 last:border-b-0"
                        >
                          {city.Present}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Branch Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Відділення / Поштомат</label>
                  <button
                    type="button"
                    disabled={!formData.cityRef}
                    onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                    className={`w-full text-left bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium truncate ${!formData.cityRef && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {formData.branchName || "Оберіть відділення..."}
                  </button>
                  
                  {isBranchDropdownOpen && formData.cityRef && (
                    <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Пошук відділення..."
                          value={branchSearchTerm}
                          onChange={(e) => {
                            setBranchSearchTerm(e.target.value);
                            loadBranches(formData.cityRef, e.target.value);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-blue-500"
                        />
                      </div>
                      <ul className="overflow-y-auto overflow-x-hidden p-0 m-0">
                        {branches.map(branch => (
                          <li 
                            key={branch.Ref}
                            onClick={() => handleBranchSelect(branch)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-800 border-b border-gray-100 last:border-b-0 break-words"
                          >
                            {branch.Description}
                          </li>
                        ))}
                        {branches.length === 0 && (
                          <li className="px-4 py-3 text-sm text-gray-500 text-center">Відділень не знайдено</li>
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
              <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <label className="flex flex-col mb-1 font-bold text-blue-900">
                  Використати бонуси
                  <span className="text-sm font-medium text-blue-700/80 mb-3">Доступно: {userBonusBalance} ₴ (1 бонус = 1 ₴)</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min={0}
                    max={userBonusBalance}
                    value={formData.bonusesUsed || ""}
                    onChange={handleBonusChange}
                    className="w-full sm:w-1/2 bg-white border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-black text-blue-900"
                    placeholder="0"
                  />
                  <span className="absolute left-[calc(50%-2rem)] sm:left-auto sm:right-auto sm:ml-[-2rem] top-3.5 font-black text-blue-900 pointer-events-none hidden sm:inline-block">₴</span>
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
                  <span>-{formData.bonusesUsed.toFixed(0)} ₴</span>
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
