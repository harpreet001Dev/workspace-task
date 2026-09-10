import express from "express";
import {register,login } from "../controllers/auth.contoller.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validatioins/auth.validation.js";

import { authRateLimiter } from "../middleware/rateLimit.middleware.js";


const router = express.Router();

router.use(authRateLimiter);

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);


export default router;