import express from "express";
import validate from "../middleware/validate.middleware.js";
import authtenticateUser from "../middleware/auth.middleware.js";
import { createBoardSchema , createColumnSchema} from "../validatioins/board.validation.js";
import authorizeRole from "../middleware/role.middleware.js";
import { createBoard ,createColumn} from "../controllers/board.controller.js";


const router = express.Router();

router.post(
    "/:workspaceId",
    authtenticateUser,
    authorizeRole("owner", "member"),
    validate(createBoardSchema),
    createBoard
);
router.post(
    "/:boardId/columns",
    authtenticateUser,
    authorizeRole("owner", "member"),
    validate(createColumnSchema),
    createColumn
);
export default router;