import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  // User is not logged in
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.id;
  } catch (err) {
    // Invalid token -> treat as guest
    req.user = null;
  }

  next();
});