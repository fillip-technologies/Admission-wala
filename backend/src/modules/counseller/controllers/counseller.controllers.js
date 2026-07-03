import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../auth/models/auth.model.js";
import {
  CounsellingAppointment,
  COUNSELLING_STATUSES,
} from "../models/appointment.model.js";

const isStaff = (role) => role === "admin" || role === "counseller";

// Student: request a counselling appointment.
export const requestCounselling = asyncHandler(async (req, res) => {
  const { topic, query, preferredDate, mobile_number } = req.body;

  const user = await User.findById(req.user);
  if (!user) throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Not authorized");

  const appointment = await CounsellingAppointment.create({
    user: user._id,
    name: user.name,
    email: user.email,
    mobile_number: mobile_number || user.mobile_number,
    topic,
    query,
    preferredDate: preferredDate || undefined,
    status: "requested",
  });

  res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(
        STATUS_CODES.CREATED,
        "Counselling request submitted",
        appointment,
      ),
    );
});

// Student: list own counselling appointments.
export const getMyCounselling = asyncHandler(async (req, res) => {
  const appointments = await CounsellingAppointment.find({ user: req.user })
    .populate("assignedCounseller", "name email")
    .sort({ createdAt: -1 });
  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "", appointments));
});

// Staff list. ?scope=open (unassigned requests) | assigned (mine) | all (admin).
export const listCounselling = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user || !isStaff(user.role))
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");

  const scope = req.query.scope || "assigned";
  let filter;
  if (scope === "open") {
    filter = { status: "requested", assignedCounseller: { $exists: false } };
  } else if (scope === "all") {
    if (user.role !== "admin")
      throw new ApiError(STATUS_CODES.FORBIDDEN, "Admins only");
    filter = {};
  } else {
    filter = { assignedCounseller: user._id };
  }

  const appointments = await CounsellingAppointment.find(filter)
    .populate("user", "name email mobile_number")
    .populate("assignedCounseller", "name email")
    .sort({ createdAt: -1 });

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "", appointments));
});

// Counsellor: claim an open request (self-assign).
export const claimCounselling = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user || user.role !== "counseller")
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Only counsellors can claim requests");

  const appointment = await CounsellingAppointment.findById(req.params.id);
  if (!appointment)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Appointment not found");
  if (appointment.assignedCounseller)
    throw new ApiError(STATUS_CODES.CONFLICT, "Already assigned to a counsellor");

  appointment.assignedCounseller = user._id;
  appointment.status = "assigned";
  await appointment.save();

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "Appointment claimed", appointment));
});

// Staff: update status and/or schedule.
export const updateCounsellingStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user || !isStaff(user.role))
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");

  const { status, scheduledAt } = req.body;
  if (status && !COUNSELLING_STATUSES.includes(status))
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid status");

  const appointment = await CounsellingAppointment.findById(req.params.id);
  if (!appointment)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Appointment not found");

  if (status) appointment.status = status;
  if (scheduledAt) appointment.scheduledAt = scheduledAt;
  await appointment.save();

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "Appointment updated", appointment));
});

// Staff: add a consultation / follow-up note.
export const addCounsellingNote = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user || !isStaff(user.role))
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");

  const { note } = req.body;
  if (typeof note !== "string" || note.trim() === "")
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Note cannot be empty");

  const appointment = await CounsellingAppointment.findById(req.params.id);
  if (!appointment)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Appointment not found");

  appointment.notes.push({ author: user._id, note: note.trim(), at: new Date() });
  await appointment.save();

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "Note added", appointment));
});
