import mongoose from "mongoose";

export const ADMISSION_STATUSES = [
  "submitted",
  "under_review",
  "documents_verified",
  "approved",
  "rejected",
];

const documentSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    publicId: { type: String },
  },
  { _id: false },
);

const statusEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ADMISSION_STATUSES, required: true },
    note: { type: String, trim: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const admissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    board: {
      type: String,
      enum: ["NIOS", "BBOSE", "BOSSE", "Other"],
      required: true,
    },
    // Free-text board name, used when board === "Other".
    customBoard: {
      type: String,
      trim: true,
    },
    classType: {
      type: String,
      enum: ["10th", "12th"],
      required: true,
    },
    course: {
      type: String,
      trim: true,
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ADMISSION_STATUSES,
      default: "submitted",
    },
    statusHistory: {
      type: [statusEventSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Admission = mongoose.model("Admission", admissionSchema);
