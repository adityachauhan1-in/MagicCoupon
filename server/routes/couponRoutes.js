
import express from "express";
import {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  searchCoupon,
  searchUserCoupons,
  saveCoupon,
  getSavedCoupons,
  removeCoupon,
  markSavedCouponUsed,
  redeemCoupon,
  getMyCreatedCoupons
} from "../controller/couponController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Coupon from "../models/couponModels.js";

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`📦 Coupon Route: ${req.method} ${req.originalUrl}`);
  next();
});

// Public routes
router.get("/", async (req, res) => {
  console.log("🔍 GET /api/coupons - Fetching all coupons");
  try {
    const coupons = await Coupon.find({ isActive: true });
    console.log(`📦 Found ${coupons.length} active coupons`);
    res.json({ success: true, data: coupons });
  } catch (error) {
    console.error("❌ Error fetching coupons:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/search", searchCoupon);
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Coupon.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`🔍 Fetching coupons for category: ${category}`);
    
    const coupons = await Coupon.find({ 
      category: category,
      isActive: true 
    });
    
    console.log(`📦 Found ${coupons.length} coupons for category: ${category}`);
    res.json({ success: true, data: coupons });
  } catch (error) {
    console.error(`❌ Error fetching coupons for category ${category}:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Protected
router.use(authMiddleware);
router.get("/my-create", (req,res,next)=>{ console.log("✅ /my-create route matched!"); next(); }, getMyCreatedCoupons);
router.post("/save", saveCoupon);
router.get("/saved/list", getSavedCoupons);
router.delete("/saved/:couponId", removeCoupon);
router.put("/saved/:couponId/use", markSavedCouponUsed);
router.get("/user/search", searchUserCoupons);
router.post("/", createCoupon);
router.post("/redeem/:id", redeemCoupon);

// Parameterized last
router.get("/:id", (req,res,next)=>{ console.log(`🆔 /:id route matched with id: ${req.params.id}`); next(); }, getCouponById);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;