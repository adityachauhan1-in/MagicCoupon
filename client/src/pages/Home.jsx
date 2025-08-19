import { useCoupons } from "../Context/CouponContext";
import CouponCard from "../components/CouponCard";
import Footer from "../components/Footer";
import { Banners } from "../components/Banner";
import { CategorySection } from "../components/CategorySection";

const Home = () => {
  const { filteredCoupons, loading, error, searchInput, handleSearchChange, selectedCategory } =
    useCoupons();

  if (loading) return <div className="flex justify-center items-center h-64">Loading amazing deals...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-600">{error}</div>;

  return (
    <>
      {/* Search */}
      <div className="flex justify-center p-6 bg-gradient-to-r from-green-100 to-green-50 shadow-md">
  <div className="relative w-full max-w-xl">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      🔍
    </span>
    <input
      type="text"
      placeholder="Search coupons..."
      value={searchInput}
      onChange={(e) => handleSearchChange(e.target.value)}
      className="w-full border border-gray-300 rounded-2xl pl-10 pr-4 py-3 
                 text-gray-700 placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 
                 shadow-sm transition-all duration-200"
    />
  </div>
</div>


      {/* Category */}
      <CategorySection />

      {/* Banner */}
      <Banners />

      {/* Coupons */}
      <div className="p-10">
        {filteredCoupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {filteredCoupons.map((coupon) => (
              <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 text-gray-600">No coupons found</div>
        )}
      </div>

      <Footer />
    </>
  );
};
export default Home;
