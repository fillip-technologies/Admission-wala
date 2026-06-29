import STATUS_CODES from "../../../common/constants/statusCode";
import { apiHandler } from "../../../utils/asyncHandler";
import { User } from "../models/auth.model";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, mobile_number, password } = req.body;

  if (
    [name, email, mobile_number, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "All fields are required");
  }

  const existingUser = User.findOne({email: email});

  if(existingUser) throw new ApiError(STATUS_CODES.BAD_REQUEST, "User already exists");

  


});
