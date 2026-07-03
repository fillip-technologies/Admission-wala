import express from "express";
import { verifyJWT } from "../../../common/middlewares/verifyAuth.js";
import { upload } from "../../../common/middlewares/upload.middleware.js";
import {
  createAdmission,
  getAllAdmissions,
  getMyAdmission,
  updateAdmissionStatus,
} from "../controllers/admission.controller.js";

const admissionRouter = express.Router();

admissionRouter.post("/", verifyJWT, upload.array("documents", 5), createAdmission);
admissionRouter.get("/me", verifyJWT, getMyAdmission);
admissionRouter.get("/", verifyJWT, getAllAdmissions);
admissionRouter.patch("/:id/status", verifyJWT, updateAdmissionStatus);

export { admissionRouter };
