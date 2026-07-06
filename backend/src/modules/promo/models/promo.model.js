import mongoose from "mongoose";

const promoSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Slide title is required"],
      trim: true,
      maxlength: 160,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 400,
    },
    ctaLabel: {
      type: String,
      trim: true,
      maxlength: 40,
    },
    // Route ("/signup") or section anchor ("/#courses").
    ctaHref: {
      type: String,
      trim: true,
    },
    // Only active slides are shown on the public carousel.
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

export const PromoSlide = mongoose.model("PromoSlide", promoSlideSchema);
