import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import CouponCard from "../components/CouponCard";
import { useCoupons } from "../Context/CouponContext";


const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "https://magiccoupon-backend.onrender.com").replace(/^["']|["']$/g, '');

const Coupons = () => {
  const { searchInput, handleSearchChange, clearSearch } = useCoupons();
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [savedCoupons, setSavedCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const fetchSavedCoupons = async () => {
      try {
        if (!user) {
          setSavedCoupons([]);
          setLoading(false);
          return; 
                          }
                     const token = localStorage.getItem("token");
                     const res = await axios.get(`${API_BASE_URL}/api/coupons/saved/list`, {
                  
                       headers: { Authorization: `Bearer ${token}` },
                       
        });
    
        if (res.data?.success) setSavedCoupons(res.data.data || []);
        else toast.error(res.data?.message || "  Failed to load saved coupons");
      } catch (err) {
        // Error handled by user-friendly message display
      
        toast.error(err.response?.data?.message || " Failed to load saved coupons");
      } finally {
        setLoading(false);
      }
    };
    fetchSavedCoupons();
  }, [user]); // this is a dependency array that tells react to re-run the effect when the user state changes

  const filteredCoupons = savedCoupons.filter((coupon) => {
    const search = debouncedSearch.toLowerCase();
    return (
             coupon.title?.toLowerCase().includes(search) ||
             coupon.name?.toLowerCase().includes(search) ||     // search the coupon in any way ..
             coupon.store?.toLowerCase().includes(search) ||
      coupon.description?.toLowerCase().includes(search)
    );
  });

  const handleRemoveCoupon = (savedCouponId) => {
    setSavedCoupons((prev) => prev.filter((c) => c._id !== savedCouponId));
  };

  if (loading)
     return 
     <div className="flex justify-center items-center h-64 text-center text-bold text-xl text-purple-700">
      Loading your coupons...</div>;

  return (
    
   
    <div className="min-h-screen bg-gray-50 pt-10">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-200 to-green-100 py-10 shadow-md">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-4xl font-extrabold text-green-900 mb-4 md:mb-0">My Saved Coupons</h1>
                   <div className="relative w-full md:w-96">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-lg">🔍</span>
                     <input
                       type="text"
                       placeholder="Search coupons..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full border border-gray-300 rounded-full pl-10 pr-12 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 shadow-sm transition-all duration-200"
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
      </div>

      {/* Coupons List */}
      <div className="container mx-auto px-4 py-10">
        {savedCoupons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <p className="text-2xl font-semibold text-gray-700 mb-2">You have no saved coupons yet!</p>
            <p className="text-gray-500">Browse our homepage to find amazing deals and save your favorites here.</p>
                          </div>
                        ) : filteredCoupons.length === 0 ? (
                          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
                            <p className="text-2xl font-semibold text-gray-700 mb-2">No coupons found for "{debouncedSearch}"</p>
                            <p className="text-gray-500">Try changing your search or browse other categories.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCoupons.map((coupon) => (
                              <CouponCard
                                key={coupon._id}
                coupon={coupon}
                isCouponPage={true}
                onRemove={handleRemoveCoupon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
