import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import { useState, useEffect, useRef } from "react";

const accentClasses = [
  "bg-gradient-to-br from-indigo-500 to-violet-500",
  "bg-gradient-to-br from-emerald-500 to-teal-500",
  "bg-gradient-to-br from-pink-500 to-rose-500",
  "bg-gradient-to-br from-sky-500 to-cyan-500",
  "bg-gradient-to-br from-amber-500 to-orange-500",
  "bg-gradient-to-br from-fuchsia-500 to-purple-500",
];

const ProjectCard = ({ board, onOpenBoard, onUpdateBoard, onDeleteBoard, canUpdateBoard, canDeleteBoard }) => {
  const short = board?.name?.charAt(0)?.toUpperCase() || "B";
  const accentClass = accentClasses[Math.abs(board?._id?.length || 0) % accentClasses.length];
  const [menuOpen, setMenuOpen] = useState(false);

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

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-xl text-slate-400 transition hover:text-white"
          >
            ⋮
          </button>

          {menuOpen && (canUpdateBoard || canDeleteBoard) && (
            <div className="absolute right-0 top-10 z-20 min-w-[160px] rounded-xl border border-slate-700/80 bg-[#0f1d2d] p-2 shadow-[0_20px_40px_rgba(15,23,42,0.45)]">
              {canUpdateBoard && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onUpdateBoard(board);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800/70"
                >
                  Update board
                </button>
              )}

              {canDeleteBoard && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteBoard(board);
                  }}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-500/10"
                >
                  Delete board
                </button>
              )}
            </div>
          )}
        </div>
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

const Projects = () => {
  const user = useSelector((state) => state.auth.user);
  const workspace = useSelector((state) => state.auth.workspace);
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 6;
  const loadMoreRef = useRef(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [updatingBoard, setUpdatingBoard] = useState(false);
  const [createError, setCreateError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


// Debounce search
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search.trim());
  }, 400);


  return () => clearTimeout(timer);
}, [search]);


// Handle search
useEffect(() => {
  const searchBoards = async () => {
    // If search is empty, load normal boards again
   if (!debouncedSearch) {
  setCursor(null);
  setHasMore(true);
  setBoards([]);
  getBoards();
  return;
}

    try {
      setLoading(true);

      const res = await api.SearchBoards(debouncedSearch);

      if (res.success) {
        // Search result replaces the existing boards
        setBoards(res.data || []);

        // IMPORTANT:
        // Disable normal pagination while searching
        setHasMore(false);
      }
    } catch (error) {
      console.log(error, "search error");
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  searchBoards();
}, [debouncedSearch]);



 
const getBoards = async () => {
  // Don't fetch normal boards while searching
  if (debouncedSearch) {
    return;
  }

  try {
    setLoading(true);

    const res = await api.Board(limit, cursor);

    if (res.success) {
      const newBoards = res.data.boards || [];

      setBoards((prevBoards) => {
  const mergedBoards = [...prevBoards, ...newBoards];

  const uniqueBoards = Array.from(
    new Map(mergedBoards.map((board) => [board._id, board])).values()
  );

  localStorage.setItem(
    "boardsData",
    JSON.stringify(uniqueBoards)
  );

  return uniqueBoards;
});

      setCursor(res.data.nextCursor);
      setHasMore(res.data.hasMore);
    }
  } catch (error) {
    console.log(error, "error");

    const cachedBoards = localStorage.getItem("boardsData");

    if (cachedBoards) {
      setBoards(JSON.parse(cachedBoards));
    }
  } finally {
    setLoading(false);
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

  const handleUpdateBoard = (board) => {
    setEditingBoardId(board._id);
    setProjectName(board.name);
    setShowUpdateModal(true);
  };

  const handleSubmitUpdateBoard = async (event) => {
    event.preventDefault();

    if (!projectName.trim()) {
      setCreateError("Please enter a project name.");
      return;
    }

    try {
      setUpdatingBoard(true);
      setCreateError("");

      const response = await api.UpdateBoard(editingBoardId, {
        name: projectName.trim(),
      });

      if (response.success) {
        setProjectName("");
        setEditingBoardId(null);
        setShowUpdateModal(false);
        toast.success("Board updated successfully.");
        await getBoards();
        return;
      }

      setCreateError(response.message || "Unable to update project.");
    } catch (error) {
      setCreateError(error.message || "Unable to update project.");
    } finally {
      setUpdatingBoard(false);
    }
  };

  const handleDeleteBoard = async (board) => {
    try {
      const response = await api.DeleteBoard(board._id);

      if (response.success) {
        setBoards((prevBoards) => prevBoards.filter((item) => item._id !== board._id));
        toast.success("Board deleted successfully.");
        return;
      }

      toast.error(response.message || "Unable to delete project.");
    } catch (error) {
      toast.error(error.message || "Unable to delete project.");
    }
  };

  useEffect(() => {
    getBoards();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
     if (
  entries[0].isIntersecting &&
  hasMore &&
  !loading &&
  !debouncedSearch
) {
  getBoards();
}
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [cursor, hasMore, loading, debouncedSearch]);
  return (
    <main className="flex-1 p-4 lg:p-6">
      <div className="mx-auto max-w-[1400px]">
        {/* <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.65)] lg:flex-row lg:items-center lg:justify-between">
   
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
        </div> */}

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {boards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-[#112235] p-10 text-center text-slate-300">
            No boards found for this workspace yet.
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {boards.map((board) => (
                <ProjectCard
                  key={board._id}
                  board={board}
                  onOpenBoard={() => navigate(`/projects/${board._id}`)}
                  onUpdateBoard={handleUpdateBoard}
                  onDeleteBoard={handleDeleteBoard}
                  canUpdateBoard={true}
                  canDeleteBoard={workspace?.role === "owner" || String(board.createdBy) === String(user?._id)}
                />
              ))}
            </div>
            <div ref={loadMoreRef} className="h-10" />
          </>
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

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Update Project</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Rename board</h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowUpdateModal(false);
                  setProjectName("");
                  setEditingBoardId(null);
                  setCreateError("");
                }}
                className="text-2xl text-slate-400 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitUpdateBoard} className="space-y-4">
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
                    setShowUpdateModal(false);
                    setProjectName("");
                    setEditingBoardId(null);
                    setCreateError("");
                  }}
                  className="rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingBoard}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {updatingBoard ? "Updating..." : "Save Changes"}
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
