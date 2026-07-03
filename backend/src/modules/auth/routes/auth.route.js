import express from 'express';

const authRouter=express.Router();

import { forgotPassword, getAllStudents, getMe, loginUser, logOut, registerUser, resendOtp, resetPassword, verifyEmail } from '../controllers/auth.controller.js';
import { verifyJWT } from '../../../common/middlewares/verifyAuth.js';

authRouter.post('/register', registerUser);

authRouter.post('/login', loginUser);

authRouter.post('/verify-email', verifyEmail);

authRouter.post('/resend-otp', resendOtp);

authRouter.post('/forgot-password', forgotPassword);

authRouter.post('/reset-password', resetPassword);

authRouter.get("/me", verifyJWT, getMe);

authRouter.post("/logout", verifyJWT, logOut);




export {authRouter}