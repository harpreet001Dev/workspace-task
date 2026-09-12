const TaskModal = ({
    taskModal,
    boardColumns,
    taskForm,
    taskError,
    taskSubmitting,
    taskFiles,
    boardMembers,
    onClose,
    onTaskFormChange,
    onTaskFilesChange,
    onSubmit,
}) => {
    if (!taskModal.open) {
        return null;
    }

    const isViewMode = taskModal.mode === "view";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
            <div className="w-full max-w-xl rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)]">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">
                            {isViewMode
                                ? "Task Details"
                                : taskModal.mode === "edit"
                                    ? "Edit Task"
                                    : "Add Task"}
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold text-white">
                            {isViewMode
                                ? taskModal.task?.title
                                : taskModal.mode === "edit"
                                    ? "Update task"
                                    : "Create task"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-slate-400 transition hover:text-white"
                    >
                        ×
                    </button>
                </div>

                {isViewMode ? (
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
                                <p className="text-base text-white capitalize">
                                    {taskModal.task?.priority || "Medium"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">Column</p>
                                <p className="text-base text-white">
                                    {boardColumns.find((column) => column._id === taskModal.task?.columnId)?.name ||
                                        "Unknown"}
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
                    <form onSubmit={onSubmit} className="space-y-4">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Task Title</span>
                            <input
                                type="text"
                                name="title"
                                value={taskForm.title}
                                onChange={onTaskFormChange}
                                placeholder="Write task title"
                                className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-300">Description</span>
                            <textarea
                                name="description"
                                value={taskForm.description}
                                onChange={onTaskFormChange}
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
                                    onChange={onTaskFormChange}
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
                                    onChange={onTaskFormChange}
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
                                onChange={onTaskFormChange}
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
                                onChange={onTaskFilesChange}
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
                                onClick={onClose}
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
    );
};

export default TaskModal;
