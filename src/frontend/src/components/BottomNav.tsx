import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Home,
  ShoppingCart,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const NAV_ITEMS = [
  { to: "/home", icon: Home, label: "Home", ocid: "nav.home_link" },
  { to: "/menu", icon: UtensilsCrossed, label: "Menu", ocid: "nav.menu_link" },
  { to: "/tiffin", icon: BookOpen, label: "Tiffin", ocid: "nav.tiffin_link" },
  { to: "/cart", icon: ShoppingCart, label: "Cart", ocid: "nav.cart_link" },
  { to: "/profile", icon: User, label: "Profile", ocid: "nav.profile_link" },
] as const;

export function BottomNav() {
  const { totalItems } = useCart();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card border-t border-border shadow-nav z-50">
      <div className="flex">
        {NAV_ITEMS.map(({ to, icon: Icon, label, ocid }) => {
          const isActive = currentPath === to;
          return (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2 px-1 text-xs transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                {to === "/cart" && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </div>
              <span className={cn("font-medium", isActive && "font-semibold")}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
