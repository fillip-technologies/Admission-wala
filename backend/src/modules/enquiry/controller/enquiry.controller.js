import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../auth/models/auth.model.js";
import { Enquiry } from "../model/enquiry.model.js";

export const sendEnquiry = asyncHandler(async (req, res) => {
  const { email, mobile_number, enquiryType, classType, description } =
    req.body;

  if (
    [email, mobile_number, enquiryType, classType, description].some(
      (field) => field?.trim() === "",
    )
  ) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid data field");
  }
 
  const user = await User.findById(req.user);
  const enq = await Enquiry.create({
    user:user.id,
    email: email,
    mobile_number: mobile_number,
    enquiryType: enquiryType,
    classType: classType,
    description: description,
    role: user?.role || 'guest'
  });

  if (!enq)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Problem submitting enquiry");

  res
    .status(STATUS_CODES.OK)
    .json(
      new ApiResponse(
        STATUS_CODES.CREATED,
        "enquiry submitted Succesfully",
        enq,
      ),
    );
});

export const getEnquiry = asyncHandler(async (req, res) => {
  const userId = req.user;
  
  const user = await User.findById(userId);
 
  if (user.role !== "admin" && user.role !== "counseller"){
     console.log(user, user.role)
     throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Unauthorized Access");
  }

  const enquiry = await Enquiry.find().populate()
 
  res.status(STATUS_CODES.OK)
  .json(new ApiResponse(STATUS_CODES.OK, "all enquiries are fetched", enquiry));
});


