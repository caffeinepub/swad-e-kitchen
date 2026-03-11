import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Search } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { CartBar } from "../components/CartBar";
import { FoodCard } from "../components/FoodCard";
import { CATEGORIES, CATEGORY_EMOJIS, FOOD_ITEMS } from "../data/foodData";

export default function MenuPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [favourites, setFavourites] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const toggleFavourite = (id: number) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = FOOD_ITEMS.filter(
    (f) =>
      (selectedCat === "All" || f.category === selectedCat) &&
      f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="app-shell pb-28">
      <div className="sticky top-0 z-30 bg-primary px-4 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/home" })}
            className="text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display font-bold text-xl text-white">
            Full Menu
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            data-ocid="home.search_input"
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-3">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            data-ocid="home.category.tab"
            onClick={() => setSelectedCat(cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedCat === cat
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card text-foreground shadow-xs"
            }`}
          >
            <span>{CATEGORY_EMOJIS[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4">
        {filtered.length === 0 ? (
          <div
            data-ocid="food.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <p className="text-5xl mb-3">🍽️</p>
            <p className="font-semibold">No items found</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-3">
              {filtered.length} items
            </p>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((item, i) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  index={i + 1}
                  isFavourite={favourites.has(item.id)}
                  onToggleFavourite={toggleFavourite}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CartBar />
      <BottomNav />
    </div>
  );
}
