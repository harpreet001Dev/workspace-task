import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import toast from "react-hot-toast";
import api from "../api/api";
import socket from "../sockets/socket";
import BoardBreadcrumb from "../components/board/BoardBreadcrumb";
import BoardHeader from "../components/board/BoardHeader";
import BoardTabs from "../components/board/BoardTabs";
import MembersView from "../components/board/MembersView";
import BoardColumnsView from "../components/board/BoardColumnsView";
import AddMembersModal from "../components/board/AddMembersModal";
import TaskModal from "../components/board/TaskModal";

const ProjectBoard = () => {
    const user = useSelector((state) => state.auth.user);
    const workspace = useSelector((state) => state.auth.workspace);
    const navigate = useNavigate();
    const { boardId } = useParams();

    const [activeTask, setActiveTask] = useState(null);

    const [board, setBoard] = useState(null);
    const [boardTasks, setBoardTasks] = useState({});
    const [boardMembers, setBoardMembers] = useState([]);
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
    const [loadingBoard, setLoadingBoard] = useState(true);

    const normalizeTask = (task) => {
        const priority = task.priority || "medium";
        const normalizedPriority = priority.toLowerCase();
        const assignedUser =
            task.assignedTo && typeof task.assignedTo === "object"
                ? task.assignedTo
                : { _id: task.assignedTo, name: "Unassigned" };
        const assigneeName = assignedUser.name || "Unassigned";
        const assigneeInitials =
            assigneeName
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
            boardId: board?._id,
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

    const loadBoard = async () => {
        try {
            setLoadingBoard(true);
            const response = await api.GetBoard(boardId);

            if (response.success) {
                setBoard(response.data || null);
            } else {
                setBoard(null);
            }
        } catch (error) {
            console.log(error, "Unable to load board details.");
            setBoard(null);
        } finally {
            setLoadingBoard(false);
        }
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
        loadBoard();
    }, [boardId]);

    useEffect(() => {
        if (!boardId) {
            return;
        }

        socket.emit("board:join", { boardId });
        return () => {
            socket.emit("board:leave", { boardId });
        };
    }, [boardId]);

    useEffect(() => {
        const handleTaskMoved = ({ task, boardId: payloadBoardId, message }) => {
            const incomingBoardId = task?.boardId || payloadBoardId;

            if (String(incomingBoardId) !== String(boardId)) {
                return;
            }

            toast.success(message || `Task "${task?.title || "Task"}" was updated.`);
            loadBoardTasks();
        };

        socket.on("task:moved", handleTaskMoved);

        return () => {
            socket.off("task:moved", handleTaskMoved);
        };
    }, [boardId, board]);

    useEffect(() => {
        if (board) {
            setBoardMembers(board.members || []);
            setBoardTasks({});
            setTaskMenuOpenId(null);
            loadBoardTasks();
        }
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

    const boardColumns = (board?.columns || []).map((column) => ({
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
                const matchedUser = workspaceUsers.find(
                    (member) => String(member._id) === String(userId)
                );

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
                                label:
                                    taskForm.priority === "high"
                                        ? "High"
                                        : taskForm.priority === "low"
                                            ? "Low"
                                            : "Medium",
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
                            label:
                                taskForm.priority === "high"
                                    ? "High"
                                    : taskForm.priority === "low"
                                        ? "Low"
                                        : "Medium",
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

    const availableWorkspaceUsers = workspaceUsers.filter(
        (member) => !boardMembers.some((boardMember) => String(boardMember._id) === String(member._id))
    );

    const canManageMembers = String(board?.createdBy) === String(user?._id);

    if (loadingBoard) {
        return (
            <main className="flex-1 p-4 lg:p-6">
                <div className="mx-auto max-w-[1500px] rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-10 text-center text-slate-300">
                    Loading board...
                </div>
            </main>
        );
    }

    if (!board) {
        return (
            <main className="flex-1 p-4 lg:p-6">
                <div className="mx-auto max-w-[1500px] rounded-2xl border border-dashed border-slate-700 bg-[#0f1d2d] p-10 text-center text-slate-300">
                    Board not found.
                </div>
            </main>
        );
    }
    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) {
            return;
        }

        const activeColumn = boardColumns.find((column) =>
            column.tasks.some((task) => task._id === active.id)
        );

        let overColumn = boardColumns.find((column) =>
            column.tasks.some((task) => task._id === over.id)
        );

        if (!overColumn) {
            overColumn = boardColumns.find(
                (column) => column._id === over.id
            );
        }

        if (!activeColumn || !overColumn) {
            return;
        }

        if (activeColumn._id === overColumn._id) {
            const oldIndex = activeColumn.tasks.findIndex(
                (task) => task._id === active.id
            );

            const newIndex = activeColumn.tasks.findIndex(
                (task) => task._id === over.id
            );

            const reorderedTasks = arrayMove(
                activeColumn.tasks,
                oldIndex,
                newIndex
            );

            try {
                await api.MoveTask(active.id, {
                    columnId: activeColumn._id,
                    order: newIndex + 1,
                });

                setBoardTasks((prev) => ({
                    ...prev,
                    [activeColumn._id]: reorderedTasks,
                }));
            } catch (error) {
                console.error("Failed to move task:", error);
            }
        }

        if (activeColumn._id !== overColumn._id) {
            const sourceTasks = activeColumn.tasks.filter(
                (task) => task._id !== active.id
            );

            const movedTask = {
                ...activeColumn.tasks.find(
                    (task) => task._id === active.id
                ),
                columnId: overColumn._id,
            };

            const destinationTasks = [...overColumn.tasks];

            const destinationIndex = destinationTasks.findIndex(
                (task) => task._id === over.id
            );
            const insertIndex =
                destinationIndex === -1
                    ? destinationTasks.length
                    : destinationIndex;

            const newDestinationTasks = [...destinationTasks];

            newDestinationTasks.splice(
                insertIndex,
                0,
                movedTask
            );

            try {
                await api.MoveTask(active.id, {
                    columnId: overColumn._id,
                    order: insertIndex + 1,
                });

                setBoardTasks((prev) => ({
                    ...prev,
                    [activeColumn._id]: sourceTasks,
                    [overColumn._id]: newDestinationTasks,
                }));
            } catch (error) {
                console.error("Failed to move task:", error);
            }
        }
    };

    return (
        <DndContext
            onDragStart={(event) => {
                const task = boardColumns
                    .flatMap((column) => column.tasks)
                    .find((task) => task._id === event.active.id);

                setActiveTask(task);
            }}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveTask(null)}
        >
            <main className="flex-1 p-4 lg:p-6">
                <div className="mx-auto max-w-[1500px]">
                    <BoardBreadcrumb
                        workspaceName={workspace?.name}
                        boardName={board.name}
                        onBack={() => navigate("/projects")}
                    />

                    <BoardHeader
                        board={board}
                        canManageMembers={canManageMembers}
                        onAddMembers={() => setMemberModalOpen(true)}
                    />

                    <BoardTabs
                        activeTab={activeTab}
                        boardMembersLength={boardMembers.length}
                        onTabChange={setActiveTab}
                        onCreateTask={openCreateTaskModal}
                        boardColumns={board.columns || []}
                    />

                    {activeTab === "members" ? (
                        <MembersView
                            boardMembers={boardMembers}
                            boardId={board._id}
                            canManageMembers={canManageMembers}
                            onAddMembers={() => setMemberModalOpen(true)}
                        />
                    ) : (
                        <BoardColumnsView
                            boardColumns={boardColumns}
                            taskLoading={taskLoading}
                            taskMenuOpenId={taskMenuOpenId}
                            setTaskMenuOpenId={setTaskMenuOpenId}
                            openCreateTaskModal={openCreateTaskModal}
                            openViewTaskModal={openViewTaskModal}
                            openEditTaskModal={openEditTaskModal}
                            handleDeleteTask={handleDeleteTask}
                        />
                    )}
                </div>

                <AddMembersModal
                    memberModalOpen={memberModalOpen}
                    memberSearch={memberSearch}
                    memberAddingId={memberAddingId}
                    memberError={memberError}
                    availableWorkspaceUsers={availableWorkspaceUsers}
                    setMemberSearch={setMemberSearch}
                    setMemberModalOpen={setMemberModalOpen}
                    setMemberError={setMemberError}
                    handleAddBoardMember={handleAddBoardMember}
                />

                <TaskModal
                    taskModal={taskModal}
                    boardColumns={boardColumns}
                    taskForm={taskForm}
                    taskError={taskError}
                    taskSubmitting={taskSubmitting}
                    taskFiles={taskFiles}
                    boardMembers={boardMembers}
                    onClose={closeTaskModal}
                    onTaskFormChange={handleTaskFormChange}
                    onTaskFilesChange={handleTaskFilesChange}
                    onSubmit={handleTaskSubmit}
                />
            </main>

            <DragOverlay>
                {activeTask ? (
                    <div className="w-72 rounded-2xl border border-indigo-300 bg-indigo-50/95 p-3 shadow-xl shadow-indigo-200/70">
                        <div className="text-base font-semibold text-slate-800">{activeTask.title}</div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${activeTask.labelClass || "bg-slate-100 text-slate-700"}`}>
                                {activeTask.label || activeTask.priority || "Medium"}
                            </span>
                            {activeTask.isMyTask && (
                                <span className="rounded-full border border-indigo-300 bg-indigo-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                                    My task
                                </span>
                            )}
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default ProjectBoard;
