import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../auth/models/auth.model.js";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload.js";
import { Admission, ADMISSION_STATUSES } from "../models/admission.model.js";

const BOARDS = ["NIOS", "BBOSE", "BOSSE"];
const CLASS_TYPES = ["10th", "12th"];

// Student: submit a new admission application with document uploads.
export const createAdmission = asyncHandler(async (req, res) => {
  const { board, classType, course } = req.body;

  if (!BOARDS.includes(board))
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Please select a valid board");
  if (!CLASS_TYPES.includes(classType))
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Please select a valid class");

  // One active application at a time; a rejected one can be re-submitted.
  const existing = await Admission.findOne({
    user: req.user,
    status: { $ne: "rejected" },
  });
  if (existing)
    throw new ApiError(
      STATUS_CODES.CONFLICT,
      "You already have an active admission application",
    );

  const files = req.files || [];
  const documents = [];
  for (const file of files) {
    const result = await uploadToCloudinary(file.buffer, "admissions");
    documents.push({
      label: file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  const admission = await Admission.create({
    user: req.user,
    board,
    classType,
    course,
    documents,
    status: "submitted",
    statusHistory: [
      { status: "submitted", note: "Application submitted", at: new Date() },
    ],
  });

  res
    .status(STATUS_CODES.CREATED)
    .json(new ApiResponse(STATUS_CODES.CREATED, "Admission submitted", admission));
});

// Student: list own applications (newest first) for tracking.
export const getMyAdmission = asyncHandler(async (req, res) => {
  const admissions = await Admission.find({ user: req.user }).sort({
    createdAt: -1,
  });
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", admissions));
});

// Admin / counsellor: list all applications.
export const getAllAdmissions = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user || (user.role !== "admin" && user.role !== "counseller"))
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");

  const admissions = await Admission.find()
    .populate("user", "name email mobile_number")
    .sort({ createdAt: -1 });
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", admissions));
});

// Admin / counsellor: advance an application's status (drives the tracking timeline).
export const updateAdmissionStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user || (user.role !== "admin" && user.role !== "counseller"))
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");

  const { id } = req.params;
  const { status, note } = req.body;

  if (!ADMISSION_STATUSES.includes(status))
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid status");

  const admission = await Admission.findById(id);
  if (!admission)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Admission not found");

  admission.status = status;
  admission.statusHistory.push({ status, note, at: new Date() });
  await admission.save();

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "Admission status updated", admission));
});
