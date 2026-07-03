// Ordered admission lifecycle — mirrors ADMISSION_STATUSES on the backend.
export const ADMISSION_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "documents_verified", label: "Documents Verified" },
  { key: "approved", label: "Approved" },
];

export const STATUS_LABEL = {
  submitted: "Submitted",
  under_review: "Under Review",
  documents_verified: "Documents Verified",
  approved: "Approved",
  rejected: "Rejected",
};

export const stepIndex = (status) =>
  ADMISSION_STEPS.findIndex((s) => s.key === status);
