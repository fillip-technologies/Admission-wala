import STATUS_CODES from "../../../common/constants/statusCode.js";
import { transporter } from "../../../configs/mail.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../auth/models/auth.model.js";

export const createCounsellers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (user.role !== "admin")
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Unauthorized");

  const { name, email, mobile_number, password } = req.body;
  if (
    [name, email, mobile_number, password].some(
      (data) => typeof data !== "string" || data.trim() === "",
    )
  ) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "All fields are required");
  }

  if (password.length < 6)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Password must be at least 6 characters");

  const existingCounseller = await User.findOne({ email });
  if (existingCounseller)
    throw new ApiError(STATUS_CODES.CONFLICT, "User already exists");

  const couns = await User.create({
    name,
    email,
    mobile_number,
    password,
    role: "counseller",
  });

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      process.env.SMTP_USER ||
      process.env.EMAIL_USER,
    to: couns.email,
    subject: "Your counsellor account has been created",
    text: `Hello ${couns.name},

Your counsellor account has been created successfully.

Login email: ${couns.email}
Temporary password: ${password}

Please login and change your password after your first sign in.

Regards,
Admission Wala`,
  });
  
  res.status(STATUS_CODES.CREATED)
  .json(new ApiResponse(STATUS_CODES.CREATED, "Counseller created and email sent", couns))
});

export const getAllCounsellers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (user.role !== "admin")
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Unauthorized");
  const counsellers = await User.find({ role: "counseller" });
  res
    .status(STATUS_CODES.OK)
    .json(new ApiResponse(STATUS_CODES.OK, "", counsellers));
});
