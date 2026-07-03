import mongoose from "mongoose";
import { User } from "../../auth/models/auth.model.js";

const enquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    mobile_number: {
      type: String,
      minlength: 10,
      match: [/^[0-9]{10,12}$/, "Invalid mobile number"],
    },
    enquiryType: {
      type: String,
      enum: ["NIOS", "BBOSE", "BOSSE", "Other"],
      default: "NIOS",
    },
    // Free-text board name, used when enquiryType === "Other".
    customBoard: {
      type: String,
      trim: true,
    },
    classType: {
      type: String,
      enum: ["10th", "12th"],
    },
    description: {
      type: String,
    },
    role: {
        type: String,
        enum : ["student", 'guest'],
        default: "guest"
    }
  },
  { timestamps: true },
);


export const Enquiry = mongoose.model("Enquiry", enquirySchema);