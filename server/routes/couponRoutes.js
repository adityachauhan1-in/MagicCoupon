
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

// admit routes 

//for public routes
router.get("/", getAllCoupons);
router.get("/search", searchCoupon);
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Coupon.distinct("category");
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const coupons = await Coupon.find({ category });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




router.use(authMiddleware);


router.post("/save", saveCoupon);

router.get("/saved/list", getSavedCoupons);

router.delete("/saved/:couponId", removeCoupon);

router.put("/saved/:couponId/use", markSavedCouponUsed);

//for admin
router.post("/", createCoupon);// above is the get request , this one is POST  to create 
router.get("/user/search", searchUserCoupons);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);
router.get("/my-create",authMiddleware,getMyCreatedCoupons);
router.get("/:id", getCouponById);

router.post("/redeem/:id",authMiddleware,redeemCoupon)

export default router;
 