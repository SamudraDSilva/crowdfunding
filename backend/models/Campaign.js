import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 60,
    },
    subtitle: {
      type: String,
      maxlength: 135,
    },
    category: {
      type: String,
      enum: [
        "Technology",
        "Health",
        "Education",
        "Art",
        "Food",
        "Discover",
        "Environment",
        "Others",
      ],
      default: "Others",
    },
    subcategory: {
      type: String,
    },
    image: {
      type: String, // Store the image URL or file path
    },
    endDate: {
      type: Date,
      required: true,
    },
    goalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    projectStory: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Deactive"],
      default: "Pending",
    },
    progress: {
      type: Number, // Tracks the total amount funded
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who created the campaign
      required: true,
    },
    activeAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
