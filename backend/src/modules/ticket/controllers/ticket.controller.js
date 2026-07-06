import STATUS_CODES from "../../../common/constants/statusCode.js";
import { ApiError } from "../../../utils/apiError.js";
import { ApiResponse } from "../../../utils/apiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../auth/models/auth.model.js";
import { Ticket, TICKET_STATUSES } from "../models/ticket.model.js";

const isStaff = (role) => role === "admin" || role === "counseller";

// Populate helper — keeps list/detail responses consistent.
const populateTicket = (query) =>
  query
    .populate("student", "name email mobile_number")
    .populate("counseller", "name email")
    .populate("admission", "board customBoard program classType status")
    .populate("messages.sender", "name role");

// Student: open a new ticket (optionally about a specific admission), with an
// optional first message.
export const createTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Not authorized");

  const { subject, admission, message } = req.body;
  if (typeof subject !== "string" || subject.trim() === "")
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Please enter a subject");

  const messages = [];
  if (typeof message === "string" && message.trim() !== "") {
    messages.push({
      sender: user._id,
      senderRole: user.role,
      body: message.trim(),
    });
  }

  const ticket = await Ticket.create({
    student: user._id,
    admission: admission || undefined,
    subject: subject.trim(),
    messages,
  });

  const populated = await populateTicket(Ticket.findById(ticket._id));
  res
    .status(STATUS_CODES.CREATED)
    .json(new ApiResponse(STATUS_CODES.CREATED, "Ticket created", populated));
});

// Student: list own tickets.
export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await populateTicket(
    Ticket.find({ student: req.user }).sort({ updatedAt: -1 }),
  );
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", tickets));
});

// Staff: list all tickets. ?status=open|closed to filter.
export const listTickets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user || !isStaff(user.role))
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");

  const filter = {};
  if (TICKET_STATUSES.includes(req.query.status))
    filter.status = req.query.status;

  const tickets = await populateTicket(
    Ticket.find(filter).sort({ updatedAt: -1 }),
  );
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", tickets));
});

// Student owner or staff: fetch one ticket with its full thread.
export const getTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Not authorized");

  const ticket = await populateTicket(Ticket.findById(req.params.id));
  if (!ticket) throw new ApiError(STATUS_CODES.NOT_FOUND, "Ticket not found");

  const ownsIt = ticket.student?._id?.toString() === user._id.toString();
  if (!ownsIt && !isStaff(user.role))
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");

  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "", ticket));
});

// Student owner or staff: post a message. Counsellors may attach a resource.
export const addMessage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Not authorized");

  const { body, resourceUrl, resourceLabel } = req.body;
  const hasBody = typeof body === "string" && body.trim() !== "";
  const hasResource = typeof resourceUrl === "string" && resourceUrl.trim() !== "";
  if (!hasBody && !hasResource)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Message cannot be empty");

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(STATUS_CODES.NOT_FOUND, "Ticket not found");

  const staff = isStaff(user.role);
  const ownsIt = ticket.student.toString() === user._id.toString();
  if (!ownsIt && !staff)
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");
  if (ticket.status === "closed")
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "This ticket is closed");

  // First counsellor reply takes ownership of the ticket.
  if (staff && user.role === "counseller" && !ticket.counseller)
    ticket.counseller = user._id;

  ticket.messages.push({
    sender: user._id,
    senderRole: user.role,
    body: hasBody ? body.trim() : undefined,
    // Only staff may attach resources.
    resourceUrl: staff && hasResource ? resourceUrl.trim() : undefined,
    resourceLabel: staff && hasResource ? (resourceLabel || "Resource").trim() : undefined,
  });
  await ticket.save();

  const populated = await populateTicket(Ticket.findById(ticket._id));
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "Message sent", populated));
});

// Staff: open/close a ticket.
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user || !isStaff(user.role))
    throw new ApiError(STATUS_CODES.FORBIDDEN, "Unauthorized");

  const { status } = req.body;
  if (!TICKET_STATUSES.includes(status))
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid status");

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(STATUS_CODES.NOT_FOUND, "Ticket not found");

  ticket.status = status;
  await ticket.save();

  const populated = await populateTicket(Ticket.findById(ticket._id));
  res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, "Ticket updated", populated));
});
