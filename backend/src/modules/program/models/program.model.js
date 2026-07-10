import mongoose from "mongoose";


const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
      maxlength: 80,
    },
    
    category: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    
    href: {
      type: String,
      trim: true,
    },
  
    active: {
      type: Boolean,
      default: true,
    },
    
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Program = mongoose.model("Program", programSchema);
