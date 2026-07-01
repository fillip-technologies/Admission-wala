import express from 'express';
import { getAllStudents } from '../../auth/controllers/auth.controller.js';
import { verifyJWT } from '../../../common/middlewares/verifyAuth.js';
import { getEnquiry } from '../../enquiry/controller/enquiry.controller.js';

const adminRouter = express.Router();


adminRouter.get("/getstudents", verifyJWT, getAllStudents);
adminRouter.get('/fetchenquiry', verifyJWT ,getEnquiry);

export {adminRouter};