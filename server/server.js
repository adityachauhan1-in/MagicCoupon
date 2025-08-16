import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import couponRoutes from "./routes/couponRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// ✅ Route setup
app.use("/api", couponRoutes);   // e.g., /api/add-coupon
app.use("/auth", authRoutes);    // e.g., /auth/signup or /auth/login

app.get("/", (req, res) => {
  res.send("Hello World , ji aap ko jante h ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
