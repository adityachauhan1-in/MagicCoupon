import Coupon from "../models/couponModels.js";

const buildSearchQuery = (searchTerm, additionalFilters = {}) => {
  const query = { isActive: true, ...additionalFilters };
  
  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { store: { $regex: searchTerm, $options: 'i' } },
      { code: { $regex: searchTerm, $options: 'i' } }
    ];
  }
  
  return query;
};

// Get all coupons (for homepage)
export const getAllCoupons = async (req, res) => {
  try {
    const { search, category, featured, page = 1, limit = 1000 } = req.query;
    
    const query = buildSearchQuery(search, { 
      ...(category && { category }),
      ...(featured === 'true' && { featured: true })
    });
    
    const skip = (page - 1) * limit;
    
    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Coupon.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      data: coupons,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching coupons",
      error: error.message
    });
  }
};


export const searchUserCoupons = async (req, res) => {
    try {
        const { q: searchTerm, page = 1, limit = 10 } = req.query;
        const userId = req.userId; // From authMiddleware
        
        let query = { 
            isActive: true,
            savedBy: userId 
        };
        
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { store: { $regex: searchTerm, $options: 'i' } },
                { code: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        
        const skip = (page - 1) * limit;
        
        const [coupons, total] = await Promise.all([
            Coupon.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Coupon.countDocuments(query)
        ]);
        
        res.status(200).json({
            success: true,
            data: coupons,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error searching user coupons",
            error: error.message
        });
    }
};

export const getCouponById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const coupon = await Coupon.findById(id);
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching coupon",
            error: error.message
        });
    }
};

// Get coupon by code
export const getCouponByCode = async (req, res) => {
    try {
        const { code } = req.params;
        
        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(),
            isActive: true 
        });
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found or inactive"
            });
        }
        
        // Check if coupon is available
        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            return res.status(400).json({
                success: false,
                message: "Coupon is not valid at this time"
            });
        }
        
        if (coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: "Coupon usage limit exceeded"
            });
        }
        
        res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching coupon",
            error: error.message
        });
    }
};


export const searchCoupon = async (req, res) => {
    try {
        const { q: searchTerm, category, featured, page = 1, limit = 10 } = req.query;
        
        let query = { isActive: true };
        
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { store: { $regex: searchTerm, $options: 'i' } },
                { code: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        
        // Additional filters
        if (category) query.category = category;
        if (featured === 'true') query.featured = true;
        
        const skip = (page - 1) * limit;
        
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Coupon.countDocuments(query);
        
        res.status(200).json({
            success: true,
            data: coupons,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Search failed",
            error: error.message
        });
    }
};
// Create new coupon
export const createCoupon = async (req, res) => {
    try {
        const couponData = req.body;
        
        // Validate dates
        if (new Date(couponData.startDate) >= new Date(couponData.endDate)) {
            return res.status(400).json({
                success: false,
                message: "End date must be after start date"
            });
        }
        
        const coupon = new Coupon(couponData);
        await coupon.save();
        
        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error creating coupon",
            error: error.message
        });
    }
};

// Update coupon
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Validate dates if provided
        if (updateData.startDate && updateData.endDate) {
            if (new Date(updateData.startDate) >= new Date(updateData.endDate)) {
                return res.status(400).json({
                    success: false,
                    message: "End date must be after start date"
                });
            }
        }
        
        const coupon = await Coupon.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: coupon
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists"
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Error updating coupon",
            error: error.message
        });
    }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        
        const coupon = await Coupon.findByIdAndDelete(id);
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting coupon",
            error: error.message
        });
    }
};

// Use coupon (increment usage count)
export const useCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        
        const coupon = await Coupon.findById(id);
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }
        
        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: "Coupon is inactive"
            });
        }
        
        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            return res.status(400).json({
                success: false,
                message: "Coupon is not valid at this time"
            });
        }
        
        if (coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: "Coupon usage limit exceeded"
            });
        }
        
        coupon.usedCount += 1;
        await coupon.save();
        
        res.status(200).json({
            success: true,
            message: "Coupon used successfully",
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error using coupon",
            error: error.message
        });
    }
};

// Get featured coupons
export const getFeaturedCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ 
            featured: true, 
            isActive: true 
        }).sort({ createdAt: -1 }).limit(6);
        
        res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching featured coupons",
            error: error.message
        });
    }
};

// Get coupons by category
export const getCouponsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const skip = (page - 1) * limit;
        
        const coupons = await Coupon.find({ 
            category, 
            isActive: true 
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
        
        const total = await Coupon.countDocuments({ category, isActive: true });
        
        res.status(200).json({
            success: true,
            data: coupons,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching coupons by category",
            error: error.message
        });
    }
};
