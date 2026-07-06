import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../auth/models/auth.model.js";
import { PromoSlide } from "../models/promo.model.js";

const requireAdmin = async (userId) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "admin")
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");
  return user;
};

// Public: active slides, ordered.
export const getActiveSlides = asyncHandler(async (req, res) => {
  const slides = await PromoSlide.find({ active: true }).sort({ order: 1, createdAt: -1 });
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", slides));
});

// Admin: all slides for management.
export const getAllSlides = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const slides = await PromoSlide.find().sort({ order: 1, createdAt: -1 });
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", slides));
});

export const createSlide = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const { title, text, ctaLabel, ctaHref, active, order } = req.body;
  if (typeof title !== "string" || title.trim() === "")
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Slide title is required");

  const slide = await PromoSlide.create({
    title: title.trim(),
    text: text?.trim() || undefined,
    ctaLabel: ctaLabel?.trim() || undefined,
    ctaHref: ctaHref?.trim() || undefined,
    active: active !== undefined ? !!active : true,
    order: Number.isFinite(Number(order)) ? Number(order) : 0,
  });

  res
    .status(STATUS_CODES.CREATED)
    .json(new ApiResponse(STATUS_CODES.CREATED, "Slide created", slide));
});

export const updateSlide = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const { title, text, ctaLabel, ctaHref, active, order } = req.body;

  const slide = await PromoSlide.findById(req.params.id);
  if (!slide) throw new ApiError(STATUS_CODES.NOT_FOUND, "Slide not found");

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "")
      throw new ApiError(STATUS_CODES.BAD_REQUEST, "Slide title is required");
    slide.title = title.trim();
  }
  if (text !== undefined) slide.text = text?.trim() || undefined;
  if (ctaLabel !== undefined) slide.ctaLabel = ctaLabel?.trim() || undefined;
  if (ctaHref !== undefined) slide.ctaHref = ctaHref?.trim() || undefined;
  if (active !== undefined) slide.active = !!active;
  if (order !== undefined && Number.isFinite(Number(order))) slide.order = Number(order);

  await slide.save();
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "Slide updated", slide));
});

export const deleteSlide = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const slide = await PromoSlide.findByIdAndDelete(req.params.id);
  if (!slide) throw new ApiError(STATUS_CODES.NOT_FOUND, "Slide not found");
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "Slide deleted"));
});
