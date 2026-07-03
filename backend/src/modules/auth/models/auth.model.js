import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    mobile_number: {
      type: String,
      required: true,
      maxlength: 12,
      minlength: 10,
      match: [/^[0-9]{10,12}$/, "Invalid mobile number"],
    },
    role: {
      type: String,
      enum: ["student", "admin", "counseller"],
      default: "student",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password too weak!"],
      trim: true,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    }
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.SALT) || 12,
  );
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
  );
};

export const User = mongoose.model("User", userSchema);
