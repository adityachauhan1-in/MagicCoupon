import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import CouponCard from '../components/CouponCard'
/*axios -  A popular JavaScript library for making HTTP requests (GET, POST, PUT, DELETE, etc.)
   from your frontend to your backend or any API.*/ 


const Coupons = () => {
  const [savedCoupons, setSavedCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    const fetchSavedCoupons = async () => {
      try {
        if (user) {
          const res = await axios.get('http://localhost:5000/auth/saved-coupons', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setSavedCoupons(res.data.data || []);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load saved coupons');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCoupons();
  }, [user]);

  const handleRemoveCoupon = async (couponId) => {
    try {
      await axios.delete(
        `http://localhost:5000/auth/remove-coupon/${couponId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSavedCoupons(savedCoupons.filter(coupon => coupon._id !== couponId));
      // toast.success('Coupon removed successfully ');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove coupon');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading your coupons...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Your Saved Coupons
      </h1>
      
      {savedCoupons.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600 mb-4">
            {user ? 'You have no saved coupons yet' : 'Please login to view saved coupons'}
          </p>
          {user && (
            <p className="text-gray-500">
              Browse coupons on the homepage and click "Save Coupon" to add them here
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedCoupons.map(coupon => (
            <CouponCard 
              key={coupon._id} 
              coupon={coupon}
              onRemove={() => handleRemoveCoupon(coupon._id)}
              isCouponPage={true}
              
            />
          ))}
        </div>
        
      )}
    </div>
  );
};

export default Coupons;