import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../auth/models/auth.model.js";
import { Announcement } from "../models/announcement.model.js";

const requireAdmin = async (userId) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "admin")
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");
  return user;
};

// Public: active announcements, newest first.
export const getActiveAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find({ active: true }).sort({
    createdAt: -1,
  });
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", announcements));
});

// Admin: every announcement (active + inactive) for management.
export const getAllAnnouncements = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", announcements));
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const { text, tag, href, active } = req.body;
  if (typeof text !== "string" || text.trim() === "")
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Announcement text is required");

  const announcement = await Announcement.create({
    text: text.trim(),
    tag: tag?.trim() || undefined,
    href: href?.trim() || undefined,
    active: active !== undefined ? !!active : true,
  });

  res
    .status(STATUS_CODES.CREATED)
    .json(new ApiResponse(STATUS_CODES.CREATED, "Announcement created", announcement));
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const { text, tag, href, active } = req.body;

  const announcement = await Announcement.findById(req.params.id);
  if (!announcement)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Announcement not found");

  if (text !== undefined) {
    if (typeof text !== "string" || text.trim() === "")
      throw new ApiError(STATUS_CODES.BAD_REQUEST, "Announcement text is required");
    announcement.text = text.trim();
  }
  if (tag !== undefined) announcement.tag = tag?.trim() || undefined;
  if (href !== undefined) announcement.href = href?.trim() || undefined;
  if (active !== undefined) announcement.active = !!active;

  await announcement.save();
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "Announcement updated", announcement));
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Announcement not found");
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "Announcement deleted"));
});
