// backend/routes/favoriteRoutes.js
import express from "express";
import {
  toggleFavorite,
  getFavoriteStatus,
} from "../controllers/FavoriteController.js";

const router = express.Router();

router.post("/toggle", toggleFavorite);
router.get("/", getFavoriteStatus);

export default router;
