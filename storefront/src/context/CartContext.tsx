import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, WoodFinish } from "../types/product";
import { CartItem, PricingBreakdown } from "../types/commerce";
import { WOOD_FINISHES } from "../data/timbers";
import { validateCartServerSide } from "../server/cartValidator";

interface CartContextValue {
  items: CartItem[];
  totalItemsCount: number;
  subtotalUsd: number;
  pricing: PricingBreakdown;
  isCartOpen: boolean;
  isValidating: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, finish?: WoodFinish, customEngraving?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  syncAuthoritativePricing: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mukango_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [promoCode, setPromoCode] = useState<string>("");

  const [pricing, setPricing] = useState<PricingBreakdown>(() => {
    const initialValidation = validateCartServerSide({
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, finishId: i.selectedFinish.id })),
    });
    return initialValidation.pricing;
  });

  // Persist items to localStorage (remove the record entirely when empty)
  useEffect(() => {
    try {
      if (items.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // Storage unavailable or disabled
    }
  }, [items]);

  // Recalculate server-authoritative pricing whenever items or promoCode change
  const syncAuthoritativePricing = useCallback(async () => {
    setIsValidating(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          finishId: i.selectedFinish.id,
          customEngraving: i.customEngraving,
        })),
        promoCode,
      };

      // In browser, try real API fetch, fallback to server-side validator function
      let resData;
      try {
        const response = await fetch("/api/cart/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const json = await response.json();
          resData = json.result;
        }
      } catch {
        // Fallback directly to validator module
      }

      if (!resData) {
        resData = validateCartServerSide(payload);
      }

      setPricing(resData.pricing);
    } catch (err) {
      console.error("Cart sync error:", err);
    } finally {
      setIsValidating(false);
    }
  }, [items, promoCode]);

  useEffect(() => {
    syncAuthoritativePricing();
  }, [syncAuthoritativePricing]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addItem = useCallback(
    (product: Product, quantity = 1, finish = WOOD_FINISHES[0], customEngraving?: string) => {
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (i) => i.productId === product.id && i.selectedFinish.id === finish.id
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          const newQty = Math.min(10, updated[existingIndex].quantity + quantity);
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            customEngraving: customEngraving || updated[existingIndex].customEngraving,
          };
          return updated;
        }

        const newItem: CartItem = {
          id: `${product.id}-${finish.id}`,
          productId: product.id,
          product,
          quantity: Math.min(10, Math.max(1, quantity)),
          selectedFinish: finish,
          customEngraving,
          addedAt: new Date().toISOString(),
        };

        return [...prevItems, newItem];
      });

      setIsCartOpen(true);
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: Math.min(10, quantity) } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const applyPromoCode = useCallback(async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "HEIRLOOM10") {
      setPromoCode("HEIRLOOM10");
      return { success: true, message: "10% Collectors Circle privilege applied to order." };
    }
    return { success: false, message: "Invalid promotional code." };
  }, []);

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalUsd = items.reduce((acc, item) => acc + item.product.basePriceUsd * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotalUsd,
        pricing,
        isCartOpen,
        isValidating,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromoCode,
        syncAuthoritativePricing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
