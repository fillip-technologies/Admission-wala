import asyncHandler from "../../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError";
import STATUS_CODES from "../constants/statusCode";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken

  if (!token) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "You are not authorized"
    );
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "Invalid or expired token"
    );
  }

  req.user = decoded;
  next();
});
