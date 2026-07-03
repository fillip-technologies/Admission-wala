import express from 'express';
import { getAllStudents } from '../../auth/controllers/auth.controller.js';
import { verifyJWT } from '../../../common/middlewares/verifyAuth.js';
import { getEnquiry } from '../../enquiry/controller/enquiry.controller.js';
import { createCounsellers, getAllCounsellers } from '../controllers/admin.controllers.js';
import { getReports } from '../controllers/report.controller.js';

const adminRouter = express.Router();


adminRouter.get("/getstudents", verifyJWT, getAllStudents);
adminRouter.get('/fetchenquiry', verifyJWT ,getEnquiry);
adminRouter.post("/createcounseller", verifyJWT, createCounsellers);
adminRouter.get("/getallcounsellers", verifyJWT, getAllCounsellers)
adminRouter.get("/reports", verifyJWT, getReports)

export {adminRouter};
