// backend/controllers/favoriteController.js
import Favorite from "../models/Favourite.js";

export async function toggleFavorite(req, res) {
  const { userId, campaignId } = req.body;
  try {
    const existingFavorite = await Favorite.findOne({
      user: userId,
      campaign: campaignId,
    });
    if (existingFavorite) {
      await Favorite.deleteOne({ user: userId, campaign: campaignId });
      return res.json({ message: "Removed from favorites", isFavorite: false });
    } else {
      const newFavorite = new Favorite({ user: userId, campaign: campaignId });
      await newFavorite.save();
      return res.json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getFavoriteStatus(req, res) {
  const { userId, campaignId } = req.query; // Extract from query params
  try {
    if (!userId || !campaignId) {
      return res
        .status(400)
        .json({ error: "Missing userId or campaignId in query parameters" });
    }
    const favorite = await Favorite.findOne({
      user: userId,
      campaign: campaignId,
    });
    res.json({ isFavorite: !!favorite }); // true if found, false if not
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
