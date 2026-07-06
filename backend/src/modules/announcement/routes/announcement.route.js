import express from "express";
import { verifyJWT } from "../../../common/middlewares/verifyAuth.js";
import {
  createAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller.js";

const announcementRouter = express.Router();

// Public
announcementRouter.get("/", getActiveAnnouncements);

// Admin
announcementRouter.get("/all", verifyJWT, getAllAnnouncements);
announcementRouter.post("/", verifyJWT, createAnnouncement);
announcementRouter.patch("/:id", verifyJWT, updateAnnouncement);
announcementRouter.delete("/:id", verifyJWT, deleteAnnouncement);

export { announcementRouter };
