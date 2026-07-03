import multer from "multer";
import STATUS_CODES from "../constants/statusCode.js";

// Central error handler: serializes thrown ApiErrors (and others) to the
// { success, status, message, data } shape the frontend expects. Must be
// registered after all routes.
export const errorHandler = (err, req, res, next) => {
  let status = err.status || err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong";

  if (err instanceof multer.MulterError) {
    status = STATUS_CODES.BAD_REQUEST;
    if (err.code === "LIMIT_FILE_SIZE") message = "File too large (max 5MB)";
  }

  if (process.env.NODE_ENV !== "production" && status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    status,
    message,
    data: null,
  });
};
