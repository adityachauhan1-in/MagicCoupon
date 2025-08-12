import express from "express";
import {
  register,
  login,
  getCurrentUser,
  saveCoupon,
  removeCoupon,
  getSavedCoupons
} from "../controller/authController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// 👇 Only use these two if you're not using any authentication middleware
router.post("/signup", register);
router.post("/login", login);

// Optional public routes (no auth needed for now)
router.get("/me", authMiddleware,getCurrentUser);
router.post("/save-coupon",authMiddleware, saveCoupon);
router.delete("/remove-coupon/:couponId", authMiddleware, removeCoupon);
router.get("/saved-coupons",authMiddleware, getSavedCoupons);

export default router;
