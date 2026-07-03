import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/apiError.js";

import { User } from "../models/auth.model.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { cookieOptions } from "../../../utils/cookieOptions.js";
import { transporter } from "../../../configs/mail.js";
import { sendMail } from "../../../utils/sendMail.js";
import { genrateOtp } from "../../../utils/otp.utils.js";

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

  res
    .status(STATUS_CODES.CREATED)
    .json(
      new ApiResponse(
        STATUS_CODES.CREATED,
        "User registered successfully",
        user,
      ),
    );
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
  const {email} = req.body;
  if(email.trim()==='') throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please enter a mail');

  const user = await User.findOne({email:email});

  if(!user) throw new ApiError(STATUS_CODES.NOT_FOUND, "No user exist with this email");

  const otp = genrateOtp();
  await sendMail({
    to: user.email,
    subject: "One time otp for password update",
    html: `
      <h2>This is your one time password (OTP):</h2>
      <p>${otp}</p>
    `,
  });

  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "OTP sent to your email"));
})
