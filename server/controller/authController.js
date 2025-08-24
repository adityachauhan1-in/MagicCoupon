import User from "../models/userModels.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register User
export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        console.log(process.env.JWT_SECRET) 
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: user.toJSON(),  // Changed from data.user to user
            token: token           // Changed from data.token to token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: user.toJSON(),  // Changed from data.user to user
            token: token          // Changed from data.token to token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });
    }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('savedCoupons');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user.toJSON()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
};


// Save Coupon to User's List
export const saveCoupon = async (req, res) => {
    try {
      console.log('\n=== SAVE COUPON REQUEST ===');
    // //   console.log('Authenticated userId:', req.userId);
    // //   console.log('Request body:', req.body);
  
      const { couponId } = req.body;
      const user = await User.findById(req.userId);
      
      if (!user) {
        throw new Error('User not found in database');
      }
  
    //   console.log('User before save:', {
    //     _id: user._id,
    //     savedCoupons: user.savedCoupons
    //   });
  
      // Check if coupon already exists to prevent duplicates
      if (!user.savedCoupons.includes(couponId)) {
        user.savedCoupons.push(couponId);
        await user.save();
      }
  
  
      res.status(200).json({
        success: true,
        message: "Coupon saved successfully",
        data: user.savedCoupons
      });
    } catch (error) {
      console.error('Save coupon controller error:', {
        message: error.message,
        stack: error.stack,
        userId: req.userId
      });
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};

// Remove Coupon from User's List
export const removeCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Remove coupon from saved list
        user.savedCoupons = user.savedCoupons.filter(
            id => id.toString() !== couponId
        );
        await user.save();

        res.status(200).json({
            success: true,
            message: "Coupon removed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing coupon",
            error: error.message
        });
    }
};

// Get User's Saved Coupons
export const getSavedCoupons = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate('savedCoupons');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user.savedCoupons,

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching saved coupons",
            error: error.message
        });
    }
}; 


export const buyCoupon = async (req, res) => {
    try {
      const userId = req.user.id; // comes from auth middleware
      const user = await User.findById(userId);
  
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      res.json({ walletBalance: user.walletBalance });
    } catch (error) {
      res.status(500).json({ msg: "Server error", error });
    }
  };
  
     