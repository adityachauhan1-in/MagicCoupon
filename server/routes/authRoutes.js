import express from "express";
import {
  register,
  login,
  getCurrentUser,
  saveCoupon,
  removeCoupon,
  getSavedCoupons,
  buyCoupon
} from "../controller/authController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"; 
import User from "../models/userModels.js";

const router = express.Router();

// 👇 Only use these two if you're not using any authentication middleware
router.post("/signup", register);
router.post("/login", login);

// Optional public routes (no auth needed for now)
router.get("/me", authMiddleware,getCurrentUser);
router.post("/save-coupon",authMiddleware, saveCoupon);
router.delete("/remove-coupon/:couponId", authMiddleware, removeCoupon);
router.get("/saved-coupons",authMiddleware, getSavedCoupons);

// router.get("/user/wallet", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id; // comes from auth middleware
//     const user = await User.findById(userId);

//     if (!user) return res.status(404).json({ msg: "User not found" });

//     res.json({ walletBalance: user.walletBalance });
//   } catch (error) {
//     res.status(500).json({ msg: "Server error", error });
//   }
// });

router.post("/user/wallet", authMiddleware, buyCoupon)
export default router;
