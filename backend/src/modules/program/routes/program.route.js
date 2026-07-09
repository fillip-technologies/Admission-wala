import express from "express";
import { verifyJWT } from "../../../common/middlewares/verifyAuth.js";
import {
  createProgram,
  deleteProgram,
  getActivePrograms,
  getAllPrograms,
  updateProgram,
} from "../controllers/program.controller.js";

const programRouter = express.Router();

// Public
programRouter.get("/", getActivePrograms);

// Admin
programRouter.get("/all", verifyJWT, getAllPrograms);
programRouter.post("/", verifyJWT, createProgram);
programRouter.patch("/:id", verifyJWT, updateProgram);
programRouter.delete("/:id", verifyJWT, deleteProgram);

export { programRouter };
