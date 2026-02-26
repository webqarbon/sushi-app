"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCartStore();

  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const totalBonuses = items.reduce(
    (acc, item) =>
      acc + (item.product.price * item.product.bonus_percent) / 100 * item.quantity,
    0
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-gray-900" />
            <h2 className="text-xl font-bold text-gray-900">Кошик</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
              {items.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-4">
              <ShoppingCart className="w-16 h-16 text-gray-200" />
              <p className="max-w-[200px]">Ваш кошик наразі порожній</p>
              <button 
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-full hover:bg-blue-100 transition-colors"
              >
                До покупок
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                    {item.product.name}
                  </h3>
                  <div className="text-sm font-black text-gray-900 mb-4">
                    {item.product.price.toFixed(0)} ₴
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                      <button 
                        onClick={() => {
                          if (item.quantity > 1) updateQuantity(item.product.id, item.quantity - 1);
                          else removeItem(item.product.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-sm w-4 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 underline underline-offset-2"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Загальна сума</span>
              <span className="text-xl font-black text-gray-900">{totalPrice.toFixed(0)} ₴</span>
            </div>
            <div className="flex justify-between items-center mb-6 py-2 px-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <span className="text-sm font-medium text-blue-700">Очікувані бонуси</span>
              <span className="text-sm font-bold text-blue-700">+{totalBonuses.toFixed(1)} ₴</span>
            </div>
            
            <Link 
              href="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 group"
            >
              Оформити замовлення
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
