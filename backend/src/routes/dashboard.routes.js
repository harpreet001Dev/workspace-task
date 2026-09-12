import express from "express";
import authtenticateUser from "../middleware/auth.middleware.js";
import { getDashboard, getRecentActivities,getProfile } from "../controllers/dashboard.controller.js";


const router = express.Router();

router.get(
  "/",
  authtenticateUser,
  getDashboard,
);

router.get(
  "/recent-activity",
  authtenticateUser,
  getRecentActivities,
);

router.get(
  "/profile",
  authtenticateUser,
  getProfile,
);
export default router;