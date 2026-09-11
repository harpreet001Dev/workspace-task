import { useSelector } from "react-redux";
import api from "../api/api";
import { useState, useEffect } from "react";

const accentClasses = [
  "bg-gradient-to-br from-indigo-500 to-violet-500",
  "bg-gradient-to-br from-emerald-500 to-teal-500",
  "bg-gradient-to-br from-pink-500 to-rose-500",
  "bg-gradient-to-br from-sky-500 to-cyan-500",
  "bg-gradient-to-br from-amber-500 to-orange-500",
  "bg-gradient-to-br from-fuchsia-500 to-purple-500",
];

const columnDotClasses = {
  "To do": "bg-indigo-500",
  "In progress": "bg-blue-500",
  Review: "bg-amber-500",
  Done: "bg-emerald-500",
};

const ProjectCard = ({ board, onOpenBoard }) => {
  const short = board?.name?.charAt(0)?.toUpperCase() || "B";
  const accentClass = accentClasses[Math.abs(board?._id?.length || 0) % accentClasses.length];

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#112235] p-4 shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentClass}`}>
            <span className="text-2xl font-semibold text-white">{short}</span>
          </div>

          <div>
            <div className="text-2xl font-semibold text-white">{board.name}</div>
            <div className="text-sm text-slate-400">
              {board?.createdAt
                ? `Created ${new Date(board.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`
                : "Created recently"}
            </div>
          </div>
        </div>

        <button className="text-xl text-slate-400">⋮</button>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-base">◉</span>
          <span>{board.totalMembers || 0} members</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base">☰</span>
          <span>{board.columns?.length || 0} columns</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
          Members
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex -space-x-2">
            {(board.members || []).slice(0, 4).map((member) => (
              <div
                key={`${board._id}-member-${member._id}`}
                title={member.name}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#112235] bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-bold text-white"
              >
                {member.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            ))}
          </div>

          {(board.members || []).length > 4 && (
            <span className="rounded-full border border-slate-600 bg-slate-800/60 px-2 py-1 text-[10px] font-medium text-slate-300">
              +{(board.members || []).length - 4}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(board.columns || []).map((column) => (
          <span
            key={`${board._id}-${column._id}`}
            className="rounded-full border border-slate-600 bg-slate-800/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-200"
          >
            {column.name}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onOpenBoard(board)}
        className="mt-5 w-full rounded-xl border border-slate-600/80 bg-slate-800/50 px-4 py-3 text-base font-medium text-white transition hover:bg-slate-700/70"
      >
        Open Board →
      </button>
    </div>
  );
};

const BoardDetailView = ({ board, workspace, onBack }) => {
  const user = useSelector((state) => state.auth.user);
  const [boardTasks, setBoardTasks] = useState({});
  const [boardMembers, setBoardMembers] = useState(board.members || []);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("board");
  const [taskMenuOpenId, setTaskMenuOpenId] = useState(null);
  const [taskLoading, setTaskLoading] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberAddingId, setMemberAddingId] = useState(null);
  const [memberError, setMemberError] = useState("");
  const [taskModal, setTaskModal] = useState({
    open: false,
    mode: "create",
    columnId: "",
    task: null,
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    columnId: "",
    assignedTo: "",
  });
  const [taskFiles, setTaskFiles] = useState([]);
  const [taskError, setTaskError] = useState("");
  const [taskSubmitting, setTaskSubmitting] = useState(false);

  const normalizeTask = (task) => {
    const priority = task.priority || "medium";
    const normalizedPriority = priority.toLowerCase();
    const assignedUser = task.assignedTo && typeof task.assignedTo === "object"
      ? task.assignedTo
      : { _id: task.assignedTo, name: "Unassigned" };
    const assigneeName = assignedUser.name || "Unassigned";
    const assigneeInitials = assigneeName
      .split(" ")
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

    const attachments = Array.isArray(task.attachments)
      ? task.attachments.map((attachment) => ({
          ...attachment,
          url: attachment.path || attachment.url || "",
          name: attachment.originalName || attachment.fileName || "Attachment",
        }))
      : [];

    return {
      ...task,
      _id: task._id,
      boardId: board._id,
      columnId: task.columnId?._id || task.columnId,
      priority: normalizedPriority,
      attachments,
      label:
        normalizedPriority === "high"
          ? "High"
          : normalizedPriority === "low"
            ? "Low"
            : "Medium",
      labelClass:
        normalizedPriority === "high"
          ? "bg-pink-100 text-pink-700"
          : normalizedPriority === "low"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700",
      priorityClass:
        normalizedPriority === "high"
          ? "bg-pink-100 text-pink-700"
          : normalizedPriority === "low"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700",
      due: task.createdAt
        ? new Date(task.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Today",
      assignee: assigneeName,
      assigneeInitials,
      assigneeColor: "bg-indigo-500",
      assignedToId: assignedUser._id || null,
      isMyTask: user?._id ? String(assignedUser._id || "") === String(user._id) : false,
    };
  };

  const loadBoardTasks = async () => {
    if (!board?._id) {
      setBoardTasks({});
      return;
    }

    try {
      setTaskLoading(true);
      const response = await api.GetTasks(board._id);

      if (response.success) {
        const nextTasks = {};

        (board.columns || []).forEach((column) => {
          nextTasks[column._id] = [];
        });

        (response.data || []).forEach((task) => {
          const columnId = task.columnId?._id || task.columnId;

          if (!nextTasks[columnId]) {
            nextTasks[columnId] = [];
          }

          nextTasks[columnId].push(normalizeTask(task));
        });

        setBoardTasks(nextTasks);
      }
    } catch (error) {
      console.log(error, "Unable to fetch board tasks.");
      setBoardTasks({});
    } finally {
      setTaskLoading(false);
    }
  };

  useEffect(() => {
    setBoardMembers(board.members || []);
    setBoardTasks({});
    setTaskMenuOpenId(null);
    loadBoardTasks();
  }, [board]);

  useEffect(() => {
    const loadWorkspaceUsers = async () => {
      try {
        const response = await api.GetWorkspaceUsers();

        if (response.success) {
          setWorkspaceUsers(response.data || []);
        }
      } catch (error) {
        console.log(error, "Unable to fetch workspace users.");
      }
    };

    loadWorkspaceUsers();
  }, []);

  const boardColumns = (board.columns || []).map((column) => ({
    ...column,
    tasks: boardTasks[column._id] || [],
  }));

  const closeTaskModal = () => {
    setTaskModal({
      open: false,
      mode: "create",
      columnId: "",
      task: null,
    });
    setTaskForm({
      title: "",
      description: "",
      priority: "medium",
      columnId: "",
      assignedTo: user?._id || "",
    });
    setTaskFiles([]);
    setTaskError("");
    setTaskSubmitting(false);
  };

  const openCreateTaskModal = (columnId) => {
    const preferredAssignee =
      boardMembers.find((member) => String(member._id) === String(user?._id))?._id ||
      boardMembers[0]?._id ||
      user?._id ||
      "";

    setTaskModal({
      open: true,
      mode: "create",
      columnId,
      task: null,
    });
    setTaskForm({
      title: "",
      description: "",
      priority: "medium",
      columnId,
      assignedTo: preferredAssignee,
    });
    setTaskFiles([]);
    setTaskError("");
  };

  const openEditTaskModal = (task) => {
    setTaskModal({
      open: true,
      mode: "edit",
      columnId: task.columnId,
      task,
    });
    setTaskForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      columnId: task.columnId,
      assignedTo: task.assignedTo || user?._id || "",
    });
    setTaskFiles([]);
    setTaskError("");
    setTaskMenuOpenId(null);
  };

  const openViewTaskModal = (task) => {
    setTaskModal({
      open: true,
      mode: "view",
      columnId: task.columnId,
      task,
    });
    setTaskError("");
    setTaskMenuOpenId(null);
  };

  const handleDeleteTask = (taskId) => {
    setBoardTasks((prev) => {
      const next = { ...prev };

      Object.keys(next).forEach((columnId) => {
        next[columnId] = (next[columnId] || []).filter((task) => task._id !== taskId);
      });

      return next;
    });

    setTaskMenuOpenId(null);
  };

  const handleAddBoardMember = async (userId) => {
    if (!board?._id || !userId) {
      return;
    }

    try {
      setMemberAddingId(userId);
      setMemberError("");

      const response = await api.AddBoardMember(board._id, { userId });

      if (response.success) {
        const matchedUser = workspaceUsers.find((member) => String(member._id) === String(userId));

        setBoardMembers((prev) => {
          if (prev.some((member) => String(member._id) === String(userId))) {
            return prev;
          }

          return [
            ...prev,
            {
              _id: matchedUser?._id || userId,
              name: matchedUser?.name || "User",
              email: matchedUser?.email || "",
              role: "member",
            },
          ];
        });

        setMemberModalOpen(false);
        setMemberSearch("");
      }
    } catch (error) {
      setMemberError(error.message || "Unable to add member right now.");
    } finally {
      setMemberAddingId(null);
    }
  };

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target;

    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaskFilesChange = (event) => {
    setTaskFiles(Array.from(event.target.files || []));
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();

    if (!taskForm.title.trim()) {
      setTaskError("Please enter a task title.");
      return;
    }

    if (!taskForm.columnId) {
      setTaskError("Please select a column.");
      return;
    }

    try {
      setTaskSubmitting(true);
      setTaskError("");

      if (taskModal.mode === "edit" && taskModal.task) {
        setBoardTasks((prev) => {
          const next = { ...prev };

          next[taskModal.task.columnId] = (next[taskModal.task.columnId] || []).map((task) =>
            task._id === taskModal.task._id
              ? {
                  ...task,
                  title: taskForm.title.trim(),
                  description: taskForm.description.trim(),
                  priority: taskForm.priority,
                  columnId: taskForm.columnId,
                  assignedTo: taskForm.assignedTo,
                  label: taskForm.priority === "high" ? "High" : taskForm.priority === "low" ? "Low" : "Medium",
                }
              : task
          );

          if (taskForm.columnId !== taskModal.task.columnId) {
            const currentTasks = (next[taskModal.task.columnId] || []).filter(
              (task) => task._id !== taskModal.task._id
            );
            next[taskModal.task.columnId] = currentTasks;

            const movedTask = {
              ...taskModal.task,
              title: taskForm.title.trim(),
              description: taskForm.description.trim(),
              priority: taskForm.priority,
              columnId: taskForm.columnId,
              assignedTo: taskForm.assignedTo,
              label: taskForm.priority === "high" ? "High" : taskForm.priority === "low" ? "Low" : "Medium",
            };

            next[taskForm.columnId] = [...(next[taskForm.columnId] || []), movedTask];
          }

          return next;
        });

        closeTaskModal();
        return;
      }

      const formData = new FormData();
      formData.append("title", taskForm.title.trim());
      formData.append("description", taskForm.description.trim());
      formData.append("columnId", taskForm.columnId);
      formData.append("priority", taskForm.priority);
      formData.append("order", String((boardTasks[taskForm.columnId]?.length || 0) + 1));
      formData.append("assignedTo", taskForm.assignedTo || user?._id || "");

      taskFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.CreateTask(board._id, formData);

      if (response.success) {
        await loadBoardTasks();
        closeTaskModal();
      }
    } catch (error) {
      setTaskError(error.message || "Unable to create task right now.");
    } finally {
      setTaskSubmitting(false);
    }
  };

  const taskMenuTask = (boardColumns.flatMap((column) => column.tasks)).find(
    (task) => task._id === taskMenuOpenId
  );

  const availableWorkspaceUsers = workspaceUsers.filter(
    (member) => !boardMembers.some((boardMember) => String(boardMember._id) === String(member._id))
  );

  const canManageMembers = String(board.createdBy) === String(user?._id);

  return (
    <main className="flex-1 p-4 lg:p-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-slate-700/80 bg-slate-800/50 px-2 py-1 text-slate-200 transition hover:bg-slate-700/60"
          >
            ← Back
          </button>
          <span>{workspace?.name || "Acme Workspace"}</span>
          <span>›</span>
          <span>Boards</span>
          <span>›</span>
          <span className="text-slate-200">{board.name}</span>
        </div>

        <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.65)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-semibold text-white">
              {board.name?.charAt(0)?.toUpperCase() || "B"}
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-indigo-300">Workspace</div>
              <div className="text-3xl font-bold text-white">{board.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0f1d2d] text-xs font-semibold text-white ${accentClasses[index % accentClasses.length].replace(
                    "bg-gradient-to-br",
                    "bg"
                  )}`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
              ))}
            </div>

            {canManageMembers && (
              <button
                type="button"
                onClick={() => setMemberModalOpen(true)}
                className="rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60"
              >
                + Add Members
              </button>
            )}
            <button
              type="button"
              className="rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60"
            >
              Share
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/60 text-xl text-slate-200"
            >
              ⋯
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-3 shadow-[0_20px_50px_rgba(15,23,42,0.65)] xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Board", key: "board" },
              { label: `Members (${boardMembers.length})`, key: "members" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "border border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                    : "border border-slate-700/80 bg-slate-800/50 text-slate-300 hover:bg-slate-700/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200"
            >
              Filters
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200"
            >
              Group by: None
            </button>
            <button
              type="button"
              onClick={() => openCreateTaskModal(board.columns?.[0]?._id || "")}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110"
            >
              + Add Task
            </button>
          </div>
        </div>

        {activeTab === "members" ? (
          <div className="rounded-2xl border border-slate-700/80 bg-[#112235] p-4 shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Project members</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Team</h3>
              </div>

              {canManageMembers && (
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(true)}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110"
                >
                  + Add Members
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {boardMembers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/40 p-4 text-sm text-slate-300">
                  No members added yet.
                </div>
              ) : (
                boardMembers.map((member) => (
                  <div
                    key={`${board._id}-member-card-${member._id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-900/40 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                        {member.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>

                      <div>
                        <div className="font-medium text-white">{member.name}</div>
                        <div className="text-sm text-slate-400">{member.email}</div>
                      </div>
                    </div>

                    <span className="rounded-full border border-slate-600 bg-slate-800/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-200">
                      {member.role || 'member'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-4">
            {boardColumns.map((column) => (
              <div
                key={`${board._id}-${column._id}`}
                className="rounded-2xl border border-slate-700/80 bg-[#cfe1ee] p-3 shadow-[0_20px_40px_rgba(15,23,42,0.25)]"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${columnDotClasses[column.name] || "bg-slate-500"}`} />
                    <span className="text-lg font-semibold text-slate-800">{column.name}</span>
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-semibold text-slate-700">
                      {column.tasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCreateTaskModal(column._id)}
                    className="text-xl font-medium text-slate-600 transition hover:text-slate-800"
                  >
                    +
                  </button>
                </div>

                <div className="space-y-3">
                  {taskLoading ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100/60 p-3 text-center text-sm text-slate-600">
                      Loading tasks...
                    </div>
                  ) : column.tasks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100/60 p-3 text-center text-sm text-slate-600">
                      No tasks yet
                    </div>
                  ) : column.tasks.map((task, index) => (
                    <div
                      key={`${column._id}-task-${task._id || index}`}
                      className={`relative rounded-xl border p-3 shadow-sm shadow-slate-400/20 ${
                        task.isMyTask
                          ? "border-indigo-400 bg-indigo-50/90 shadow-indigo-200/60"
                          : "border-slate-300 bg-[#f5f8fb]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setTaskMenuOpenId(taskMenuOpenId === task._id ? null : task._id)
                        }
                        className="absolute right-2 top-2 text-lg font-bold text-slate-500 transition hover:text-slate-700"
                      >
                        ⋯
                      </button>

                      {taskMenuOpenId === task._id && (
                        <div className="absolute right-2 top-9 z-30 w-32 rounded-xl border border-slate-700 bg-[#122235] p-2 shadow-lg">
                          <button
                            type="button"
                            onClick={() => openViewTaskModal(task)}
                            className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-slate-200 transition hover:bg-slate-700/60"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditTaskModal(task)}
                            className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-slate-200 transition hover:bg-slate-700/60"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task._id)}
                            className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-red-300 transition hover:bg-slate-700/60"
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      <div className="pr-6 text-base font-semibold text-slate-800">{task.title}</div>

                      {task.isMyTask && (
                        <div className="mt-2 inline-flex rounded-full border border-indigo-300 bg-indigo-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                          My task
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${task.labelClass || "bg-slate-100 text-slate-700"}`}>
                          {task.label || task.priority || "Medium"}
                        </span>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${task.priorityClass || "bg-amber-100 text-amber-700"}`}>
                          {task.priority || "Medium"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-slate-600">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f5f8fb] text-[10px] font-bold text-white ${task.assigneeColor || "bg-indigo-500"}`}>
                            {task.assigneeInitials || "U"}
                          </div>
                          <span className="font-medium text-slate-700">
                            {task.assignee || "Unassigned"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span>◫</span>
                          <span>{task.due || "Today"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => openCreateTaskModal(column._id)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-400 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <span className="text-lg">+</span>
                  Add Task
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {memberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Project Members</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Add team members</h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMemberModalOpen(false);
                  setMemberError("");
                  setMemberSearch("");
                }}
                className="text-2xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={memberSearch}
                onChange={(event) => setMemberSearch(event.target.value)}
                placeholder="Search workspace users"
                className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            {memberError && <p className="mb-4 text-sm text-red-400">{memberError}</p>}

            <div className="max-h-80 space-y-3 overflow-y-auto">
              {availableWorkspaceUsers.filter((user) =>
                `${user.name} ${user.email}`.toLowerCase().includes(memberSearch.toLowerCase())
              ).length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/40 p-4 text-center text-sm text-slate-300">
                  No available users to add.
                </div>
              ) : (
                availableWorkspaceUsers
                  .filter((user) =>
                    `${user.name} ${user.email}`.toLowerCase().includes(memberSearch.toLowerCase())
                  )
                  .map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-900/40 p-3"
                    >
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </div>

                      <button
                        type="button"
                        disabled={memberAddingId === user._id}
                        onClick={() => handleAddBoardMember(user._id)}
                        className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {memberAddingId === user._id ? "Adding..." : "Add"}
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {taskModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">
                  {taskModal.mode === "view" ? "Task Details" : taskModal.mode === "edit" ? "Edit Task" : "Add Task"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {taskModal.mode === "view"
                    ? taskModal.task?.title
                    : taskModal.mode === "edit"
                      ? "Update task"
                      : "Create task"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeTaskModal}
                className="text-2xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            {taskModal.mode === "view" ? (
              <div className="space-y-4 text-slate-300">
                <div>
                  <p className="text-sm text-slate-400">Title</p>
                  <p className="text-lg font-medium text-white">{taskModal.task?.title}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Description</p>
                  <p className="text-base text-slate-200">
                    {taskModal.task?.description || "No description added."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-400">Priority</p>
                    <p className="text-base text-white capitalize">{taskModal.task?.priority || "Medium"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Column</p>
                    <p className="text-base text-white">
                      {boardColumns.find((column) => column._id === taskModal.task?.columnId)?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Assigned To</p>
                  <p className="text-base text-white">
                    {taskModal.task?.assignee || "Unassigned"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Attachments</p>
                  {taskModal.task?.attachments?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {taskModal.task.attachments.map((attachment) => (
                        <a
                          key={attachment._id || attachment.fileName}
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-slate-600 bg-slate-800/60 px-2.5 py-1.5 text-sm text-indigo-200 transition hover:bg-slate-700/60"
                        >
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-slate-200">No attachments added.</p>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">Task Title</span>
                  <input
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleTaskFormChange}
                    placeholder="Write task title"
                    className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">Description</span>
                  <textarea
                    name="description"
                    value={taskForm.description}
                    onChange={handleTaskFormChange}
                    rows="3"
                    placeholder="Add task details"
                    className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Column</span>
                    <select
                      name="columnId"
                      value={taskForm.columnId}
                      onChange={handleTaskFormChange}
                      className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    >
                      <option value="">Select column</option>
                      {boardColumns.map((column) => (
                        <option key={column._id} value={column._id}>
                          {column.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Priority</span>
                    <select
                      name="priority"
                      value={taskForm.priority}
                      onChange={handleTaskFormChange}
                      className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">Assign To</span>
                  <select
                    name="assignedTo"
                    value={taskForm.assignedTo}
                    onChange={handleTaskFormChange}
                    className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    {boardMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">Attachments</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleTaskFilesChange}
                    className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
                  />
                  {taskFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {taskFiles.map((file) => (
                        <span
                          key={`${file.name}-${file.size}`}
                          className="rounded-full border border-slate-600 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-200"
                        >
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </label>

                {taskError && <p className="text-sm text-red-400">{taskError}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeTaskModal}
                    className="rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={taskSubmitting}
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {taskSubmitting
                      ? taskModal.mode === "edit"
                        ? "Updating..."
                        : "Creating..."
                      : taskModal.mode === "edit"
                        ? "Update Task"
                        : "Create Task"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

const Projects = () => {
  const user = useSelector((state) => state.auth.user);
  const workspace = useSelector((state) => state.auth.workspace);
  const [boards, setBoards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [createError, setCreateError] = useState("");
  const [selectedBoard, setSelectedBoard] = useState(null);

  const getBoards = async () => {
    try {
      const res = await api.Board();
      if (res.success) {
        setBoards(res?.data || []);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleCreateBoard = async (event) => {
    event.preventDefault();

    if (!projectName.trim()) {
      setCreateError("Please enter a project name.");
      return;
    }

    if (!workspace?._id) {
      setCreateError("Workspace is not available right now.");
      return;
    }

    try {
      setCreatingProject(true);
      setCreateError("");

      const response = await api.CreateBoard(workspace._id, {
        name: projectName.trim(),
      });

      if (response.success) {
        setProjectName("");
        setShowCreateModal(false);
        await getBoards();
        return;
      }

      setCreateError(response.message || "Unable to create project.");
    } catch (error) {
      setCreateError(error.message || "Unable to create project.");
    } finally {
      setCreatingProject(false);
    }
  };

  useEffect(() => {
    getBoards();
  }, []);

  if (selectedBoard) {
    return (
      <BoardDetailView
        board={selectedBoard}
        workspace={workspace}
        onBack={() => setSelectedBoard(null)}
      />
    );
  }

  return (
    <main className="flex-1 p-4 lg:p-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.65)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2.5 text-slate-300">
            <span className="text-lg">⌕</span>
            <input
              type="text"
              placeholder="Search projects, tasks, pages..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none lg:w-[380px]"
            />
          </div>

          <div className="flex items-center gap-3 self-end lg:self-auto">
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/60 text-slate-200">
              🔔
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/60 text-slate-200">
              ⚙
            </button>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-800/60 px-2 py-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="pr-1 text-sm text-slate-200">{user?.name || "User"}</div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Projects</h1>
            <p className="mt-2 text-lg text-slate-400">Manage and organize your workspace projects.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110"
          >
            + New Project
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.65)] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2.5 text-slate-300">
            <span className="text-lg">⌕</span>
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <button className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-800/60 px-3 py-2.5 text-left text-sm text-slate-200">
            <span className="flex items-center gap-2">
              <span>☰</span>
              All Projects
            </span>
            <span>⌄</span>
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-[#112235] p-10 text-center text-slate-300">
            No boards found for this workspace yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {boards.map((board) => (
              <ProjectCard key={board._id} board={board} onOpenBoard={setSelectedBoard} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">New Project</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Create a board</h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setProjectName("");
                  setCreateError("");
                }}
                className="text-2xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Project Name</span>
                <input
                  type="text"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="Website Development"
                  className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  autoFocus
                />
              </label>

              {createError && <p className="text-sm text-red-400">{createError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setProjectName("");
                    setCreateError("");
                  }}
                  className="rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingProject}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {creatingProject ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Projects;
