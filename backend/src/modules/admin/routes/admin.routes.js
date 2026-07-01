import express from 'express';
import { getAllStudents } from '../../auth/controllers/auth.controller.js';
import { verifyJWT } from '../../../common/middlewares/verifyAuth.js';

const adminRouter = express.Router();


adminRouter.get("/getstudents", verifyJWT, getAllStudents);


export {adminRouter};