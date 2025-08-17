import React, { useState, useEffect } from 'react';
import CouponCard from '../components/CouponCard';
import Footer from '../components/Footer';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import banner from '../assets/banner.png';
import banner1 from '../assets/banner1.png'
import banner2 from '../assets/banner2.png'
import banner3 from '../assets/banner3.png'
import CouponsByCategory from '../components/CouponCategory';

const Home = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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
  }, [API_BASE_URL]);

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
{/* <div className='items-center'>
  <CouponsByCategory/>
</div> */}
      {/* Show banner only if not searching */}
      {searchInput.trim() === '' && (
        // <div className="text-center p-10">
        //   <h1 className="text-4xl font-bold text-green-700">Welcome to MagicCoupon 🎉</h1>
        //   <p className="mt-4 text-gray-600">Find the best deals and save big on your next order.</p>
        //   <img src={banner} alt="hero" className="w-full h-80 object-cover rounded-md mt-6" />
        // </div>
        <div className="w-full max-w-[1200px] mx-auto mb-3">
        <Slider {...settings}>
          <div className="h-[200px] md:h-[320px] lg:h-[360px]">
            <img 
              src={banner1} 
              alt="Offer 1" 
              className="w-full h-full object-cover rounded-2xl shadow-lg" 
            />
          </div>
          <div className="h-[200px] md:h-[320px] lg:h-[360px]">
            <img 
              src={banner2} 
              alt="Offer 2" 
              className="w-full h-full object-cover rounded-2xl shadow-lg" 
            />
          </div>
          <div className="h-[200px] md:h-[320px] lg:h-[360px]">
            <img 
              src={banner3} 
              alt="Offer 2" 
              className="w-full h-full object-cover rounded-2xl shadow-lg" 
            />
          </div>
        </Slider>
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
