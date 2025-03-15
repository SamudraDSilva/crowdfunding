import mongoose from "mongoose";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

//Get all the campaign
const DEFAULT_IMG = "assets\\images\\no_image_available.jpg";

export const getCampaign = async (req, res) => {
  try {
    const campaigns = await Campaign.find({})
      .populate({ path: "owner", select: "username" })
      .sort({ createdAt: -1 });

    if (!campaigns) {
      return res
        .status(404)
        .json({ success: false, message: "No campaigns found" });
    }

    return res.status(200).json({ success: true, data: { campaigns } });
  } catch (error) {
    console.error(`Error:${error}`);

    return res.status(500).json({
      success: false,
      message: "Error in retreiving campaigns",
      error: error.message,
    });
  }
};

//Create a campaign
export const createCampaign = async (req, res) => {
  const errors = validationResult(req); // Validate request
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    // Extract fields from the request body
    const {
      title,
      subtitle,
      category,
      subcategory,
      endDate,
      goalAmount,
      introduction,
      projectStory,
      owner,
    } = req.body;

    // File upload handling (image)
    const imagePath = req.file ? req.file.path : DEFAULT_IMG;

    // Hardcode the owner field for now
    // const owner = new mongoose.Types.ObjectId();

    // Create a new campaign document
    const newCampaign = await Campaign.create({
      title,
      subtitle,
      category,
      subcategory,
      endDate,
      goalAmount,
      introduction,
      projectStory,
      image: imagePath,
      owner,
    });

    // Send a response
    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create campaign",
      error: error.message,
    });
  }
};

// Get a single campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID (ensure it's a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Campaign ID",
      });
    }

    const campaign = await Campaign.findById(id).populate({
      path: "owner",
      select: "username",
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { campaign },
    });
  } catch (error) {
    console.error(`Error:${error}`);
    return res.status(500).json({
      success: false,
      message: "Error retrieving campaign",
      error: error.message,
    });
  }
};

// Delete a campaign by ID
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByIdAndDelete(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error(`Error:${error}`);
    return res.status(500).json({
      success: false,
      message: "Error deleting campaign",
      error: error.message,
    });
  }
};

// Update a campaign by ID
export const updateCampaign = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const { id } = req.params;

    // Extract the updated fields from the request body
    const {
      title,
      subtitle,
      category,
      subcategory,
      endDate,
      goalAmount,
      projectStory,
    } = req.body;

    // Find the existing campaign
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found. Update failed" });
    }

    // Handle image update: Use new image if uploaded, otherwise keep the existing one
    const imagePath = req.file ? req.file.path : campaign.image;

    // Find and update the campaign
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      {
        title,
        subtitle,
        category,
        subcategory,
        endDate,
        goalAmount,
        projectStory,
        image: imagePath,
        status: "Pending",
        createdAt: new Date(),
      },
      { new: true } // Return the updated campaign
    );

    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found. Update failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: { campaign: updatedCampaign },
    });
  } catch (error) {
    console.error(`Error:${error}`);
    return res.status(500).json({
      success: false,
      message: "Error updating campaign",
      error: error.message,
    });
  }
};

// Update a progress by ID

export const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const { amount } = req.body;

    // Ensure amount is treated as a number
    const parsedAmount = Number(amount);

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Add the amount to the existing progress
    const updatedProgressValue = (campaign.progress || 0) + parsedAmount;

    const updatedProgress = await Campaign.findByIdAndUpdate(
      id,
      {
        progress: updatedProgressValue,
      },
      { new: true }
    );

    if (!updatedProgress) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found. Update failed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campaign update successfully",
      data: { campaign: updatedProgress },
    });
  } catch (error) {
    console.error(`Error:${error}`);
    return res.status(500).json({
      success: false,
      message: "Error updating the campaign",
      error: error.message,
    });
  }
};
