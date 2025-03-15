import express from "express";
import {
  userLogin,
  userSignup,
  userLogout,
  refreshToken,
} from "../controllers/AuthController.js";

import { verifyToken } from "../middlewares/authMiddleware.js"; // Ensures only logged-in users can log out

const router = express.Router();

//User Login
router.post("/login", userLogin);

//User Signup
router.post("/signup", userSignup);

//User Logout
router.post("/logout", userLogout);

//Refresh Token
router.post("/refresh", verifyToken, refreshToken);

export default router;
