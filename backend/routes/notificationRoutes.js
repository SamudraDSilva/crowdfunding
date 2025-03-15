import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  createNotification,
  clearNotifications,
} from "../controllers/NotificationController.js";

const router = express.Router();

router.get("/", getNotifications); // Get all notifications
router.get("/unread-count", getUnreadCount); // Get unread count
router.put("/mark-as-read", markAsRead); // Mark notifications as read
router.post("/", createNotification); // Create a new notification
router.delete("/clear-all", clearNotifications);
export default router;
