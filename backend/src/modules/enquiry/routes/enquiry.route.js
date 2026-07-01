import express from 'express'
import { sendEnquiry } from '../controller/enquiry.controller.js';
import { optionalAuth } from '../../../common/middlewares/optionAuth.js';

const enquiryRouter = express.Router();


enquiryRouter.post('/sendenquiry',optionalAuth, sendEnquiry);



export {enquiryRouter};