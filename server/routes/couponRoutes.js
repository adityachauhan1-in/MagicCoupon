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





export default router;