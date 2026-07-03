import express from "express";
import { verifyJWT } from "../../../common/middlewares/verifyAuth.js";
import {
  addCounsellingNote,
  claimCounselling,
  getMyCounselling,
  listCounselling,
  requestCounselling,
  updateCounsellingStatus,
} from "../controllers/counseller.controllers.js";

const counsellingRouter = express.Router();

counsellingRouter.post("/request", verifyJWT, requestCounselling);
counsellingRouter.get("/me", verifyJWT, getMyCounselling);
counsellingRouter.get("/", verifyJWT, listCounselling);
counsellingRouter.patch("/:id/claim", verifyJWT, claimCounselling);
counsellingRouter.patch("/:id/status", verifyJWT, updateCounsellingStatus);
counsellingRouter.post("/:id/notes", verifyJWT, addCounsellingNote);

export { counsellingRouter };
