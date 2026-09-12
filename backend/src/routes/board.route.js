import express from "express";
import validate from "../middleware/validate.middleware.js";
import authtenticateUser from "../middleware/auth.middleware.js";
import {
    createBoardSchema,
    createColumnSchema,
    addBoardMemberSchema,
    getBoardsQuerySchema,
    updateBoardSchema,
} from "../validatioins/board.validation.js";
import authorizeRole from "../middleware/role.middleware.js";
import {
    createBoard,
    createColumn,
    addBoardMember,
    getBoards,
    getBoard,
    updateBoard,
} from "../controllers/board.controller.js";


const router = express.Router();

router.post(
    "/:workspaceId",
    authtenticateUser,
    authorizeRole("owner", "member"),
    validate(createBoardSchema),
    createBoard
);

router.post(
    "/:boardId/members",
    authtenticateUser,
    authorizeRole("owner", "member"),
    validate(addBoardMemberSchema),
    addBoardMember
);

router.post(
    "/:boardId/columns",
    authtenticateUser,
    authorizeRole("owner", "member"),
    validate(createColumnSchema),
    createColumn
);

router.get(
    "/",
    authtenticateUser,
    validate(getBoardsQuerySchema),
    getBoards
)

router.get(
    "/:boardId",
    authtenticateUser,
    authorizeRole("owner", "member"),
    getBoard
)

router.patch(
    "/:boardId",
    authtenticateUser,
    authorizeRole("owner", "member"),
    validate(updateBoardSchema),
    updateBoard
)

export default router;