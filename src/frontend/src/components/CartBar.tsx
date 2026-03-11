import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export function CartBar() {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 z-40 pointer-events-none">
      <button
        type="button"
        data-ocid="cart.bar.button"
        onClick={() => navigate({ to: "/cart" })}
        className="w-full pointer-events-auto bg-primary text-primary-foreground rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2">
          <div className="bg-white/20 rounded-lg p-1.5">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">
            {totalItems} item{totalItems > 1 ? "s" : ""}
          </span>
        </div>
        <span className="text-sm font-bold">₹{totalPrice}</span>
        <span className="text-sm font-semibold">View Cart →</span>
      </button>
    </div>
  );
}
