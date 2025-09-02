import express from "express";
import {
  register, 
  login,
  getCurrentUser,
} from "../controller/authController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

export default router;