"use client";

import { useEffect } from "react";
import { Product } from "@/types/database";

type FlyDetail = { product: Product; sourceRect: DOMRect };

const FLY_DURATION = 450;

export default function AddToCartFly() {
  useEffect(() => {
    const handler = (e: CustomEvent<FlyDetail>) => {
      const { product, sourceRect } = e.detail;
      const cartEl = document.querySelector("[data-cart-target]");
      if (!cartEl) return;

      const endRect = cartEl.getBoundingClientRect();
      const startX = sourceRect.left + sourceRect.width / 2;
      const startY = sourceRect.top + sourceRect.height / 2;
      const endX = endRect.left + endRect.width / 2;
      const endY = endRect.top + endRect.height / 2;

      const fly = document.createElement("div");
      fly.className = "add-to-cart-fly";
      fly.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: 48px;
        height: 48px;
        margin-left: -24px;
        margin-top: -24px;
        border-radius: 12px;
        overflow: hidden;
        z-index: 9999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        pointer-events: none;
        transition: left ${FLY_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    top ${FLY_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    transform ${FLY_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    opacity ${FLY_DURATION * 0.6}ms ease-out;
      `;

      if (product.image_url) {
        const img = document.createElement("img");
        img.src = product.image_url;
        img.alt = product.name;
        img.style.cssText = "width:100%;height:100%;object-fit:cover;";
        fly.appendChild(img);
      } else {
        fly.style.background = "linear-gradient(135deg,#f97316 0%,#ea580c 100%)";
        fly.style.display = "flex";
        fly.style.alignItems = "center";
        fly.style.justifyContent = "center";
        fly.style.color = "white";
        fly.style.fontSize = "20px";
        fly.textContent = "+";
      }

      document.body.appendChild(fly);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fly.style.left = `${endX}px`;
          fly.style.top = `${endY}px`;
          fly.style.transform = "scale(0.3)";
          fly.style.opacity = "0.7";
        });
      });

      setTimeout(() => fly.remove(), FLY_DURATION + 50);
    };

    window.addEventListener("cart:fly" as never, handler as EventListener);
    return () => window.removeEventListener("cart:fly" as never, handler as EventListener);
  }, []);

  return null;
}
