import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who created the campaign
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign", // Reference to the campaign
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.5,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
