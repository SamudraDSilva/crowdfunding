import Notification from "../models/Notification.js";

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  const userId = req.query.userId;
  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: { notifications } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get unread notifications count
export const getUnreadCount = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res
      .status(500)
      .json({ success: false, message: "User id required" });
  }

  try {
    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Mark notifications as read
export const markAsRead = async (req, res) => {
  const { userId } = req.query;
  try {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new notification (for testing or real event triggers)
export const createNotification = async (req, res) => {
  try {
    const { userId, message, link } = req.body;
    const notification = new Notification({ userId, message, link });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Clear all notifications for a user
export const clearNotifications = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User id required" });
  }

  try {
    await Notification.deleteMany({ userId });
    res
      .status(200)
      .json({ success: true, message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
