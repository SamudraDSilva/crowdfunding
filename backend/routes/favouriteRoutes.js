// backend/routes/favoriteRoutes.js
import express from "express";
import * as favoriteController from "../controllers/FavoriteController";

const router = express.Router();

router.post("/toggle", favoriteController.toggleFavorite);
router.get("/", favoriteController.getFavoriteStatus);

export default router;
