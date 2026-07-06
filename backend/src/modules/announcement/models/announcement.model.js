import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Announcement text is required"],
      trim: true,
      maxlength: 240,
    },
    // Optional short label shown as a pill, e.g. "New".
    tag: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    // Optional link the announcement points to.
    href: {
      type: String,
      trim: true,
    },
    // Only active announcements are shown on the public site.
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Announcement = mongoose.model("Announcement", announcementSchema);
