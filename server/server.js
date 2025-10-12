import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";


// here I get the docker error server unable to catch the env file so I use directory here !! 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverEnvPath = path.resolve(__dirname, ".env");
const rootEnvPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: serverEnvPath });
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  dotenv.config({ path: rootEnvPath });
}

    import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
   import couponRoutes from "./routes/couponRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "passport"
const app = express();
    app.use(cors({
        origin: [
            'https://magiccouponfrontend.onrender.com',
            // Alternative URL format
            'http://localhost:3000', // For local development
            process.env.CLIENT_URL
        ].filter(Boolean),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
    connectDB();

          // Initialize passport configurations
           import './config/passport.js'
app.use(passport.initialize());
           

      app.use("/api/coupons", couponRoutes);   
app.use("/auth", authRoutes);          

        app.get("/", (req, res) => {
  res.send("This is the server of the MagicCoupon Web Application  hii its working");
}); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
