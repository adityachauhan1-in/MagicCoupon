import React, { useState, useEffect } from 'react';
import CouponCard from '../components/CouponCard';
import Footer from '../components/Footer';
import banner from '../assets/banner.png';

const Home = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';


  // Fetch all coupons initially
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/coupons`);
        const data = await response.json();
        if (data.success) {
          setCoupons(data.data);
          setFilteredCoupons(data.data);
        } else {
          setError(data.message || 'Failed to fetch coupons');
        }
      } catch (err) {
        setError(err.message || 'Error loading coupons');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  // Handle live search
  const handleSearchChange = async (value) => {
    setSearchInput(value);

    if (value.trim() === '') {
      setFilteredCoupons(coupons); // Restore all if empty
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/coupons/search?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (data.success) {
        setFilteredCoupons(data.data);
      } else {
        setFilteredCoupons([]);
      }
    } catch (err) {
      console.error(err);
      setFilteredCoupons([]);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading amazing deals...</div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Search Bar at Top */}
      <div className="flex justify-center p-6 bg-gray-50 shadow">
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full max-w-lg border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Show banner only if not searching */}
      {searchInput.trim() === '' && (
        <div className="text-center p-10">
          <h1 className="text-4xl font-bold text-green-700">Welcome to MagicCoupon 🎉</h1>
          <p className="mt-4 text-gray-600">Find the best deals and save big on your next order.</p>
          <img src={banner} alt="hero" className="w-full h-80 object-cover rounded-md mt-6" />
        </div>
      )}

      {/* Coupons Section */}
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
