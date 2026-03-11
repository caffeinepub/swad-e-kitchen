import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { LocalFoodItem } from "../data/foodData";

export interface CartItemLocal {
  item: LocalFoodItem;
  quantity: number;
}

interface CartContextType {
  items: CartItemLocal[];
  addItem: (item: LocalFoodItem) => void;
  removeItem: (itemId: number) => void;
  updateQty: (itemId: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemLocal[]>(() => {
    try {
      const stored = localStorage.getItem("swad-cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("swad-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: LocalFoodItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setItems((prev) => prev.filter((i) => i.item.id !== itemId));
  }, []);

  const updateQty = useCallback((itemId: number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.item.id !== itemId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.item.id === itemId ? { ...i, quantity: qty } : i)),
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.item.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
