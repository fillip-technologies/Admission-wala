import express from 'express';

const authRouter=express.Router();

import { getAllStudents, getMe, loginUser, logOut, registerUser } from '../controllers/auth.controller.js';
import { verifyJWT } from '../../../common/middlewares/verifyAuth.js';

authRouter.post('/register', registerUser);

authRouter.post('/login', loginUser);

authRouter.get("/me", verifyJWT, getMe);

authRouter.post("/logout", verifyJWT, logOut);



export {authRouter}