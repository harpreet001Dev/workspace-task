import {
    useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const SortableTask = ({
    task,
    isMenuOpen,
    onToggleMenu,
    onView,
    onEdit,
    onDelete,
}) => {
    const stopDragPropagation = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task._id,
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={`relative rounded-2xl border p-3 shadow-sm shadow-slate-400/20 transition ${task.isMyTask
                ? "border-indigo-400 bg-indigo-50/95 shadow-indigo-200/60"
                : "border-slate-300 bg-[#f5f8fb]"
                } ${isDragging ? "opacity-60" : "opacity-100"}`}
        >
            <button
                type="button"
                onPointerDown={stopDragPropagation}
                onMouseDown={stopDragPropagation}
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggleMenu(task._id);
                }}
                className="absolute right-2 top-2 text-lg font-bold text-slate-500 transition hover:text-slate-700"
            >
                ⋯
            </button>

            {isMenuOpen && (
                <div className="absolute right-2 top-9 z-30 w-36 rounded-xl border border-slate-700 bg-[#122235] p-2 shadow-lg">
                    <button
                        type="button"
                        onPointerDown={stopDragPropagation}
                        onMouseDown={stopDragPropagation}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onView(task);
                        }}
                        className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-slate-200 transition hover:bg-slate-700/60"
                    >
                        View
                    </button>
                    <button
                        type="button"
                        onPointerDown={stopDragPropagation}
                        onMouseDown={stopDragPropagation}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onEdit(task);
                        }}
                        className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-slate-200 transition hover:bg-slate-700/60"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onPointerDown={stopDragPropagation}
                        onMouseDown={stopDragPropagation}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onDelete(task._id);
                        }}
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
                <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${task.labelClass || "bg-slate-100 text-slate-700"}`}
                >
                    {task.label || task.priority || "Medium"}
                </span>
                <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${task.priorityClass || "bg-amber-100 text-amber-700"}`}
                >
                    {task.priority || "Medium"}
                </span>
            </div>

            {task.description && (
                <p className="mt-3 line-clamp-3 text-sm text-slate-600">{task.description}</p>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                    <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f5f8fb] text-[10px] font-bold text-white ${task.assigneeColor || "bg-indigo-500"}`}
                    >
                        {task.assigneeInitials || "U"}
                    </div>
                    <span className="font-medium text-slate-700">{task.assignee || "Unassigned"}</span>
                </div>

                <div className="flex items-center gap-1">
                    <span>◫</span>
                    <span>{task.due || "Today"}</span>
                </div>
            </div>
        </div>
    );
};

export default SortableTask