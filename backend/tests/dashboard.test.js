import { jest } from "@jest/globals";

const getDashboard = jest.fn();
const getRecentActivities = jest.fn();

jest.unstable_mockModule("../src/service/dashboard.service.js", () => ({
  default: {
    getDashboard,
    getRecentActivities,
  },
}));

const {
  getDashboard: getDashboardController,
  getRecentActivities: getRecentActivitiesController,
} = await import("../src/controllers/dashboard.controller.js");

describe("Dashboard Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  it("should get dashboard", async () => {
    const req = {
      user: {
        _id: "user123",
        workspaceId: "workspace123",
      },
    };

    const res = createResponse();

    getDashboard.mockResolvedValue({
      totalTasks: 10,
      completedTasks: 5,
    });

    await getDashboardController(req, res);

    expect(getDashboard).toHaveBeenCalledWith(
      "user123",
      "workspace123"
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should get recent activities", async () => {
    const req = {
      user: {
        _id: "user123",
        workspaceId: "workspace123",
      },
    };

    const res = createResponse();

    getRecentActivities.mockResolvedValue([
      {
        action: "TASK_CREATED",
      },
    ]);

    await getRecentActivitiesController(req, res);

    expect(getRecentActivities).toHaveBeenCalledWith(
      "user123",
      "workspace123"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});