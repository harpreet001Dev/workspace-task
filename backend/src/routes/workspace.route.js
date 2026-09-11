import express from "express";
import validate from "../middleware/validate.middleware.js";
import authtenticateUser from "../middleware/auth.middleware.js";
import { createWorkspaceSchema } from "../validatioins/workspace.validation.js";
import { createWorkspace ,createInvite, acceptInvite} from "../controllers/workspace.controller.js";
import authorizeRole from "../middleware/role.middleware.js";


const router = express.Router();

router.post('/create', authtenticateUser,validate(createWorkspaceSchema), createWorkspace);

router.post(
    "/invite",
    authtenticateUser,
    authorizeRole("owner"),
    createInvite
);

router.post("/invite/:token/accept",authtenticateUser,acceptInvite)
export default router;