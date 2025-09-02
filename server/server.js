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

// Route setup
app.use("/api/coupons", couponRoutes);   
app.use("/auth", authRoutes);          

app.get("/", (req, res) => {
  res.send("Hello World ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running(testing) on port ${PORT}`);
});
