
// import express from "express";
// import {
//   getAllCoupons,
//   getCouponById,
//   createCoupon,
//   updateCoupon,
//   deleteCoupon,
//   searchCoupon,
//   searchUserCoupons,
//   saveCoupon,
//   getSavedCoupons,
//   removeCoupon,
//   markSavedCouponUsed,
//   redeemCoupon,
//   getMyCreatedCoupons
// } from "../controller/couponController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import Coupon from "../models/couponModels.js";

// const router = express.Router();

// // admit routes 

// //for public routes
// router.get("/", getAllCoupons);
// router.get("/search", searchCoupon);
// router.get("/categories/list", async (req, res) => {
//   try {
//     const categories = await Coupon.distinct("category");
//     res.json({ success: true, data: categories });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// router.get("/category/:category", async (req, res) => {
//   try {
//     const { category } = req.params;
//     const coupons = await Coupon.find({ category });
//     res.json({ success: true, data: coupons });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // router.get("/my-create", (req,res,next) =>{
// //   console.log("get my created coupons api/conupon/my-create hit ")
// //   next();
// // } , getMyCreatedCoupons);
// // router.get("/:id", getCouponById); // Public route to get coupon by ID

// // // Protected routes (require authentication)
// // router.use(authMiddleware);
// router.use(authMiddleware);
// router.get("/my-create", getMyCreatedCoupons);  

// router.get("/:id", getCouponById); // keep this LAST
// // router.get("/my-create", (req,res,next) =>{
// //   console.log("get my created coupons api/conupon/my-create hit ")
// //   next();
// // } , getMyCreatedCoupons);
// router.post("/save", saveCoupon);
// router.get("/saved/list", getSavedCoupons);
// router.delete("/saved/:couponId", removeCoupon);
// router.put("/saved/:couponId/use", markSavedCouponUsed);

// //for admin and authenticated users
// router.post("/", createCoupon); // Create coupon (auth required)
// router.get("/user/search", searchUserCoupons);
// router.put("/:id", updateCoupon);
// router.delete("/:id", deleteCoupon);
// // router.get("/my-create", getMyCreatedCoupons); // Removed duplicate authMiddleware
// router.post("/redeem/:id", redeemCoupon) // Removed duplicate authMiddleware

// export default router;
// import express from "express";
// import {
//   getAllCoupons,
//   getCouponById,
//   createCoupon,
//   updateCoupon,
//   deleteCoupon,
//   searchCoupon,
//   searchUserCoupons,
//   saveCoupon,
//   getSavedCoupons,
//   removeCoupon,
//   markSavedCouponUsed,
//   redeemCoupon,
//   getMyCreatedCoupons
// } from "../controller/couponController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import Coupon from "../models/couponModels.js";

// const router = express.Router();

// // Public routes
// router.get("/", getAllCoupons);
// router.get("/search", searchCoupon);
// router.get("/categories/list", async (req, res) => {
//   try {
//     const categories = await Coupon.distinct("category");
//     res.json({ success: true, data: categories });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// router.get("/category/:category", async (req, res) => {
//   try {
//     const { category } = req.params;
//     const coupons = await Coupon.find({ category });
//     res.json({ success: true, data: coupons });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Protected routes (require authentication)
// router.use(authMiddleware);

// // Specific routes first
// router.get("/my-create", getMyCreatedCoupons);
// router.post("/save", saveCoupon);
// router.get("/saved/list", getSavedCoupons);
// router.delete("/saved/:couponId", removeCoupon);
// router.put("/saved/:couponId/use", markSavedCouponUsed);
// router.get("/user/search", searchUserCoupons);
// router.post("/", createCoupon);
// router.post("/redeem/:id", redeemCoupon);

// // Parameterized routes last
// router.get("/:id", getCouponById);
// router.put("/:id", updateCoupon);
// router.delete("/:id", deleteCoupon);

// export default router;
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

// Apply auth middleware to all routes below this line
router.use(authMiddleware);

// SPECIFIC ROUTES FIRST - very important!
router.get("/my-create", (req, res, next) => {
  console.log("✅ /my-create route matched!");
  next();
}, getMyCreatedCoupons);
router.post("/save", saveCoupon);
router.get("/saved/list", getSavedCoupons);
router.delete("/saved/:couponId", removeCoupon);
router.put("/saved/:couponId/use", markSavedCouponUsed);
router.get("/user/search", searchUserCoupons);
router.post("/", createCoupon);
router.post("/redeem/:id", redeemCoupon);

// PARAMETERIZED ROUTES LAST
// router.get("/:id", (req, res, next) => {
//   console.log(`🆔 /:id route matched with id: ${req.params.id}`);
//   next();
// }, getCouponById);

router.get("/:id", (req, res, next) => {
  console.log(`🆔 /:id route matched with id: ${req.params.id}`);
  next();
}, getCouponById);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;