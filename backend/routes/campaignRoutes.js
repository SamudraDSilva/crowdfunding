import express from "express";
import {
  getCampaign,
  createCampaign,
  getCampaignById,
  deleteCampaign,
  updateCampaign,
  updateProgress,
} from "../controllers/CampaignController.js";

import upload from "../middlewares/multerMiddleware.js";
import { body, param } from "express-validator"; // For request validation

const router = express.Router();

// Get all campaigns
router.get("/", getCampaign);

// Get a single campaign by ID
router.get("/:id", getCampaignById);

// Post a new campaign
router.post("/creation", upload.single("image"), createCampaign);

// Update a campaign with validation
router.patch("/:id", upload.single("image"), updateCampaign);

//Donate
router.patch("/donate/:id", updateProgress);

// Delete a campaign
router.delete("/:id", deleteCampaign);

export default router;
