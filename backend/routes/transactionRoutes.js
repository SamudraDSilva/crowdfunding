import express from "express";
import {
  getTransactionsByDonor,
  createTransaction,
  getTotalDonations,
  getDonorStats,
} from "../controllers/TransactionController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Get all transactions
router.get("/stats", getDonorStats);
router.get("/:donorId", verifyToken, getTransactionsByDonor);
router.get("/totalDonation/:donorId", verifyToken, getTotalDonations);
router.post("/", createTransaction);

export default router;
