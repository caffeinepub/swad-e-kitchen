import { useNavigate } from "@tanstack/react-router";
import { Bike, ChevronLeft, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VegBadge } from "../components/VegBadge";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { actor } = useActor();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState(3);
  const [placing, setPlacing] = useState(false);

  const deliveryCharge = Math.round(14 * distance);
  const handlingCharge = totalPrice < 199 ? 15 : 0;
  const platformFee = 15;
  const grandTotal = totalPrice + deliveryCharge + handlingCharge + platformFee;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setPlacing(true);
    try {
      if (actor) {
        await actor.clearCart();
        for (const ci of items) {
          await actor.addToCart(BigInt(ci.item.id), BigInt(ci.quantity));
        }
        const orderId = await actor.placeOrder(address, distance);
        clearCart();
        navigate({
          to: "/tracking/$orderId",
          params: { orderId: orderId.toString() },
        });
      } else {
        clearCart();
        navigate({
          to: "/tracking/$orderId",
          params: { orderId: `demo-${Date.now()}` },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="app-shell pb-8">
      <div className="bg-primary px-4 pt-10 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/cart" })}
            className="text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display font-bold text-xl text-white">
            Checkout
          </h1>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="bg-card rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold">Delivery Address</h3>
          </div>
          <textarea
            data-ocid="checkout.address.input"
            placeholder="Enter your full delivery address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full bg-secondary rounded-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Bike className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold">Delivery Distance</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDistance((d) => Math.max(1, d - 1))}
              className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center font-bold text-lg"
            >
              −
            </button>
            <input
              data-ocid="checkout.distance.input"
              type="number"
              min={1}
              max={20}
              value={distance}
              onChange={(e) => setDistance(Math.max(1, Number(e.target.value)))}
              className="flex-1 text-center bg-secondary rounded-xl py-2 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setDistance((d) => Math.min(20, d + 1))}
              className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center font-bold text-lg"
            >
              +
            </button>
            <span className="text-muted-foreground font-medium">km</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            ₹14 per km · Delivery charge: ₹{deliveryCharge}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-display font-bold">Order Summary</h3>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            {items.map((ci) => (
              <div key={ci.item.id} className="flex items-center gap-2">
                <VegBadge />
                <span className="text-sm flex-1 text-muted-foreground">
                  {ci.item.name} × {ci.quantity}
                </span>
                <span className="text-sm font-medium">
                  ₹{ci.item.price * ci.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-display font-bold">Bill Details</h3>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Item Total</span>
              <span className="font-medium">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Delivery Charge ({distance} km × ₹14)
              </span>
              <span className="font-medium">₹{deliveryCharge}</span>
            </div>
            {handlingCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Handling Charge</span>
                <span className="font-medium">₹{handlingCharge}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform Fee</span>
              <span className="font-medium">₹{platformFee}</span>
            </div>
            {handlingCharge === 0 && (
              <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-lg">
                ✓ No handling charge (order above ₹199)
              </p>
            )}
            <div className="border-t border-dashed border-border pt-2.5 flex justify-between font-bold text-base">
              <span>Grand Total</span>
              <span className="text-primary">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          data-ocid="checkout.place_order_button"
          onClick={handlePlaceOrder}
          disabled={placing}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-display font-bold text-base shadow-lg active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {placing
            ? "Placing Order..."
            : `Place Order \u00b7 \u20b9${grandTotal}`}
        </button>
      </div>
    </div>
  );
}
