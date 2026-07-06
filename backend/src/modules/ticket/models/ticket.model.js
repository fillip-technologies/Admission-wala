import mongoose from "mongoose";

export const TICKET_STATUSES = ["open", "closed"];

// A single message in a ticket thread. `senderRole` is captured at write time so
// the UI can label messages without re-fetching the sender's current role.
const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: ["student", "counseller", "admin"], required: true },
    body: { type: String, trim: true },
    // Optional resource shared by a counsellor (e.g. a guide or form link).
    resourceUrl: { type: String, trim: true },
    resourceLabel: { type: String, trim: true },
    at: { type: Date, default: Date.now },
  },
  { _id: true },
);

const ticketSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional link to a specific admission the ticket is about.
    admission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    status: {
      type: String,
      enum: TICKET_STATUSES,
      default: "open",
    },
    // The counsellor handling the ticket (set when a counsellor first replies).
    counseller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
