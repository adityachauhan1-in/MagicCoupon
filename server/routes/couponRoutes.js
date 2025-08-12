import express from 'express';
import {
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon, 
    deleteCoupon,
    searchCoupon,
    searchUserCoupons // Add this
} from '../controller/couponController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

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

export default router;