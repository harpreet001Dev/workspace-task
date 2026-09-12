import { jest } from "@jest/globals";

const createBoard = jest.fn();
const addBoardMember = jest.fn();
const getUserBoards = jest.fn();
const getBoardDetails = jest.fn();
const updateBoard = jest.fn();
const deleteBoard = jest.fn();

const createColumn = jest.fn();

jest.unstable_mockModule("../src/service/board.service.js", () => ({
  default: {
    createBoard,
    addBoardMember,
    getUserBoards,
    getBoardDetails,
    updateBoard,
    deleteBoard,
  },
}));

jest.unstable_mockModule("../src/service/column.service.js", () => ({
  default: {
    createColumn,
  },
}));

const {
  createBoard: createBoardController,
  createColumn: createColumnController,
  addBoardMember: addBoardMemberController,
  getBoards: getBoardsController,
  getBoard: getBoardController,
  updateBoard: updateBoardController,
  deleteBoard: deleteBoardController,
} = await import("../src/controllers/board.controller.js");

describe("Board Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  it("should create board", async () => {
    const req = {
      params: { workspaceId: "workspace123" },
      user: { _id: "user123" },
      body: { name: "Test Board" },
    };

    const res = createResponse();

    createBoard.mockResolvedValue({
      _id: "board123",
      name: "Test Board",
    });

    await createBoardController(req, res);

    expect(createBoard).toHaveBeenCalledWith(
      "workspace123",
      "user123",
      req.body
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should create column", async () => {
    const req = {
      params: { boardId: "board123" },
      body: { name: "Todo" },
    };

    const res = createResponse();

    createColumn.mockResolvedValue({
      _id: "column123",
      name: "Todo",
    });

    await createColumnController(req, res);

    expect(createColumn).toHaveBeenCalledWith(
      "board123",
      req.body
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should add board member", async () => {
    const req = {
      params: { boardId: "board123" },
      user: { _id: "user123" },
      body: { userId: "user456" },
    };

    const res = createResponse();

    addBoardMember.mockResolvedValue({
      boardId: "board123",
      userId: "user456",
    });

    await addBoardMemberController(req, res);

    expect(addBoardMember).toHaveBeenCalledWith(
      "board123",
      "user123",
      "user456"
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should get boards", async () => {
    const req = {
      user: {
        _id: "user123",
        workspaceId: "workspace123",
      },
      query: {
        page: 1,
      },
    };

    const res = createResponse();

    getUserBoards.mockResolvedValue([
      { _id: "board123", name: "Test Board" },
    ]);

    await getBoardsController(req, res);

    expect(getUserBoards).toHaveBeenCalledWith(
      "user123",
      "workspace123",
      req.query
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should get board", async () => {
    const req = {
      params: { boardId: "board123" },
      user: { _id: "user123" },
    };

    const res = createResponse();

    getBoardDetails.mockResolvedValue({
      _id: "board123",
      name: "Test Board",
    });

    await getBoardController(req, res);

    expect(getBoardDetails).toHaveBeenCalledWith(
      "board123",
      "user123"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should update board", async () => {
    const req = {
      params: { boardId: "board123" },
      user: { _id: "user123" },
      body: { name: "Updated Board" },
    };

    const res = createResponse();

    updateBoard.mockResolvedValue({
      _id: "board123",
      name: "Updated Board",
    });

    await updateBoardController(req, res);

    expect(updateBoard).toHaveBeenCalledWith(
      "board123",
      "user123",
      req.body
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should delete board", async () => {
    const req = {
      params: { boardId: "board123" },
      user: { _id: "user123" },
    };

    const res = createResponse();

    deleteBoard.mockResolvedValue({
      _id: "board123",
    });

    await deleteBoardController(req, res);

    expect(deleteBoard).toHaveBeenCalledWith(
      "board123",
      "user123"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});