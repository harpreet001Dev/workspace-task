import express from "express";
import {register,login,refresh, logout} from "../controllers/auth.contoller.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validatioins/auth.validation.js";
import authtenticateUser from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";


const router = express.Router();

router.use(authRateLimiter);

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);


export default router;