import { useState, useEffect } from "react";
import axios from "axios";

import { Utensils, Smartphone, Plane, ShoppingBag, HeartPulse, Clapperboard, Grid } from "lucide-react";

const categories = [
  { name: "All", icon: <Grid className="w-5 h-5" /> }, // NEW ✅
  { name: "Food", icon: <Utensils className="w-5 h-5" /> },
  { name: "Electronics", icon: <Smartphone className="w-5 h-5" /> },
  { name: "Travel", icon: <Plane className="w-5 h-5" /> },
  { name: "Fashion", icon: <ShoppingBag className="w-5 h-5" /> },
  { name: "Health", icon: <HeartPulse className="w-5 h-5" /> },
  { name: "Entertainment", icon: <Clapperboard className="w-5 h-5" /> },
];

const CouponsByCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default All ✅
  const [coupons, setCoupons] = useState([]);
  const [searchInput, setSearchInput] = useState('');


  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        let url =
          selectedCategory === "All"
            ? "/api/coupons" // fetch all coupons
            : `/api/coupons/category/${selectedCategory}`;

        const { data } = await axios.get(url);
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons", error);
      }
    };
    fetchCoupons();
  }, [selectedCategory]);

  return ( 
    <> 
   
    <div className="p-4">
      {/* Category Buttons */}
      <div className="flex gap-3 overflow-x-auto pb-3">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all ${
              selectedCategory === cat.name
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="rounded-xl shadow-lg bg-white p-4 hover:scale-[1.02] transition"
          >
            <img
              src={coupon.image}
              alt={coupon.title}
              className="rounded-lg mb-3 h-32 w-full object-cover"
            />
            <h3 className="font-bold text-lg">{coupon.title}</h3>
            <p className="text-sm text-gray-600">{coupon.store}</p>
            <p className="text-green-600 font-semibold mt-1">
              {coupon.discountPercentage}% OFF
            </p>
            <p className="text-xs mt-2">
              Use Code:{" "}
              <span className="font-mono bg-gray-200 px-1 rounded">
                {coupon.code}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default CouponsByCategory;
