import mongoose from "mongoose";

// A single course/admission tag shown in the moving strip on the home hero.
const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
      maxlength: 80,
    },
    // Optional group label, e.g. "Competitive Exam" or "Website". Purely for
    // the admin's own organisation; the public strip just shows the name.
    category: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    // Optional link — clicking the pill navigates here ("/#courses", "/signup").
    href: {
      type: String,
      trim: true,
    },
    // Only active programs appear on the public strip.
    active: {
      type: Boolean,
      default: true,
    },
    // Lower numbers show first.
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Program = mongoose.model("Program", programSchema);
