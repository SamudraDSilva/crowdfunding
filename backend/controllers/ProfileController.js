import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../utils/tokenUtils.js";

export const getMyCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.find({ _id: id });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const campaigns = await Campaign.find({ owner: id }).sort({
      createdAt: -1,
    });
    if (campaigns.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No campaigns found" });
    }

    return res.status(200).json({ success: true, data: { campaigns } });
  } catch (error) {
    console.error("Error fetching user campaigns", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error fetching user campaigns",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const { userId, username, currentPassword, newPassword, confirmNewPassword } =
    req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!username && !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Provide necessary fields" });
    }

    let accessToken, refreshToken;

    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Current password is required" });
      }

      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
      }

      if (newPassword !== confirmNewPassword) {
        return res
          .status(400)
          .json({ success: false, message: "New passwords do not match" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      user.tokenVersion += 1; // Invalidate old tokens

      // Assign tokens properly
      accessToken = createAccessToken(user);
      refreshToken = createRefreshToken(user);
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res
          .status(400)
          .json({ success: false, message: "Username already in use" });
      }
      user.username = username;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: { username: user.username, email: user.email, rank: user.rank },
      ...(newPassword && { accessToken, refreshToken }),
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error updating user profile",
    });
  }
};

export const getUserRank = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: { rank: user.rank } });
  } catch (error) {
    ru;
    console.error("Error fetching user rank", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error fetching user rank",
    });
  }
};
