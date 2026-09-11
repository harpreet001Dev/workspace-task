import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/api";

const AllTasks = () => {
  const workspace = useSelector((state) => state.auth.workspace);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAllTasks = async () => {
    if (!workspace?._id) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.Dashboard();

      if (res.success) {
        setTasks(res.data?.allTasks || []);
      }
    } catch (error) {
      console.log(error, "Unable to load all tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllTasks();
  }, [workspace?._id]);

  return (
    <main className="flex-1 p-4 lg:p-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.65)]">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Workspace</p>
              <h1 className="mt-1 text-4xl font-bold tracking-tight text-white">All Tasks</h1>
            </div>

            <div className="rounded-xl border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-sm text-slate-300">
              {tasks.length} task{tasks.length === 1 ? "" : "s"} in workspace
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 text-slate-300">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-600 bg-[#0f1d2d] p-6 text-center text-slate-300">
            No tasks found in this workspace.
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-2xl border border-slate-700/80 bg-[#112235] p-4 shadow-[0_20px_40px_rgba(15,23,42,0.25)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-indigo-300">
                      {task.boardId?.name || "Project"}
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold text-white">{task.title}</h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-600 bg-slate-800/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-200">
                      {task.priority || "Medium"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedTask(task)}
                      className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span className="rounded-full border border-slate-600 bg-slate-800/60 px-2 py-1">
                    Assigned to: {task.assignedTo?.name || "Unassigned"}
                  </span>
                  <span className="rounded-full border border-slate-600 bg-slate-800/60 px-2 py-1">
                    Created by: {task.createdBy?.name || "User"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Task Details</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{selectedTask.title}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="text-2xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-slate-300">
              <div>
                <p className="text-sm text-slate-400">Project</p>
                <p className="text-lg text-white">{selectedTask.boardId?.name || "Project"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Description</p>
                <p className="text-base text-slate-200">
                  {selectedTask.description || "No description added."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-400">Priority</p>
                  <p className="text-base text-white capitalize">
                    {selectedTask.priority || "Medium"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Assigned To</p>
                  <p className="text-base text-white">{selectedTask.assignedTo?.name || "Unassigned"}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-400">Created By</p>
                  <p className="text-base text-white">{selectedTask.createdBy?.name || "User"}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Created</p>
                  <p className="text-base text-white">
                    {selectedTask.createdAt
                      ? new Date(selectedTask.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AllTasks;
