import express from "express";
import {
  getMyCampaign,
  updateUserProfile,
  getUserRank,
} from "../controllers/ProfileController.js";

import { verifyToken } from "../middlewares/authMiddleware.js"; // Ensures only logged-in users can log out

const router = express.Router();

router.get("/rank", getUserRank);
//Get Campaigns
router.get("/:id", getMyCampaign);
router.put("/update", verifyToken, updateUserProfile);

export default router;
