import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../utils/tokenUtils.js";

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const { _id, username, role, rank } = user;
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    return res.status(200).json({
      _id,
      username,
      role,
      email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const userSignup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);
    const { _id, role, rank } = user;

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    return res
      .status(200)
      .json({ _id, username, role, email, accessToken, refreshToken });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken: recivedToken } = req.body;
  if (!recivedToken)
    return res.status(401).json({ error: "No token provided" });

  try {
    // Verify the refresh token
    const decoded = jwt.verify(recivedToken, process.env.REFRESH_SECRET);

    // Find the user by ID and check tokenVersion
    const user = await User.findById(decoded._id);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Issue a new access token
    const accessToken = createAccessToken(user);

    return res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export const userLogout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Increment tokenVersion to invalidate old refresh tokens
    user.tokenVersion += 1;
    await user.save();

    // Clear refresh token from frontend
    res.clearCookie("refreshToken"); // HTTP-only cookies cleared on the client side
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
