import express from "express";
import {register } from "../controllers/auth.contoller.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema } from "../validatioins/auth.validation.js";

import { authRateLimiter } from "../middleware/rateLimit.middleware.js";


const router = express();

router.use(authRateLimiter);

router.post('/register', validate(registerSchema), register);


export default router;