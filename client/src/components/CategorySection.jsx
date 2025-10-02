import { Utensils, Smartphone, Plane, ShoppingBag, HeartPulse, Clapperboard, Grid } from "lucide-react";
import { useCoupons } from "../Context/CouponContext";

      const categories = [
  { name: "All", icon: <Grid className="w-5 h-5" /> },
  { name: "Food", icon: <Utensils className="w-5 h-5" /> },
  { name: "Electronics", icon: <Smartphone className="w-5 h-5" /> },
  { name: "Travel", icon: <Plane className="w-5 h-5" /> },
  { name: "Fashion", icon: <ShoppingBag className="w-5 h-5" /> },
  { name: "Health", icon: <HeartPulse className="w-5 h-5" /> },
  { name: "Entertainment", icon: <Clapperboard className="w-5 h-5" /> },
];

export const CategorySection = () => {
  const { selectedCategory, setSelectedCategory } = useCoupons();

  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3 bg-white shadow-lg rounded-2xl justify-center scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => setSelectedCategory(cat.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 ${
            selectedCategory === cat.name
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
};
