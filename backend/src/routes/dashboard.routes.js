import express from "express";
import authtenticateUser from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";


const router = express.Router();

router.get(
  "/",
  authtenticateUser,
  getDashboard,
);

export default router;