import { Badge } from "@/components/ui/badge";
import type { TiffinPlan } from "../data/tiffinData";

interface SubscriptionPlanCardProps {
  plan: TiffinPlan;
  index: number;
  onSubscribe: (plan: TiffinPlan) => void;
}

const TYPE_CONFIG = {
  lunch: { emoji: "☀️", label: "Lunch", bg: "bg-amber-50 border-amber-200" },
  dinner: { emoji: "🌙", label: "Dinner", bg: "bg-blue-50 border-blue-200" },
  combo: { emoji: "🌟", label: "Combo", bg: "bg-green-50 border-green-200" },
};

export function SubscriptionPlanCard({
  plan,
  index,
  onSubscribe,
}: SubscriptionPlanCardProps) {
  const config = TYPE_CONFIG[plan.type];

  return (
    <div
      data-ocid={`tiffin.plan.card.${index}`}
      className={`rounded-2xl border-2 p-4 flex flex-col gap-3 ${config.bg} transition-shadow hover:shadow-card`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-foreground">
                {plan.label}
              </h3>
              {plan.type === "combo" && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  Best Value
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {plan.totalMeals} meals · ₹{plan.perMeal}/meal
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-xl text-foreground">
            ₹{plan.price}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {plan.period}
          </p>
        </div>
      </div>
      {plan.savings ? (
        <p className="text-xs font-semibold text-primary bg-primary/10 rounded-lg px-2 py-1 text-center">
          🎉 Save ₹{plan.savings} on Combo!
        </p>
      ) : null}
      <button
        type="button"
        data-ocid={`tiffin.plan.subscribe_button.${index}`}
        onClick={() => onSubscribe(plan)}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm active:scale-[0.98] transition-transform"
      >
        Subscribe Now
      </button>
    </div>
  );
}
