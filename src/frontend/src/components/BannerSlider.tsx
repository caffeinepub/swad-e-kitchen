import { useEffect, useState } from "react";

const BANNERS = [
  {
    id: 1,
    title: "20% OFF",
    subtitle: "On your first order",
    emoji: "🎉",
    bg: "bg-gradient-to-r from-green-600 to-emerald-500",
  },
  {
    id: 2,
    title: "Free Delivery",
    subtitle: "On orders above \u20b9299",
    emoji: "🛵",
    bg: "bg-gradient-to-r from-teal-600 to-green-500",
  },
  {
    id: 3,
    title: "Tiffin Plans",
    subtitle: "Starting from just \u20b980/meal",
    emoji: "🥘",
    bg: "bg-gradient-to-r from-emerald-600 to-teal-500",
  },
];

export function BannerSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const banner = BANNERS[active];

  return (
    <div className="relative mx-4">
      <div
        className={`${banner.bg} rounded-2xl p-5 flex items-center justify-between transition-all duration-500`}
        style={{ minHeight: 100 }}
      >
        <div>
          <p className="text-white/80 text-xs font-medium uppercase tracking-widest">
            {banner.subtitle}
          </p>
          <h3 className="text-white text-2xl font-display font-bold mt-0.5">
            {banner.title}
          </h3>
          <button
            type="button"
            className="mt-2 bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-sm"
          >
            Order Now
          </button>
        </div>
        <span className="text-5xl">{banner.emoji}</span>
      </div>
      <div className="flex gap-1.5 justify-center mt-2">
        {BANNERS.map((b, i) => (
          <button
            type="button"
            key={b.id}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
