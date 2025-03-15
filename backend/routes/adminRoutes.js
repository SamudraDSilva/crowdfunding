import express from "express";
import upload from "../middlewares/multerMiddleware.js";

import {
  getCampaign,
  getCampaignById,
  deleteCampaign,
  editCampaign,
  getTotalProgress,
  getUsers,
  deleteUser,
  editUser,
  getTransaction,
} from "../controllers/AdminController.js";

const router = express.Router();

//CAMPAIGN_MANAGEMENT ROUTES
// Get all campaigns
router.get("/campaigns", getCampaign);

//get all campaign count
router.get("/campaign-count");

// Get a single campaign by ID
router.get("/campaign/:id", getCampaignById);

// Update a campaign with validation
router.patch("/campaign/:id", upload.single("image"), editCampaign);

// Delete a campaign
router.delete("/campaign/:id", deleteCampaign);

// Delete a campaign
router.get("/campaigns/progress", getTotalProgress);

//USER_MANAGEMENT ROUTES
// Get all users
router.get("/users", getUsers);

// Delete a user
router.delete("/users/:id", deleteUser);

// Update a user
router.patch("/users/:id", editUser);

//TRANSACTION_MANAGEMENT ROUTES
router.get("/transaction", getTransaction);

export default router;
