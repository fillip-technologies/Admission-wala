import mongoose from "mongoose";
import { User } from "../../auth/models/auth.model";

const counsellingAppointementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    mobile_number:{
        type: String,
        minlength: 10,
        maxlength: 15,
        match: [/^[0-9]{10,15}$/, "Invalid mobile number"],
    },
    counsellingStatus:{
        type: String,
        enum: ['requested', 'open', 'processing', 'closed']
    },
    academinRecord:{
        type: String,
        trim: true,
    },
    query: {
      type: String,
    },
  },
  { timestamps: true },
);

export const CounsellingAppointment = mongoose.model("CounsellingAppointment", counsellingAppointementSchema);
