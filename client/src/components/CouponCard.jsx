import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../Context/AuthContext';

const CouponCard = ({ coupon , isCouponPage = false , onRemove }) => {
  const { user } = useAuth();

const handleSaveCoupon = async () => {
  try {
    const token = localStorage.getItem('token'); //token means an saved user id in mongodatabase
    if (!token) {
      throw new Error('No token found in storage');
    }

 

    const response = await axios.post(
      'http://localhost:5000/auth/save-coupon',
      { couponId: coupon._id },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    toast.success(response.data.message);
  } catch (error) {
    console.error('Full client error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      config: error.config
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      toast.error('Session expired. Please login again');
    } else {
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    }
  }
};
const handleDeleteCoupon = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await axios.delete(
      `http://localhost:5000/api/coupons/${coupon._id}`, //  FIXED ROUTE
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success(response.data.message || 'Coupon deleted');
    if (onRemove) {
      onRemove();
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || 'Failed to Delete !!');
  }
};


 //extract data 
  const title = coupon?.title || coupon?.name || 'Special Offer';
  const description = coupon?.description || 'Limited time offer';
  const code = coupon?.code || 'NOCODE';
  const expiry = coupon?.endDate || coupon?.expiry || new Date(Date.now() + 20 * 24 * 80 * 90 * 1000); // Default 30 days from now
  const image = coupon?.image || 'https://via.placeholder.com/300';
  const store = coupon?.store || 'Our Store';
  const discountPercentage = coupon?.discountPercentage || 10;
  const minimumPurchase = coupon?.minimumPurchase || 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 hover:scale-105 transition duration-300 cursor-pointer h-full flex flex-col">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover rounded-md mb-4" 
      />
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {title}
        </h2>
        {store && (
          <p className="text-sm text-blue-600 font-medium mb-2"> 
            {store}
          </p>
        )}
        <p className="text-sm text-gray-600 mb-4 flex-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {description}
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-mono font-semibold">
              {code}
            </span>
            <span className="text-red-600 text-xs font-medium">
              Expires: {new Date(expiry).toLocaleDateString()}
            </span>
          </div>
          {discountPercentage && (
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">
                {discountPercentage}% OFF
              </span>
            </div>
          )}
          {minimumPurchase > 0 && (
            <p className="text-xs text-gray-500 text-center">
              Min. purchase: ${minimumPurchase}
            </p>
          )}
             <p className="text-green-600 font-semibold">💰 Price: ₹{coupon.price}</p>
        {isCouponPage ? (
  <button 
    className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm"
    onClick={handleDeleteCoupon}
    disabled={!user}
  >
    Delete Coupon
  </button>
) : (
  <button 
    className={`w-full py-3 rounded-lg transition duration-200 font-semibold text-sm ${
      user 
        ? 'bg-green-600 text-white hover:bg-green-700' 
        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`}
    onClick={handleSaveCoupon}
    disabled={!user}
  >
  Buy Coupon
  </button>
)}

        </div>
      </div>
    </div>
  );
};

export default CouponCard;