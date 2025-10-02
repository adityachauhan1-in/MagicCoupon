
import SavedCoupon from "../models/savedCoupon.js";
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

// Get coupon by ID for particular selected coupon ..
export const getCouponById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid coupon  ID format" });
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
    const coupon = new Coupon(
      {
        ...req.body,
        creatorId:req.userId,  // user can create but not use it .
      })
    await coupon.save()
      res.status(201).json({"success" : true , "data" : coupon})
    
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.code) {
      return res.status(409).json({ success: false, message: "Coupon code already exists" });
    }
    res.status(500).json({"message":error.message})
  }
};

        // Update Coupon  
export const updateCoupon = async (req, res) => {
  try {
         const coupon = await Coupon.findById(req.params.id);
         if (!coupon) return res.status(404).json({ message: "Coupon not found" });
     
         const isCreator = coupon.creatorId?.toString() === req.userId.toString();
    const isAdmin = req.userRole === 'admin';
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this coupon" });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedCoupon });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.code) {
      return res.status(409).json({ success: false, message: "Coupon code already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

            // Redeem Coupon

export const redeemCoupon = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // 1. Validate couponId
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
  
    // 2. Check self-use 
    if (coupon.creatorId && coupon.creatorId.toString() === userId.toString()) {
      return res.status(403).json({ success: false, message: "You cannot redeem your own coupon" });
    }

    // 3. Check expiry
    const now = new Date();
    if (coupon.endDate < now) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

 

   

    
    coupon.usedCount += 1;
    await coupon.save();

    res.json({
      success: true,
      message: "Coupon redeemed successfully!",
      data: {
        couponId: coupon._id,
        code: coupon.code,
        title: coupon.title,
        discountAmount: coupon.discountAmount,
        discountPercentage: coupon.discountPercentage,
        usedCount: coupon.usedCount,
        usageLimit: coupon.usageLimit,
      }
    });
 
  } catch (error) {
    console.error("redeemCoupon error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


       // Delete coupon 
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    const isCreator = coupon.creatorId?.toString() === req.userId.toString();
    const isAdmin = req.userRole === 'admin';
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this coupon" });
    }

    await Coupon.findByIdAndDelete(req.params.id);
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
      creatorId: req.userId,
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

    // If not found, try by couponId 
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

          // get my created coupons
export const getMyCreatedCoupons = async (req, res) => {
        try {
    const coupons = await Coupon.find({ creatorId: req.userId });
      res.json({ success: true, data: coupons });
  } catch (error) {
        res.status(500).json({ message: "Error fetching your coupons", error: error.message });
  }
};
