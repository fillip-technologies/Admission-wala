import express from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/routes/auth.route.js";
import morgan from 'morgan'
import cookieParser from "cookie-parser";
import { enquiryRouter } from "./modules/enquiry/routes/enquiry.route.js";
import { adminRouter } from "./modules/admin/routes/admin.routes.js";
import { admissionRouter } from "./modules/admission/routes/admission.route.js";
import { counsellingRouter } from "./modules/counseller/routes/counselling.route.js";
import { ticketRouter } from "./modules/ticket/routes/ticket.route.js";
import { announcementRouter } from "./modules/announcement/routes/announcement.route.js";
import { promoRouter } from "./modules/promo/routes/promo.route.js";
import { programRouter } from "./modules/program/routes/program.route.js";
import { errorHandler } from "./common/middlewares/errorHandler.js";

const app = express();


// Always-allowed origins (prod frontend + local dev), plus any extra ones from
// CLIENT_URL (comma-separated). Merging avoids a CLIENT_URL value accidentally
// dropping the production or localhost origin.
const DEFAULT_ORIGINS = [
  "https://shreeadmissiongurukul.com",
  "https://www.shreeadmissiongurukul.com",
  "https://shreeadmissiongurukul.fillipsoftware.com",
  "http://localhost:5173",
];
const allowedOrigins = [
  ...DEFAULT_ORIGINS,
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
];

app.use(cors({
  origin: (origin, cb) => {
    // allow same-origin / non-browser requests (no Origin header) and any
    // whitelisted origin; block everything else.
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running 🚀",
    });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/enquiry', enquiryRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/admission', admissionRouter);
app.use('/api/v1/counselling', counsellingRouter);
app.use('/api/v1/tickets', ticketRouter);
app.use('/api/v1/announcements', announcementRouter);
app.use('/api/v1/promos', promoRouter);
app.use('/api/v1/programs', programRouter);

app.use(errorHandler);

export default app;