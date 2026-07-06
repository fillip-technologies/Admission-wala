import express from "express";
import { verifyJWT } from "../../../common/middlewares/verifyAuth.js";
import {
  addMessage,
  createTicket,
  getMyTickets,
  getTicket,
  listTickets,
  updateTicketStatus,
} from "../controllers/ticket.controller.js";

const ticketRouter = express.Router();

ticketRouter.post("/", verifyJWT, createTicket);
ticketRouter.get("/me", verifyJWT, getMyTickets);
ticketRouter.get("/", verifyJWT, listTickets);
ticketRouter.get("/:id", verifyJWT, getTicket);
ticketRouter.post("/:id/messages", verifyJWT, addMessage);
ticketRouter.patch("/:id/status", verifyJWT, updateTicketStatus);

export { ticketRouter };
