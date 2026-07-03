import express from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/routes/auth.route.js";
import morgan from 'morgan'
import cookieParser from "cookie-parser";
import { enquiryRouter } from "./modules/enquiry/routes/enquiry.route.js";
import { adminRouter } from "./modules/admin/routes/admin.routes.js";
import { admissionRouter } from "./modules/admission/routes/admission.route.js";
import { errorHandler } from "./common/middlewares/errorHandler.js";

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",  // your Vite dev URL
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

app.use(errorHandler);

export default app;