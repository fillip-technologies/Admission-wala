import express from 'express'
import { getEnquiry, sendEnquiry } from '../controller/enquiry.controller.js';
import { verifyJWT } from '../../../common/middlewares/verifyAuth.js';

const enquiryRouter = express.Router();


enquiryRouter.post('/sendenquiry',verifyJWT, sendEnquiry);

enquiryRouter.get('/fetchenquiry', verifyJWT ,getEnquiry);

export {enquiryRouter};