import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    let decoded;
    let secretKey;

    // Check if the token is a refresh or access token
    if (req.path === "/refresh-token") {
      secretKey = process.env.REFRESH_SECRET; // Use refresh secret
    } else {
      secretKey = process.env.ACCESS_SECRET; // Use access secret
    }

    decoded = jwt.verify(token, secretKey);

    // Find user
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Check if tokenVersion is valid (only needed for refresh tokens)
    if (
      req.path === "/refresh-token" &&
      user.tokenVersion !== decoded.tokenVersion
    ) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
