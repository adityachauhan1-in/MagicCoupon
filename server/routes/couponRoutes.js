
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
// Public routes
router.get("/", getAllCoupons);
router.get("/search", searchCoupon);
router.get("/categories/list", async (req, res) => { /* ... */ });
router.get("/category/:category", async (req, res) => { /* ... */ });

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