import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BottomNav } from "../components/BottomNav";
import { SubscriptionPlanCard } from "../components/SubscriptionPlanCard";
import { TIFFIN_PLANS, WEEKLY_MENU } from "../data/tiffinData";
import type { TiffinPlan } from "../data/tiffinData";

export default function TiffinPage() {
  const navigate = useNavigate();
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const handleSubscribe = (plan: TiffinPlan) => {
    setSubscribing(plan.id);
    setTimeout(() => {
      toast.success(`Subscribed to ${plan.label}! \u20b9${plan.price}/month`);
      setSubscribing(null);
    }, 1000);
  };

  return (
    <div className="app-shell pb-24">
      <div className="bg-gradient-to-br from-green-600 to-teal-700 px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/home" })}
            className="text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-white">
              Tiffin Plans 🥘
            </h1>
            <p className="text-white/70 text-sm">
              Healthy meals, delivered daily
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-4">
        {[
          { icon: "🥗", label: "100% Veg" },
          { icon: "🏠", label: "Home Style" },
          { icon: "⏱️", label: "On Time" },
        ].map((usp) => (
          <div
            key={usp.label}
            className="bg-card rounded-xl p-3 flex flex-col items-center gap-1 shadow-xs"
          >
            <span className="text-2xl">{usp.icon}</span>
            <span className="text-xs font-semibold text-foreground">
              {usp.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mx-4 bg-primary/10 rounded-xl px-4 py-3 mb-4">
        <p className="text-primary font-bold text-sm">
          💰 All plans at just ₹80/meal
        </p>
        <p className="text-muted-foreground text-xs mt-0.5">
          Fresh, homestyle vegetarian meals delivered to your doorstep
        </p>
      </div>

      <section className="px-4 mb-6">
        <h2 className="font-display font-bold text-lg mb-3">
          Choose Your Plan
        </h2>
        <div className="flex flex-col gap-3">
          {TIFFIN_PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className={subscribing === plan.id ? "opacity-70" : ""}
            >
              <SubscriptionPlanCard
                plan={plan}
                index={i + 1}
                onSubscribe={handleSubscribe}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 mb-6">
        <h2 className="font-display font-bold text-lg mb-3">
          This Week's Menu 📋
        </h2>
        <Tabs defaultValue="lunch">
          <TabsList className="w-full bg-secondary mb-4">
            <TabsTrigger
              value="lunch"
              data-ocid="tiffin.menu.tab"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              ☀️ Lunch
            </TabsTrigger>
            <TabsTrigger
              value="dinner"
              data-ocid="tiffin.menu.tab"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              🌙 Dinner
            </TabsTrigger>
          </TabsList>
          {(["lunch", "dinner"] as const).map((type) => (
            <TabsContent key={type} value={type}>
              <div className="flex flex-col gap-2">
                {WEEKLY_MENU[type].map((entry) => (
                  <div
                    key={entry.day}
                    className="bg-card rounded-xl px-4 py-3 flex gap-3 items-start shadow-xs"
                  >
                    <span className="font-display font-bold text-sm text-primary w-8 flex-shrink-0">
                      {entry.day}
                    </span>
                    <p className="text-sm text-foreground flex-1">
                      {entry.menu}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <BottomNav />
    </div>
  );
}
