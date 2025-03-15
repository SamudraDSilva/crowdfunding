import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// Get transactions by donor
export const getTransactionsByDonor = async (req, res) => {
  const { donorId } = req.params;

  if (!donorId) {
    return res.status(400).json({ message: "Donor ID is required" });
  }

  try {
    const transactions = await Transaction.find({ donor: donorId })
      .populate({
        path: "campaign",
      })
      .sort({ createdAt: -1 });

    if (!transactions.length) {
      return res
        .status(404)
        .json({ message: "No transactions found for this donor" });
    }

    // Send the populated transactions as a response
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Donor Stats

export const getDonorStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: "$donor", // Group by donor to count unique donors
          totalAmount: { $sum: "$amount" }, // Sum of donations per donor
        },
      },
      {
        $group: {
          _id: null,
          uniqueDonors: { $sum: 1 }, // Count unique donors
          totalDonated: { $sum: "$totalAmount" }, // Sum of all donations
        },
      },
    ]);

    res.status(200).json({
      success: true,
      uniqueDonors: stats.length > 0 ? stats[0].uniqueDonors : 0,
      totalDonated: stats.length > 0 ? stats[0].totalDonated : 0,
    });
  } catch (error) {
    console.error("Error fetching donor stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create transaction
export const createTransaction = async (req, res) => {
  const { donorId, campaignId, amount } = req.body;

  if (!donorId || !campaignId || !amount) {
    return res
      .status(400)
      .json({ message: "Donor ID, Campaign ID, and Amount are required" });
  }

  try {
    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Create the transaction in collection
    const transaction = await Transaction.create({
      donor: donorId,
      campaign: campaignId,
      amount,
    });

    // Update the donor rank after the transaction is created
    const newRank = await updateDonorRank(donorId);

    return res.status(201).json({
      success: true,
      data: transaction,
      message: "Transaction successfully created",
      rank: newRank,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateDonorRank = async (donorId) => {
  const donor = await User.findById(donorId);
  if (!donor) return;

  const totalDonations = await calculateTotalDonations(donorId);

  let newRank = "Bronze";
  if (totalDonations >= 1000000) newRank = "Platinum";
  else if (totalDonations >= 500000) newRank = "Gold";
  else if (totalDonations >= 30000) newRank = "Silver";

  if (donor.rank !== newRank) {
    donor.rank = newRank;
    await donor.save();

    // Create a notification message
    const message = `Congratulations! Your rank has been updated to ${newRank}.`;

    // Create a new notification
    const notification = new Notification({
      userId: donor._id, // Assuming the donor is the user receiving the notification
      message: message,
    });

    // Save the notification
    await notification.save();

    return newRank;
  }
  return null;
};

export const calculateTotalDonations = async (donorId) => {
  const total = await Transaction.aggregate([
    { $match: { donor: new mongoose.Types.ObjectId(donorId) } },
    { $group: { _id: "$donor", total: { $sum: "$amount" } } },
  ]);

  return total.length ? total[0].total : 0;
};

// Get total donations by donor
export const getTotalDonations = async (req, res) => {
  try {
    const { donorId } = req.params;
    const totalDonations = await calculateTotalDonations(donorId);
    res.json({ success: true, total: totalDonations });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching total donations" });
  }
};
