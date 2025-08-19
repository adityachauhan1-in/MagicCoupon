import express from 'express';
import {
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon, 
    deleteCoupon,
    searchCoupon,
    searchUserCoupons, // Add this
   
} from '../controller/couponController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Coupon from '../models/couponModels.js';
import User from '../models/userModels.js';

const router = express.Router();

// Public routes
router.get("/coupons", getAllCoupons);
router.get("/coupons/search", searchCoupon); // Public search
router.get("/coupons/:id", getCouponById);

// Authenticated routes
router.get("/user/coupons/search", authMiddleware, searchUserCoupons); // User-specific search
router.post("/coupons", authMiddleware, createCoupon);
router.put("/coupons/:id", authMiddleware, updateCoupon);
router.delete("/coupons/:id", authMiddleware, deleteCoupon);

router.get("/coupons/category/:category", async (req, res) => {
  try {
   
    const { category } = req.params;
    const coupons = await Coupon.find({ category });
    res.json({ success: true, data: coupons });
  } catch (err) {
   
    res.status(500).json({ message: "Server error" });
  }
});
// GET all unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Coupon.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET coupons by category

router.post("/buy/:couponId", async (req, res) => {
  try {
    const userId = req.user.id; // assuming auth middleware
    const couponId = req.params.couponId;

    const user = await User.findById(userId);
    const coupon = await Coupon.findById(couponId);

    if (!user || !coupon) return res.status(404).json({ msg: "User or Coupon not found" });

    if (user.walletBalance < coupon.price) {
      return res.status(400).json({ msg: "Not enough balance" });
    }

    // Deduct balance
    user.walletBalance -= coupon.price;
    await user.save();

    // Save coupon to user's account (simplified)
    user.coupons = [...(user.coupons || []), coupon];
    await user.save();

    res.json({ msg: "Coupon purchased successfully", walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});
// Get user wallet balance



export default router;