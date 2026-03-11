import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus, Trash2 } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { VegBadge } from "../components/VegBadge";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, updateQty, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="app-shell pb-24">
        <div className="bg-primary px-4 pt-10 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/home" })}
              className="text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="font-display font-bold text-xl text-white">
              My Cart
            </h1>
          </div>
        </div>
        <div
          data-ocid="cart.empty_state"
          className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4"
        >
          <span className="text-7xl">🛒</span>
          <p className="font-display font-bold text-xl text-foreground">
            Your cart is empty
          </p>
          <p className="text-sm text-center px-8">
            Add some delicious vegetarian dishes to get started!
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/menu" })}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-bold"
          >
            Browse Menu
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-shell pb-24">
      <div className="bg-primary px-4 pt-10 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/home" })}
            className="text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display font-bold text-xl text-white">My Cart</h1>
          <span className="text-white/70 text-sm ml-auto">
            {items.length} item{items.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {items.map((ci, i) => (
          <div
            key={ci.item.id}
            data-ocid={`cart.item.${i + 1}`}
            className="bg-card rounded-2xl p-3 flex gap-3 shadow-xs"
          >
            <img
              src={ci.item.imageUrl}
              alt={ci.item.name}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <VegBadge />
                <p className="font-semibold text-sm text-foreground truncate">
                  {ci.item.name}
                </p>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {ci.item.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="font-bold text-primary">
                  ₹{ci.item.price * ci.quantity}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(ci.item.id, ci.quantity - 1)}
                    className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center"
                  >
                    <Minus className="w-3.5 h-3.5 text-foreground" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">
                    {ci.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(ci.item.id, ci.quantity + 1)}
                    className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary-foreground" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(ci.item.id)}
                    className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 bg-card rounded-2xl shadow-xs overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-display font-bold">Bill Summary</h3>
        </div>
        <div className="px-4 py-3 flex flex-col gap-2">
          {items.map((ci) => (
            <div key={ci.item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {ci.item.name} × {ci.quantity}
              </span>
              <span className="font-medium">
                ₹{ci.item.price * ci.quantity}
              </span>
            </div>
          ))}
          <div className="border-t border-dashed border-border pt-2 mt-1 flex justify-between font-bold">
            <span>Item Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="px-4">
        <button
          type="button"
          data-ocid="cart.checkout_button"
          onClick={() => navigate({ to: "/checkout" })}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-display font-bold text-base shadow-lg active:scale-[0.98] transition-transform"
        >
          Proceed to Checkout →
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
