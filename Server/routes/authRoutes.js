
import express from "express";

import {
  registerUser,
  loginUser,
  getMyProfile
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes

router.post("/login", loginUser);

// Protected route
router.get("/me", protect, getMyProfile);

export default router;
