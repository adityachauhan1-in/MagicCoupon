  import express from "express";
  import passport from "passport";
  import jwt from "jsonwebtoken"
  import {
    register, 
    login,
    getCurrentUser,
  } from "../controller/authController.js";
  import { authMiddleware } from "../middleware/authMiddleware.js"; 
  import { requireAdmin } from "../middleware/requireAdmin.js";
  import User from "../models/userModels.js";

  const router = express.Router();

  // Google OAuth start
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // Google OAuth callback
  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" , session:false}),
    (req, res) => {
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      const clientUrl = process.env.CLIENT_URL || "https://magiccoupon-frontend.onrender.com";
      res.redirect(`${clientUrl}/auth/success?token=${token}`);
    }
  );

  // Normal signup/login
  router.post("/signup", register);
  router.post("/login", login);
  router.get("/me", authMiddleware, getCurrentUser);

  // Dev/admin: promote a user to admin by email
  router.post("/promote", authMiddleware, requireAdmin, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "email is required" });
      const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, data: { _id: user._id, email: user.email, role: user.role } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  export default router;
