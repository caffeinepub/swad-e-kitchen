import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Check, ChevronLeft } from "lucide-react";

const STEPS = [
  {
    id: 0,
    label: "Order Placed",
    emoji: "✅",
    desc: "Your order has been received",
  },
  {
    id: 1,
    label: "Preparing",
    emoji: "🍳",
    desc: "Our chefs are cooking your meal",
  },
  {
    id: 2,
    label: "Out for Delivery",
    emoji: "🛵",
    desc: "Your order is on the way",
  },
  { id: 3, label: "Delivered", emoji: "🏠", desc: "Enjoy your meal!" },
];

export default function TrackingPage() {
  const { orderId } = useParams({ from: "/tracking/$orderId" });
  const navigate = useNavigate();
  const currentStep = 1;

  return (
    <div className="app-shell pb-8">
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 px-4 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/home" })}
            className="text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display font-bold text-xl text-white">
            Order Tracking
          </h1>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-white/70 text-xs">Order ID</p>
          <p className="text-white font-bold text-sm font-mono"># {orderId}</p>
          <p className="text-white/80 text-sm mt-1">
            ⏱️ Estimated delivery:{" "}
            <span className="font-bold text-white">35–45 minutes</span>
          </p>
        </div>
      </div>

      <div data-ocid="tracking.order.panel" className="px-6 py-6">
        <div className="relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />
          <div
            className="absolute left-6 top-6 w-0.5 bg-primary transition-all duration-1000"
            style={{ height: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
          <div className="flex flex-col gap-6">
            {STEPS.map((step) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const isPending = step.id > currentStep;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div
                    className={cn(
                      "relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500",
                      isCompleted && "bg-primary border-primary",
                      isActive && "bg-primary border-primary pulse-green",
                      isPending && "bg-card border-border",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <span
                        className={cn("text-xl", isPending && "opacity-30")}
                      >
                        {step.emoji}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p
                      className={cn(
                        "font-display font-bold text-base",
                        isPending ? "text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {step.label}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-0.5",
                        isPending
                          ? "text-muted-foreground/50"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.desc}
                    </p>
                    {isActive && (
                      <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                        In Progress
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        ✓ Done
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-4 bg-card rounded-2xl p-4 shadow-card mb-6">
        <h3 className="font-display font-bold mb-2">Delivery Partner</h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
            🛵
          </div>
          <div>
            <p className="font-semibold text-sm">Ramesh Kumar</p>
            <p className="text-xs text-muted-foreground">
              ⭐ 4.8 · 230+ deliveries
            </p>
          </div>
          <button
            type="button"
            className="ml-auto bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-lg font-semibold"
          >
            Call
          </button>
        </div>
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="w-full border-2 border-primary text-primary py-3 rounded-2xl font-bold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
