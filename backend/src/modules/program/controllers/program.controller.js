import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../auth/models/auth.model.js";
import { Program } from "../models/program.model.js";

const requireAdmin = async (userId) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "admin")
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");
  return user;
};


export const getActivePrograms = asyncHandler(async (req, res) => {
  const programs = await Program.find({ active: true }).sort({ order: 1, createdAt: 1 });
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", programs));
});


export const getAllPrograms = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const programs = await Program.find().sort({ order: 1, createdAt: 1 });
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", programs));
});

export const createProgram = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const { name, category, href, active, order } = req.body;
  if (typeof name !== "string" || name.trim() === "")
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Program name is required");

  const program = await Program.create({
    name: name.trim(),
    category: category?.trim() || undefined,
    href: href?.trim() || undefined,
    active: active !== undefined ? !!active : true,
    order: Number.isFinite(Number(order)) ? Number(order) : 0,
  });

  res
    .status(STATUS_CODES.CREATED)
    .json(new ApiResponse(STATUS_CODES.CREATED, "Program created", program));
});

export const updateProgram = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const { name, category, href, active, order } = req.body;

  const program = await Program.findById(req.params.id);
  if (!program) throw new ApiError(STATUS_CODES.NOT_FOUND, "Program not found");

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "")
      throw new ApiError(STATUS_CODES.BAD_REQUEST, "Program name is required");
    program.name = name.trim();
  }
  if (category !== undefined) program.category = category?.trim() || undefined;
  if (href !== undefined) program.href = href?.trim() || undefined;
  if (active !== undefined) program.active = !!active;
  if (order !== undefined && Number.isFinite(Number(order))) program.order = Number(order);

  await program.save();
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "Program updated", program));
});

export const deleteProgram = asyncHandler(async (req, res) => {
  await requireAdmin(req.user);
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) throw new ApiError(STATUS_CODES.NOT_FOUND, "Program not found");
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "Program deleted"));
});
