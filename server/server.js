import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

// --- Load .env from root ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("✅ Loaded ENV keys:");
console.log({
  PORT: process.env.PORT,
  MONGO: process.env.MONGODB_URI ? "✅ found" : "❌ missing",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ found" : "❌ missing"
});

// --- Connect to MongoDB ---
connectDB();

const app = express();

// --- Middleware ---
app.use(cors({
  origin: [process.env.CLIENT_URL, "http://localhost:3000"].filter(Boolean),
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// --- Passport setup ---
import "./config/passport.js";
app.use(passport.initialize());

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/api/coupons", couponRoutes);

app.get("/", (req, res) => {
  res.send("🚀 MagicCoupon backend is running fine!");
});

// --- Server listen ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌍 Server running on port ${PORT}`);
});
