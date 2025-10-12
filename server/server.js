// server.js
import dotenv from "dotenv";
dotenv.config(); // just load env variables normally

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import couponRoutes from "./routes/couponRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "passport";

// Initialize Express
const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      'https://magiccouponfrontend.onrender.com', // frontend production
      'http://localhost:3000',                    // frontend local dev
      process.env.CLIENT_URL                       // fallback from env
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
connectDB();

// Initialize Passport (Google OAuth)
import './config/passport.js';
app.use(passport.initialize());

// Routes
app.use("/api/coupons", couponRoutes);
app.use("/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("This is the server of the MagicCoupon Web Application — hii, it's working!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
