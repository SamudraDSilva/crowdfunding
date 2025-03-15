import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role, tokenVersion: user.tokenVersion },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" } // Short-lived token
  );
};

export const createRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" } // Long-lived token
  );
};
