import mongoose from "mongoose";

export const COUNSELLING_STATUSES = [
  "requested",
  "assigned",
  "scheduled",
  "completed",
  "cancelled",
];

const noteSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: { type: String, required: true, trim: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const counsellingAppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile_number: {
      type: String,
      minlength: 10,
      maxlength: 15,
      match: [/^[0-9]{10,15}$/, "Invalid mobile number"],
    },
    topic: { type: String, trim: true },
    query: { type: String, trim: true },
    preferredDate: { type: Date },
    scheduledAt: { type: Date },
    assignedCounseller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: COUNSELLING_STATUSES,
      default: "requested",
    },
    notes: {
      type: [noteSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const CounsellingAppointment = mongoose.model(
  "CounsellingAppointment",
  counsellingAppointmentSchema,
);
