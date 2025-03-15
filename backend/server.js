import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";
import profileRouter from "./routes/profileRouter.js";
import notificationRouter from "./routes/notificationRoutes.js";
import favoriteRouter from "./routes/favouriteRoutes.js";
import { verifyToken } from "./middlewares/authMiddleware.js";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";

dotenv.config();

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream("logs/access.log", { flags: "a" });

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: [process.env.FRONTEND_URL, "http://localhost:3000"] }));
app.use(morgan("dev", { stream: accessLogStream }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transaction", transactionRouter);
app.use("/api/profile", profileRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/assets", express.static("assets"));
app.use("/api/favourite", favoriteRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  connectDB(); // Connect to the database
  console.log(`Server started at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  process.exit(0);
});
