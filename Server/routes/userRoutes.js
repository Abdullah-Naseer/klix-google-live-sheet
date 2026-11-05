
import express from "express";

import {
  getUsers,
  createUser,
  updateUserStatus
} from "../controllers/userController.js";

import { protect, authorizeModule } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeModule("users"));

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id/status", updateUserStatus);

export default router;
