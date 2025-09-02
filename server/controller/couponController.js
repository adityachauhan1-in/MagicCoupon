
import SavedCoupon from "../models/SavedCoupon.js";
import Coupon from "../models/couponModels.js";
import mongoose from "mongoose";

// Get all coupons 
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get coupon by ID
export const getCouponById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid coupon ID format" });
    }
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create coupon 
export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon({ ...req.body, userId: req.userId });
    await coupon.save();
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete coupon 
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public search
export const searchCoupon = async (req, res) => {
  try {
    const { q = "" } = req.query;
    const coupons = await Coupon.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search current user's coupons
export const searchUserCoupons = async (req, res) => {
  try {
    const { q = "" } = req.query;
    const coupons = await Coupon.find({
      userId: req.userId,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save coupon for user 
export const saveCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(couponId)) {
      return res.status(400).json({ message: "Invalid couponId" });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    const alreadySaved = await SavedCoupon.findOne({ userId, couponId, isUsed: false });
    if (alreadySaved) {
      return res.status(200).json({ message: "Coupon already saved" });
    }

    const newSave = new SavedCoupon({ userId, couponId });
    await newSave.save();

    await newSave.populate("couponId").execPopulate?.(); 
    const populated = await SavedCoupon.findById(newSave._id).populate("couponId");

    const couponObj = populated.couponId.toObject();
    delete couponObj._id; 

    const formatted = {
      _id: populated._id,      
      savedId: populated._id,  
      couponId: populated.couponId._id,
      ...couponObj,
      isUsed: populated.isUsed,
      savedAt: populated.savedAt,
    };

    res.status(201).json({ success: true, message: "Coupon saved successfully", data: formatted });
  } catch (error) {
    console.error("saveCoupon error:", error);
    res.status(500).json({ message: "Error saving coupon", error: error.message });
  }
};

export const getSavedCoupons = async (req, res) => {
  try {
    const userId = req.userId;

    const savedCoupons = await SavedCoupon.find({ userId }).populate("couponId");

    const formatted = savedCoupons
      .filter((s) => s.couponId) 
      .map((s) => {
        const couponObj = s.couponId.toObject();
        delete couponObj._id; 
        return {
          _id: s._id,                 // SavedCoupon id
          savedId: s._id,             
          couponId: s.couponId._id,   // original Coupon id
          ...couponObj,               // coupon fields (title, code, image, etc)
          isUsed: s.isUsed,
          savedAt: s.savedAt,
        };
      });

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("getSavedCoupons error:", error);
    res.status(500).json({ message: "Error fetching saved coupons", error: error.message });
  }
};

// (tries savedId first, then couponId)
export const removeCoupon = async (req, res) => {
  try {
    const userId = req.userId;
    const { couponId: paramId } = req.params; 

    // Try by SavedCoupon._id first
    let removed = await SavedCoupon.findOneAndDelete({ _id: paramId, userId });

    // If not found, try by couponId (original coupon id)
    if (!removed) {
      removed = await SavedCoupon.findOneAndDelete({ couponId: paramId, userId });
    }

    if (!removed) return res.status(404).json({ message: "Saved coupon not found" });

    res.json({ success: true, message: "Coupon removed successfully" });
  } catch (error) {
    console.error("removeCoupon error:", error);
    res.status(500).json({ message: "Error removing coupon", error: error.message });
  }
};

// Mark saved coupon used 
export const markSavedCouponUsed = async (req, res) => {
  try {
    const userId = req.userId;
    const { couponId: paramId } = req.params;

    // Try update by saved _id first
    let updated = await SavedCoupon.findOneAndUpdate(
      { _id: paramId, userId },
      { isUsed: true },
      { new: true }
    );

    if (!updated) {
      updated = await SavedCoupon.findOneAndUpdate(
        { couponId: paramId, userId },
        { isUsed: true },
        { new: true }
      );
    }

    if (!updated) return res.status(404).json({ message: "Saved coupon not found" });

    res.json({ success: true, message: "Coupon marked as used", data: { savedId: updated._id, isUsed: updated.isUsed } });
  } catch (error) {
    console.error("markSavedCouponUsed error:", error);
    res.status(500).json({ message: "Failed to update coupon", error: error.message });
  }
};

export default {
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
};
