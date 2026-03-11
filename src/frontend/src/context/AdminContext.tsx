import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { FOOD_ITEMS } from "../data/foodData";
import type { LocalFoodItem } from "../data/foodData";

export interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: "Pending" | "Preparing" | "Delivered";
  createdAt: string;
}

const ADMIN_PASSWORD = "swad@admin123";

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD001",
    customerName: "Rahul Sharma",
    items: ["Paneer Butter Masala", "Veg Biryani"],
    total: 340,
    status: "Delivered",
    createdAt: "2026-03-10T10:30:00Z",
  },
  {
    id: "ORD002",
    customerName: "Priya Patel",
    items: ["Dal Tadka", "Aloo Paratha", "Gulab Jamun"],
    total: 270,
    status: "Preparing",
    createdAt: "2026-03-11T08:15:00Z",
  },
  {
    id: "ORD003",
    customerName: "Amit Verma",
    items: ["Chole Bhature", "Masala Maggi"],
    total: 220,
    status: "Pending",
    createdAt: "2026-03-11T09:45:00Z",
  },
  {
    id: "ORD004",
    customerName: "Sunita Joshi",
    items: ["Pav Bhaji"],
    total: 110,
    status: "Pending",
    createdAt: "2026-03-11T11:00:00Z",
  },
  {
    id: "ORD005",
    customerName: "Deepak Gupta",
    items: ["Veg Biryani", "Gulab Jamun"],
    total: 220,
    status: "Delivered",
    createdAt: "2026-03-10T14:20:00Z",
  },
];

interface AdminContextType {
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  menuItems: LocalFoodItem[];
  addMenuItem: (item: Omit<LocalFoodItem, "id">) => void;
  updateMenuItem: (item: LocalFoodItem) => void;
  deleteMenuItem: (id: number) => void;
  orders: Order[];
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("swad-admin-auth") === "true";
  });

  const [menuItems, setMenuItems] = useState<LocalFoodItem[]>(() => {
    try {
      const stored = localStorage.getItem("swad-admin-menu");
      return stored ? JSON.parse(stored) : FOOD_ITEMS;
    } catch {
      return FOOD_ITEMS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem("swad-admin-orders");
      return stored ? JSON.parse(stored) : MOCK_ORDERS;
    } catch {
      return MOCK_ORDERS;
    }
  });

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem("swad-admin-auth", "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("swad-admin-auth");
  }, []);

  const addMenuItem = useCallback((item: Omit<LocalFoodItem, "id">) => {
    setMenuItems((prev) => {
      const newItem: LocalFoodItem = {
        ...item,
        id: Math.max(0, ...prev.map((i) => i.id)) + 1,
      };
      const updated = [...prev, newItem];
      localStorage.setItem("swad-admin-menu", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateMenuItem = useCallback((item: LocalFoodItem) => {
    setMenuItems((prev) => {
      const updated = prev.map((i) => (i.id === item.id ? item : i));
      localStorage.setItem("swad-admin-menu", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteMenuItem = useCallback((id: number) => {
    setMenuItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem("swad-admin-menu", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateOrderStatus = useCallback(
    (id: string, status: Order["status"]) => {
      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === id ? { ...o, status } : o));
        localStorage.setItem("swad-admin-orders", JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  return (
    <AdminContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        orders,
        updateOrderStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
