import mongoose from "mongoose";
import Campaign from "../models/Campaign.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

//Get all the campaign

export const getCampaign = async (req, res) => {
  try {
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });

    if (!campaigns) {
      return res.status(200).json({ success: true, data: {} });
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

    const campaign = await Campaign.findById(id);

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
export const editCampaign = async (req, res) => {
  const DEFAULT_IMG = "assets\\images\\no_image_available.jpg";

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const { id } = req.params; //Correctly extract campaign ID
    let updateFields = { ...req.body };

    // Handle image upload if present

    if (req.file) {
      updateFields.image = req.file ? req.file.path : DEFAULT_IMG;
    }

    if (updateFields.status === "Active") {
      updateFields.activeAt = Date.now();
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedCampaign) {
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    }

    return res
      .status(200)
      .json({ success: true, data: { campaign: updatedCampaign } });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error updating campaign",
      error: error.message,
    });
  }
};

// Get total progress
export const getTotalProgress = async (req, res) => {
  try {
    const result = await Campaign.aggregate([
      {
        $group: {
          _id: null, // No grouping, sum across all documents
          totalProgress: { $sum: "$progress" }, // Sum the `progress` field
        },
      },
    ]);

    const totalProgress = result.length > 0 ? result[0].totalProgress : 0;

    res.status(200).json({
      success: true,
      totalProgress,
    });
  } catch (error) {
    console.error("Error calculating total progress:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching total progress",
      error: error.message,
    });
  }
};

//USERS

//Get all users

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    return res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    console.error(`Error:${error}`);

    return res.status(500).json({
      success: false,
      message: "Error in retreiving users",
      error: error.message,
    });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(`Error:${error}`);
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

//update user

export const editUser = async (req, res) => {
  const { id } = req.params; // Assume you pass the user ID in the request parameters
  const { username, email, role } = req.body; // Assume these are the fields to be updated
  try {
    // Find the user by ID and update the relevant fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, role }, // Update fields
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error(`Error: ${error}`);

    return res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

//Transaction

export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "campaign",
        select: "title",
      })
      .populate({
        path: "donor",
        select: "username",
      });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transactions not found" });
    }

    return res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal error");
  }
};
