import express from "express";
import { verifyJWT } from "../../../common/middlewares/verifyAuth.js";
import {
  createSlide,
  deleteSlide,
  getActiveSlides,
  getAllSlides,
  updateSlide,
} from "../controllers/promo.controller.js";

const promoRouter = express.Router();

// Public
promoRouter.get("/", getActiveSlides);

// Admin
promoRouter.get("/all", verifyJWT, getAllSlides);
promoRouter.post("/", verifyJWT, createSlide);
promoRouter.patch("/:id", verifyJWT, updateSlide);
promoRouter.delete("/:id", verifyJWT, deleteSlide);

export { promoRouter };
