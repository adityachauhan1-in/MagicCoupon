import React, { useState, useEffect } from "react";
import axios from "axios";
import { redeemCoupon } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import { X, Trash2, Copy } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://magiccoupon-backend.onrender.com";

const CouponCard = ({ coupon, isCouponPage = false, onRemove }) => {
  const { user } = useAuth();

             const savedId = coupon?._id;
  const [isUsed, setIsUsed] = useState(Boolean(coupon?.isUsed));
         const [showModal, setShowModal] = useState(false);
            const [copied, setCopied] = useState(false);
 const [imageError, setImageError] = useState(false);
    const [saveStatus,setSaveStatus] = useState("default")
  
  // Check if current user is the creator of this coupon
           const isCreator = user && coupon?.creatorId && user._id === coupon.creatorId;
           useEffect(() => {
             if (typeof coupon?.isUsed !== "undefined") {
      setIsUsed(Boolean(coupon.isUsed));
    }
  }, [coupon?.isUsed]);

  const handleSaveCoupon = async () => {
  // user can not access their own created coupoon
    if (isCreator) {
      toast.error("You cannot redeem your own coupon");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSaveStatus("error")
        return;
      }

      
   setSaveStatus("added")
   
    } catch (error) {
      console.error("Save error:", error);
      if (error.response?.status === 400 && error.response.data.message === "Coupon already saved") {
                   setSaveStatus("already")
     
      } else if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again");
      } else {
        setSaveStatus("error")
      }
      setTimeout(() => setSaveStatus("default"),2000)
    }
  };

            const handleDeleteCoupon = async () => {
    if (!isCouponPage) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to delete coupons");
        return;
      }


      await axios.delete(`${API_BASE_URL}/api/coupons/saved/${savedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
          // delete the coupon .
      onRemove?.(savedId);
    } catch (err) {
      console.error("Delete saved coupon err:", err);
      toast.error(err.response?.data?.message || "Failed to remove coupon");
    }
  };

  const handleUseCoupon = () => {
    // Prevent creators from using their own coupons
    if (isCreator) {
      toast.error("You cannot redeem your own coupon");
      return;
    }
    setShowModal(true);
  };

  const closeAndMarkUsed = async () => {
    setShowModal(false);
    if (isUsed) return;

    const idToMark = savedId || coupon?.couponId || coupon?._id;
    try {
      const token = localStorage.getItem("token");
      
      const couponId = coupon?.couponId || coupon?._id;
      if (couponId) {
        try {
          await redeemCoupon(couponId);
        } catch (redeemErr) {
        
          const status = redeemErr?.response?.status;
          const msg = redeemErr?.response?.data?.message || 'Failed to redeem';
          if (status) {
            toast.warn(msg);
          }
        }
      }

      await axios.put(`${API_BASE_URL}/api/coupons/saved/${idToMark}/use`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsUsed(true);
    } catch (err) {
      console.error("Mark used error:", err);
      toast.error("Failed to mark coupon as used");
    }
  };

  const handleCopyCode = () => {        // copy button at the save coupon page 
    try {
      navigator.clipboard.writeText(coupon?.code || coupon?.couponCode || "NOCODE");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("copy err", err);
    }
  };

  const handleImageError = () => setImageError(true);
// if the coupon is unable to fetch from the database ..
  const title = coupon?.title || coupon?.name || "Special Offer";
  const description = coupon?.description || coupon?.desc || "Limited time offer";
  const code = coupon?.code || coupon?.couponCode || "NOCODE";
  const expiry = coupon?.endDate || coupon?.expiry || coupon?.validTill || null;
  const image = !imageError && (coupon?.image || coupon?.imageUrl) ? (coupon?.image || coupon?.imageUrl) : null;
  const store = coupon?.store || "Our Store";
  const discountPercentage = coupon?.discountPercentage || coupon?.discount || 0;
  const minimumPurchase = coupon?.minimumPurchase || coupon?.minPurchase || 0;

  return (
    <>
      <div className="relative bg-purple-50 rounded-xl shadow-md p-4 transition duration-300 h-full flex flex-col">
        {isCouponPage && (
          <button
            onClick={handleDeleteCoupon}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow text-red-600"
            title="Remove saved coupon"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className="relative">
          {image ? (
            <img src={image} alt={title} onError={handleImageError} className={`w-full h-40 object-cover rounded-lg transition duration-300 
              ${isUsed ? "opacity-40" : "opacity-100"}`} />
          ) : (
            <div className={`w-full h-40 rounded-lg bg-gray-100 flex items-center justify-center ${isUsed ? "opacity-40" : "opacity-100"}`}>
              <span className="text-sm text-gray-400">No image</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-2 overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{title}</h2>
          {store && <p className="text-sm text-blue-600 font-medium mb-2">{store}</p>}
          <p className="text-sm text-gray-600 mb-4 flex-1 overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{description}</p>

          <div className="flex justify-between items-center mb-3">
            {isCouponPage && isUsed ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-mono font-semibold line-through">{code}</span>
            ) : <span />}

            <span className="text-red-600 text-xs font-medium">Expires: {expiry ? new Date(expiry).toLocaleDateString() : "—"}</span>
                    </div>
          
                    {discountPercentage ? <div className="text-center mb-1"><span className="text-2xl font-bold text-green-600">{discountPercentage}% OFF</span></div> : null}
                    {minimumPurchase > 0 && <p className="text-xs text-gray-500 text-center mb-3">Min. purchase: ${minimumPurchase}</p>}
          
                    <div className="mt-auto">
                      {isCouponPage ? (!isUsed ?  
                      <button className={`w-full py-3 rounded-lg transition duration-200 font-semibold text-sm ${!user || isCreator ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`} onClick={handleUseCoupon} disabled={!user || isCreator}>
              {isCreator ? "Your Coupon" : "Use Coupon"}
            </button> : 


<div className="text-center text-sm font-semibold text-red-500">✅ Coupon Used</div>) : ( 
 <button
 className={`w-full py-3 rounded-lg transition duration-200 font-semibold text-sm ${
   !user
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : isCreator
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : saveStatus === "added"
                 ? "bg-green-600 text-white"
          : saveStatus === "already"
                 ? "bg-yellow-500 text-white"
          : saveStatus === "error"
     ? "bg-red-500 text-white"
     : "bg-blue-600 text-white hover:bg-blue-700"
 }`}
 onClick={handleSaveCoupon}
 disabled={!user || isCreator || saveStatus === "added"}
>
 {isCreator
   ? "Your Coupon"
   : saveStatus === "added"
   ? "Added ✅"
   : saveStatus === "already"
           ? "Already Saved ⚠️"
   : saveStatus === "error"
          ? "Failed ❌"
   : "Get Coupon"}
</button>
)}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative">
                  <button className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100" onClick={closeAndMarkUsed}><X className="w-5 h-5 text-gray-600" /></button>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{description}</p>
                          <div className="border rounded-xl p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">Your code</div>
                    <div className="font-mono text-2xl font-bold tracking-wider mb-3">{code}</div>
                    <button onClick={handleCopyCode} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${copied ? "bg-green-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}>
                      <Copy className="w-4 h-4" /> {copied ? "Copied ✅" : "Copy Code"}
              </button>
              <div className="mt-3 text-xs text-gray-500">Show this code at checkout</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponCard;
