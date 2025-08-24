import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../Context/AuthContext';
import { X, Trash2, Copy } from 'lucide-react';

const CouponCard = ({ coupon, isCouponPage = false, onRemove }) => {
  const { user } = useAuth();

  const [isUsed, setIsUsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔹 Check if coupon was already used (persisted in localStorage)
  useEffect(() => {
    const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons") || "[]");
    if (usedCoupons.includes(coupon._id)) {
      setIsUsed(true);
    }
  }, [coupon._id]);

  const handleSaveCoupon = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found in storage');

      const response = await axios.post(
        'http://localhost:5000/auth/save-coupon',
        { couponId: coupon._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error('Save error:', error);
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
        `http://localhost:5000/api/coupons/${coupon._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || 'Coupon deleted');
      onRemove?.();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const handleUseCoupon = () => setShowModal(true);

  const closeAndMarkUsed = () => {
    setShowModal(false);
    setIsUsed(true);

    // 🔹 Save "used" status in localStorage so it persists after reload
    const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons") || "[]");
    if (!usedCoupons.includes(coupon._id)) {
      usedCoupons.push(coupon._id);
      localStorage.setItem("usedCoupons", JSON.stringify(usedCoupons));
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const title = coupon?.title || coupon?.name || 'Special Offer';
  const description = coupon?.description || 'Limited time offer';
  const code = coupon?.code || 'NOCODE';
  const expiry =
    coupon?.endDate ||
    coupon?.expiry ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const image = coupon?.image || 'https://via.placeholder.com/300';
  const store = coupon?.store || 'Our Store';
  const discountPercentage = coupon?.discountPercentage || 10;
  const minimumPurchase = coupon?.minimumPurchase || 0;

  return (
    <>
      {/* Card */}
      <div className="relative bg-white rounded-xl shadow-md p-4 transition duration-300 h-full flex flex-col">
        
        {/* Delete button always clickable (above dim layer) */}
        {isCouponPage && (
          <button
            onClick={handleDeleteCoupon}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Image (dimmed if used) */}
        <div className="relative">
          <img
            src={image}
            alt={title}
            className={`w-full h-40 object-cover rounded-lg transition duration-300 ${
              isUsed ? "opacity-40" : "opacity-100"
            }`}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <h2
            className="text-xl font-bold text-gray-800 mb-2 overflow-hidden"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {title}
          </h2>

          {store && <p className="text-sm text-blue-600 font-medium mb-2">{store}</p>}

          <p
            className="text-sm text-gray-600 mb-4 flex-1 overflow-hidden"
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
          >
            {description}
          </p>

          {/* code + expiry */}
          <div className="flex justify-between items-center mb-3">
            {isCouponPage && isUsed ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-mono font-semibold line-through">
                {code}
              </span>
            ) : (
              <span />
            )}

            <span className="text-red-600 text-xs font-medium">
              Expires: {new Date(expiry).toLocaleDateString()}
            </span>
          </div>

          {discountPercentage && (
            <div className="text-center mb-1">
              <span className="text-2xl font-bold text-green-600">
                {discountPercentage}% OFF
              </span>
            </div>
          )}

          {minimumPurchase > 0 && (
            <p className="text-xs text-gray-500 text-center mb-3">
              Min. purchase: ${minimumPurchase}
            </p>
          )}

          <div className="mt-auto">
            {isCouponPage ? (
              !isUsed ? (
                <button
                  className={`w-full py-3 rounded-lg transition duration-200 font-semibold text-sm ${
                    user
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                  onClick={handleUseCoupon}
                  disabled={!user}
                >
                  Use Coupon
                </button>
              ) : (
                <div className="text-center text-sm font-semibold text-red-500">✅ Coupon Used</div>
              )
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
                Get Coupon
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative">
            <button
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
              onClick={closeAndMarkUsed}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>

            <div className="border rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">Your code</div>
              <div className="font-mono text-2xl font-bold tracking-wider mb-3">
                {code}
              </div>

              <button
                onClick={handleCopyCode}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied ✅' : 'Copy Code'}
              </button>

              <div className="mt-3 text-xs text-gray-500">
                Show this code at checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponCard;
