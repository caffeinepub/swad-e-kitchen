import { useNavigate } from "@tanstack/react-router";
import { Bell, MapPin, Mic, Search } from "lucide-react";
import { useState } from "react";
import { BannerSlider } from "../components/BannerSlider";
import { BottomNav } from "../components/BottomNav";
import { CartBar } from "../components/CartBar";
import { CategoryScroll } from "../components/CategoryScroll";
import { FoodCard } from "../components/FoodCard";
import { FOOD_ITEMS } from "../data/foodData";

export default function HomePage() {
  const [location, setLocation] = useState<"home" | "work">("home");
  const [mode, setMode] = useState<"food" | "tiffin">("food");
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

  const todayOffers = FOOD_ITEMS.slice(0, 4);
  const popular = FOOD_ITEMS.filter((f) => f.rating >= 4.4);
  const fastDelivery = FOOD_ITEMS.filter((f) => f.price <= 120);

  return (
    <div className="app-shell pb-28">
      <div className="bg-primary px-4 pt-10 pb-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-xs font-medium">Delivering to</p>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-base font-display">
                  {location === "home" ? "Home Address" : "Work Address"}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
          </div>

          <div data-ocid="home.location.toggle" className="flex gap-2 mb-4">
            {(["home", "work"] as const).map((loc) => (
              <button
                type="button"
                key={loc}
                onClick={() => setLocation(loc)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all capitalize ${
                  location === loc
                    ? "bg-white text-primary shadow-md"
                    : "bg-white/20 text-white"
                }`}
              >
                {loc === "home" ? "🏠 Home" : "💼 Work"}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              data-ocid="home.search_input"
              type="text"
              placeholder="Search for food, dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Mic className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <div
          data-ocid="home.mode.toggle"
          className="flex bg-secondary rounded-xl p-1 w-full"
        >
          {(["food", "tiffin"] as const).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => {
                setMode(m);
                if (m === "tiffin") navigate({ to: "/tiffin" });
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                mode === m
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground"
              }`}
            >
              {m === "food" ? "🍽️ Food" : "🥘 Tiffin"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <BannerSlider />
      </div>

      <div className="mb-4">
        <CategoryScroll selected={selectedCat} onSelect={setSelectedCat} />
      </div>

      {search ? (
        <section className="px-4">
          <h2 className="font-display font-bold text-lg mb-3">
            Search Results ({filtered.length})
          </h2>
          {filtered.length === 0 ? (
            <div
              data-ocid="food.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-4xl mb-2">🔍</p>
              <p className="font-medium">No items found</p>
            </div>
          ) : (
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
          )}
        </section>
      ) : (
        <div className="flex flex-col gap-6">
          <FoodSection
            title="Today's Offers 🔥"
            items={selectedCat === "All" ? todayOffers : filtered.slice(0, 4)}
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
          />
          <FoodSection
            title="Popular Items ⭐"
            items={selectedCat === "All" ? popular : filtered}
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
          />
          <FoodSection
            title="Fast Delivery ⚡"
            items={selectedCat === "All" ? fastDelivery : filtered.slice(0, 2)}
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
          />
        </div>
      )}

      <CartBar />
      <BottomNav />
    </div>
  );
}

function FoodSection({
  title,
  items,
  favourites,
  onToggleFavourite,
}: {
  title: string;
  items: typeof FOOD_ITEMS;
  favourites: Set<number>;
  onToggleFavourite: (id: number) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="px-4">
      <h2 className="font-display font-bold text-lg mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <FoodCard
            key={item.id}
            item={item}
            index={i + 1}
            isFavourite={favourites.has(item.id)}
            onToggleFavourite={onToggleFavourite}
          />
        ))}
      </div>
    </section>
  );
}
