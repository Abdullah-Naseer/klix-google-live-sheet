
import express from "express";

import {
  previewSheet
} from "../controllers/sheetController.js";

const router = express.Router();

router.post("/preview", previewSheet);

export default router;
