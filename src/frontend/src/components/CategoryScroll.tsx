import { CATEGORIES, CATEGORY_EMOJIS } from "../data/foodData";

interface CategoryScrollProps {
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryScroll({ selected, onSelect }: CategoryScrollProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto hide-scrollbar px-4 py-1">
      {CATEGORIES.map((cat) => (
        <button
          type="button"
          key={cat}
          data-ocid="home.category.tab"
          onClick={() => onSelect(cat)}
          className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
            selected === cat
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card text-foreground shadow-xs hover:bg-secondary"
          }`}
        >
          <span className="text-xl">{CATEGORY_EMOJIS[cat]}</span>
          <span className="text-xs font-semibold whitespace-nowrap">{cat}</span>
        </button>
      ))}
    </div>
  );
}
