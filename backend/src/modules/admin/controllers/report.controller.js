import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../auth/models/auth.model.js";
import { Enquiry } from "../../enquiry/model/enquiry.model.js";
import { Admission } from "../../admission/models/admission.model.js";
import { CounsellingAppointment } from "../../counseller/models/appointment.model.js";

// Turn an aggregation [{ _id, count }] into a plain { key: count } map.
const toMap = (rows) =>
  rows.reduce((acc, r) => {
    acc[r._id ?? "unknown"] = r.count;
    return acc;
  }, {});

const groupCount = (Model, field) =>
  Model.aggregate([{ $group: { _id: `$${field}`, count: { $sum: 1 } } }]);

// Admin: aggregated reports & analytics for the dashboard.
export const getReports = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user || user.role !== "admin")
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");

  const [
    students,
    counsellers,
    enquiries,
    admissions,
    appointments,
    admissionsByStatus,
    admissionsByBoard,
    counsellingByStatus,
    enquiriesByType,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "counseller" }),
    Enquiry.countDocuments(),
    Admission.countDocuments(),
    CounsellingAppointment.countDocuments(),
    groupCount(Admission, "status"),
    groupCount(Admission, "board"),
    groupCount(CounsellingAppointment, "status"),
    groupCount(Enquiry, "enquiryType"),
  ]);

  const admissionStatusMap = toMap(admissionsByStatus);
  const pendingAdmissions =
    (admissionStatusMap.submitted || 0) +
    (admissionStatusMap.under_review || 0) +
    (admissionStatusMap.documents_verified || 0);

  res.status(STATUS_CODES.OK).json(
    new ApiResponse(STATUS_CODES.OK, "", {
      totals: {
        students,
        counsellers,
        enquiries,
        admissions,
        appointments,
        pendingAdmissions,
        approvedAdmissions: admissionStatusMap.approved || 0,
      },
      admissionsByStatus: admissionStatusMap,
      admissionsByBoard: toMap(admissionsByBoard),
      counsellingByStatus: toMap(counsellingByStatus),
      enquiriesByType: toMap(enquiriesByType),
    }),
  );
});
