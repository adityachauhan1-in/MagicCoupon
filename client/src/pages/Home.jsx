import React from "react";
import { useCoupons } from "../Context/CouponContext";
import CouponCard from "../components/CouponCard";
import { Banners } from "../components/Banner";
import { CategorySection } from "../components/CategorySection";

const Home = () => {
  const { filteredCoupons, loading, error, searchInput, handleSearchChange, clearSearch } = useCoupons();

  if (loading) 
    return 
    <div className="flex justify-center items-center h-64 text-xl text-indigo-600">
      Loading amazing deals...</div>;
  if (error) 
    return
   <div className="flex justify-center items-center h-64 text-red-600">{error}</div>;

  return (
    <>
      {/* Search Bar */}
      <div className="flex justify-center p-6 bg-gradient-to-r from-indigo-100 to-purple-100 shadow-md pt-20">
        <div className="relative w-full max-w-xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl pl-10 pr-12 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-md transition-all duration-300 hover:shadow-lg"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <CategorySection />

      {/* Banner */}
      <div className="my-6 px-4"><Banners /></div>

      {/* Coupons Grid */}
  <div className="container mx-auto px-4 py-8">
    {filteredCoupons.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCoupons.map((coupon) => (
          <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">No coupons found 😢</h2>
            <p className="text-gray-500 mb-6">Try searching for other categories or check back later for new deals!</p>
                <button
              onClick={() => handleSearchChange("")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
