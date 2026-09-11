import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";

const columnDotClasses = {
    "To do": "bg-indigo-500",
    "In progress": "bg-blue-500",
    Review: "bg-amber-500",
    Done: "bg-emerald-500",
};

const BoardColumn = ({
    column,
    taskLoading,
    taskMenuOpenId,
    setTaskMenuOpenId,
    openCreateTaskModal,
    openViewTaskModal,
    openEditTaskModal,
    handleDeleteTask,
}) => {
    const { setNodeRef } = useDroppable({
        id: column._id,
    });

    return (
        <div ref={setNodeRef}>
            <div className="rounded-2xl border border-slate-700/80 bg-[#cfe1ee] p-3 shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
                {/* Column Header */}
                <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span
                            className={`h-3 w-3 rounded-full ${
                                columnDotClasses[column.name] || "bg-slate-500"
                            }`}
                        />

                        <span className="text-lg font-semibold text-slate-800">
                            {column.name}
                        </span>

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

                {/* Tasks */}
                <div className="space-y-3">
                    <SortableContext
                        items={column.tasks.map((task) => task._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {taskLoading ? (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100/60 p-3 text-center text-sm text-slate-600">
                                Loading tasks...
                            </div>
                        ) : column.tasks.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100/60 p-3 text-center text-sm text-slate-600">
                                No tasks yet
                            </div>
                        ) : (
                            column.tasks.map((task) => (
                                <SortableTask
                                    key={task._id}
                                    task={task}
                                    isMenuOpen={
                                        taskMenuOpenId === task._id
                                    }
                                    onToggleMenu={(taskId) =>
                                        setTaskMenuOpenId((prev) =>
                                            prev === taskId
                                                ? null
                                                : taskId
                                        )
                                    }
                                    onView={openViewTaskModal}
                                    onEdit={openEditTaskModal}
                                    onDelete={handleDeleteTask}
                                />
                            ))
                        )}
                    </SortableContext>
                </div>

                {/* Add Task */}
                <button
                    type="button"
                    onClick={() => openCreateTaskModal(column._id)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-400 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                    <span className="text-lg">+</span>
                    Add Task
                </button>
            </div>
        </div>
    );
};

export default BoardColumn;