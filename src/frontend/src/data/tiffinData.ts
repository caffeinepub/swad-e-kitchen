export interface TiffinPlan {
  id: string;
  label: string;
  type: "lunch" | "dinner" | "combo";
  period: "weekly" | "monthly";
  price: number;
  perMeal: number;
  totalMeals: number;
  savings?: number;
  backendPlan: string;
}

export const TIFFIN_PLANS: TiffinPlan[] = [
  {
    id: "weeklyLunch",
    label: "Weekly Lunch",
    type: "lunch",
    period: "weekly",
    price: 560,
    perMeal: 80,
    totalMeals: 7,
    backendPlan: "weeklyLunch",
  },
  {
    id: "weeklyDinner",
    label: "Weekly Dinner",
    type: "dinner",
    period: "weekly",
    price: 560,
    perMeal: 80,
    totalMeals: 7,
    backendPlan: "weeklyDinner",
  },
  {
    id: "weeklyCombo",
    label: "Weekly Combo",
    type: "combo",
    period: "weekly",
    price: 1120,
    perMeal: 80,
    totalMeals: 14,
    savings: 0,
    backendPlan: "weeklyCombo",
  },
  {
    id: "monthlyLunch",
    label: "Monthly Lunch",
    type: "lunch",
    period: "monthly",
    price: 2400,
    perMeal: 80,
    totalMeals: 30,
    backendPlan: "monthlyLunch",
  },
  {
    id: "monthlyDinner",
    label: "Monthly Dinner",
    type: "dinner",
    period: "monthly",
    price: 2400,
    perMeal: 80,
    totalMeals: 30,
    backendPlan: "monthlyDinner",
  },
  {
    id: "monthlyCombo",
    label: "Monthly Combo",
    type: "combo",
    period: "monthly",
    price: 4800,
    perMeal: 80,
    totalMeals: 60,
    savings: 480,
    backendPlan: "monthlyCombo",
  },
];

export const WEEKLY_MENU = {
  lunch: [
    { day: "Mon", menu: "Dal Tadka + Jeera Rice + 2 Roti + Salad" },
    { day: "Tue", menu: "Rajma + Steamed Rice + 2 Roti + Papad" },
    { day: "Wed", menu: "Paneer Curry + Pulao + 2 Roti + Raita" },
    { day: "Thu", menu: "Chole + Rice + 2 Roti + Pickle" },
    { day: "Fri", menu: "Mixed Veg + Dal Fry + 2 Roti + Salad" },
    { day: "Sat", menu: "Kadhi Pakora + Rice + 2 Roti + Papad" },
    {
      day: "Sun",
      menu: "Special Paneer Butter Masala + Naan + Rice + Dessert",
    },
  ],
  dinner: [
    { day: "Mon", menu: "Aloo Matar + 3 Roti + Dal Soup" },
    { day: "Tue", menu: "Palak Paneer + 3 Roti + Salad" },
    { day: "Wed", menu: "Bhindi Masala + Dal + 3 Roti + Raita" },
    { day: "Thu", menu: "Pav Bhaji + Salad" },
    { day: "Fri", menu: "Veg Khichdi + Papad + Pickle" },
    { day: "Sat", menu: "Paneer Tikka Masala + 3 Roti + Rice" },
    {
      day: "Sun",
      menu: "Special Thali — 2 Sabzi + Dal + Rice + 3 Roti + Sweet",
    },
  ],
};
