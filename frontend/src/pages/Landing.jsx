import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { loginSuccess } from "../redux/slices/authSlice";

const initialState = {
  name: "",
  description: "",
};

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, workspace, accessToken } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateWorkspace = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.CreateWorkspace(formData);

      if (response.success) {
        dispatch(
          loginSuccess({
            user,
            workspace: response.data?.workspace,
            accessToken: response.data?.accessToken || accessToken,
          })
        );

        navigate("/dashboard");
        return;
      }

      setError(response.message || "Unable to create workspace.");
    } catch (createError) {
      setError(createError.message || "Unable to create workspace.");
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardNavigation = () => {
    navigate("/dashboard");
  };

  if (workspace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-10">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)] ring-1 ring-slate-800/80 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Workspace</p>
              <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}</h1>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-slate-400">Active workspace</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                Ready
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-white">{workspace.name}</h2>
            <p className="mt-2 text-slate-400">
              {workspace.description || "Your workspace is ready. Continue to the dashboard to manage projects and tasks."}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDashboardNavigation}
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-10">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)] ring-1 ring-slate-800/80 sm:p-8">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">TeamSpace</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Create your workspace</h1>
          <p className="mt-2 text-base text-slate-400">
            You are logged in successfully. Start by creating your first workspace to access your dashboard.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-5">
            <h2 className="text-xl font-semibold text-white">What happens next?</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-4">
                <p className="text-sm font-medium text-indigo-300">1. Create workspace</p>
                <p className="mt-1 text-sm text-slate-400">
                  Add a workspace name and a short description to start organizing your team.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-4">
                <p className="text-sm font-medium text-indigo-300">2. Open dashboard</p>
                <p className="mt-1 text-sm text-slate-400">
                  Once your workspace is ready, you will be sent directly to the dashboard.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateWorkspace} className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-5">
            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Workspace Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Workspace"
                className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                required
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your workspace"
                rows="4"
                className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </label>

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating workspace..." : "Create Workspace"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Landing;
