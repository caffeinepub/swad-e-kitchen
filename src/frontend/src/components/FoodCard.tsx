import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import type { LocalFoodItem } from "../data/foodData";
import { VegBadge } from "./VegBadge";

interface FoodCardProps {
  item: LocalFoodItem;
  index: number;
  isFavourite?: boolean;
  onToggleFavourite?: (id: number) => void;
}

export function FoodCard({
  item,
  index,
  isFavourite = false,
  onToggleFavourite,
}: FoodCardProps) {
  const { items, addItem, updateQty } = useCart();
  const cartItem = items.find((i) => i.item.id === item.id);
  const quantity = cartItem?.quantity ?? 0;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      data-ocid={`food.card.item.${index}`}
      className="bg-card rounded-xl shadow-card overflow-hidden flex flex-col transition-shadow hover:shadow-card-hover"
    >
      <div className="relative">
        {!imgError ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-36 object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-36 bg-accent flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}
        <button
          type="button"
          data-ocid={`food.favourite.toggle.${index}`}
          onClick={() => onToggleFavourite?.(item.id)}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-90"
          aria-label={
            isFavourite ? "Remove from favourites" : "Add to favourites"
          }
        >
          <Heart
            className={cn(
              "w-4 h-4",
              isFavourite ? "fill-red-500 text-red-500" : "text-gray-400",
            )}
          />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-1.5">
          <VegBadge />
          <span className="font-semibold text-sm text-foreground line-clamp-1">
            {item.name}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {item.description}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-foreground">
            {item.rating}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-base text-foreground">
            ₹{item.price}
          </span>
          {quantity === 0 ? (
            <Button
              type="button"
              data-ocid={`food.add_button.${index}`}
              size="sm"
              onClick={() => addItem(item)}
              className="h-7 px-4 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
            >
              ADD
            </Button>
          ) : (
            <div className="flex items-center gap-1 bg-primary rounded-lg">
              <button
                type="button"
                onClick={() => updateQty(item.id, quantity - 1)}
                className="w-7 h-7 flex items-center justify-center text-primary-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-sm font-bold text-primary-foreground">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => addItem(item)}
                className="w-7 h-7 flex items-center justify-center text-primary-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
