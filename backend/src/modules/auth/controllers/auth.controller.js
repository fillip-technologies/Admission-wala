import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/apiError.js";

import { User } from "../models/auth.model.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { cookieOptions } from "../../../utils/cookieOptions.js";
import { sendMail } from "../../../utils/sendMail.js";
import { issueOtp, verifyOtp } from "../../../utils/otp.utils.js";

// Simple branded OTP email body.
const otpEmail = (name, otp, purpose) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
    <h2>Shri Admission Gurukul</h2>
    <p>Hello ${name || "there"},</p>
    <p>Your one-time password (OTP) for <strong>${purpose}</strong> is:</p>
    <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
    <p>This code is valid for 10 minutes. Please do not share it with anyone.</p>
    <p>Regards,<br/>Shri Admission Gurukul</p>
  </div>
`;

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, mobile_number, password } = req.body;
  if (
    [name, email, mobile_number, password].some(
      (field) => field?.trim() === "",
    )
  ) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "All fields are required");
  }

  if (password.length < 6)
    throw new ApiError(STATUS_CODES.BAD_GATEWAY, "Invalid crendentials");
  if (mobile_number.length < 10)
    throw new ApiError(STATUS_CODES.BAD_GATEWAY, "Invalid credentials");

  const existingUser = await User.findOne({ email: email });

  if (existingUser)
    throw new ApiError(STATUS_CODES.CONFLICT, "User already exists");

  const user = await User.create({
    name: name,
    email: email,
    mobile_number: mobile_number,
    password: password,
    role: "student"
  });

  const otp = await issueOtp({ email: user.email, purpose: "email_verification" });
  await sendMail({
    to: user.email,
    subject: "Verify your email - Shri Admission Gurukul",
    html: otpEmail(user.name, otp, "email verification"),
  });

  res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(
        STATUS_CODES.CREATED,
        "User registered. Please verify your email with the OTP sent to you.",
        user,
      ),
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if ([email, otp].some((f) => typeof f !== "string" || f.trim() === "")) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Email and OTP are required");
  }
  
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(STATUS_CODES.NOT_FOUND, "No user found with this email");

  if (user.isEmailVerified) {
    return res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, "Email already verified"));
  }

  const result = await verifyOtp({ email, otp, purpose: "email_verification" });
  if (!result.ok) throw new ApiError(STATUS_CODES.BAD_REQUEST, result.reason);

  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "Email verified successfully"));
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (typeof email !== "string" || email.trim() === "")
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(STATUS_CODES.NOT_FOUND, "No user found with this email");

  if (user.isEmailVerified)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Email already verified");

  const otp = await issueOtp({ email: user.email, purpose: "email_verification" });
  await sendMail({
    to: user.email,
    subject: "Verify your email - Shri Admission Gurukul",
    html: otpEmail(user.name, otp, "email verification"),
  });

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "A new OTP has been sent to your email"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid crendentilas");
  }

  const user = await User.findOne({ email: email }).select(
    "+password +refreshToken",
  );

  if (!user)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Invalid crendentilas");

  const iscorrect = await user.isPasswordCorrect(password);

  if (!iscorrect)
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid credentials");

  if (!user.isEmailVerified)
    throw new ApiError(
      STATUS_CODES.FORBIDDEN,
      "Please verify your email before logging in",
    );

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res
    .status(STATUS_CODES.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(STATUS_CODES.CREATED, `Welcome ${user.name}`, user));
});

export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);
  if (!user)
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "You are not authorized");
  
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", user));
});

export const logOut = asyncHandler(async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId).select("+refreshToken");
  if (!user) throw new ApiError(STATUS_CODES.NOT_FOUND, "Unaothozrized");
  user.refreshToken = "";
  await user.save({ validateBeforeSave: false });
  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(200, "Logged out successfully"));
});

export const getAllStudents = asyncHandler(async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(STATUS_CODES.NOT_FOUND, "NOT Found");

  if (user.role !== "admin" && user.role !== "counseller")
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Unaothozrized");

  const student = await User.find({ role: "student" });

  if (!student) throw new ApiError(STATUS_CODES.NOT_FOUND, "Unauthozrized");

  res.status(200).json(new ApiResponse(STATUS_CODES.OK, "", student));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (typeof email !== "string" || email.trim() === "")
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Please enter an email");

  const user = await User.findOne({ email });
  if (!user)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "No user exists with this email");

  const otp = await issueOtp({ email: user.email, purpose: "password_reset" });
  await sendMail({
    to: user.email,
    subject: "Reset your password - Shri Admission Gurukul",
    html: otpEmail(user.name, otp, "password reset"),
  });

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "OTP sent to your email"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (
    [email, otp, newPassword].some(
      (f) => typeof f !== "string" || f.trim() === "",
    )
  ) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Email, OTP and new password are required",
    );
  }

  if (newPassword.length < 6)
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Password must be at least 6 characters",
    );

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    throw new ApiError(STATUS_CODES.NOT_FOUND, "No user exists with this email");

  const result = await verifyOtp({ email, otp, purpose: "password_reset" });
  if (!result.ok) throw new ApiError(STATUS_CODES.BAD_REQUEST, result.reason);

  user.password = newPassword;
  // Invalidate existing sessions after a password reset.
  user.refreshToken = "";
  await user.save();

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "Password reset successfully. Please log in."));
});
