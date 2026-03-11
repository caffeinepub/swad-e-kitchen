export interface LocalFoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  imageUrl: string;
}

export const FOOD_ITEMS: LocalFoodItem[] = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    description: "Rich creamy tomato gravy with soft paneer cubes",
    price: 180,
    category: "Paneer",
    rating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Dal Tadka",
    description: "Tempered yellow dal with ghee, cumin and spices",
    price: 120,
    category: "Rice",
    rating: 4.3,
    imageUrl:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Veg Biryani",
    description: "Fragrant basmati rice with mixed vegetables and saffron",
    price: 160,
    category: "Rice",
    rating: 4.4,
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Masala Maggi",
    description: "Spicy street-style Maggi with veggies and secret masala",
    price: 80,
    category: "Maggi",
    rating: 4.2,
    imageUrl:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Gulab Jamun",
    description: "Soft milk-solid dumplings soaked in rose sugar syrup",
    price: 60,
    category: "Sweets",
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Chole Bhature",
    description: "Spicy chickpea curry served with fluffy deep-fried bhature",
    price: 140,
    category: "Paneer",
    rating: 4.4,
    imageUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    name: "Aloo Paratha",
    description: "Stuffed potato flatbread served with butter and fresh curd",
    price: 90,
    category: "Vrat",
    rating: 4.3,
    imageUrl:
      "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    name: "Pav Bhaji",
    description: "Mumbai-style spiced mashed veggies served with buttered pav",
    price: 110,
    category: "Maggi",
    rating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
  },
];

export const CATEGORIES = ["All", "Paneer", "Rice", "Maggi", "Sweets", "Vrat"];

export const CATEGORY_EMOJIS: Record<string, string> = {
  All: "🍽️",
  Paneer: "🧀",
  Rice: "🍚",
  Maggi: "🍜",
  Sweets: "🍮",
  Vrat: "🪔",
};
