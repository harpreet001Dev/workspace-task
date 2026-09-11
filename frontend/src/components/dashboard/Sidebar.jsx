import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import { logout } from "../../redux/slices/authSlice";

const sidebarItems = [
  { label: "Dashboard", icon: "◫", path: "/dashboard" },
  { label: "Projects", icon: "▣", path: "/projects" },
  { label: "Pages", icon: "☰", path: "/pages" },
  { label: "Chat", icon: "◌", path: "/chat" },
  { label: "Members", icon: "◍", path: "/members" },
  { label: "Settings", icon: "⚙", path: "/settings" },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const workspace = useSelector((state) => state.auth.workspace);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.Logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <aside
      className={`flex flex-col border-r border-slate-700/80 bg-[#0b1627] p-4 transition-all duration-200 ${
        isCollapsed ? "w-full lg:w-[92px]" : "w-full lg:w-[260px]"
      }`}
    >
      <div className="mb-6 flex items-center justify-between gap-3 px-2 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
            <span className="text-lg font-bold text-white">T</span>
          </div>

          {!isCollapsed && <div className="text-2xl font-bold text-white">WorkSpace</div>}
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/60 text-slate-300 transition hover:bg-slate-700/80"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mb-5 rounded-xl border border-slate-700/70 bg-slate-800/60 px-3 py-2.5">
          <button className="flex w-full items-center justify-between rounded-lg bg-slate-700/70 px-2 py-2 text-left text-sm text-slate-100">
            <span className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-sm font-semibold text-indigo-300">
                A
              </span>
              {workspace?.name}
            </span>
            <span className="text-slate-400">⌄</span>
          </button>
        </div>
      )}

      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base transition ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-100 ring-1 ring-indigo-500/30"
                  : "text-slate-300 hover:bg-slate-800/70"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <span className="flex h-5 w-5 items-center justify-center text-sm">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => navigate("/my-tasks")}
            className={`flex w-full items-center justify-between rounded-xl border border-slate-700/80 bg-slate-800/60 px-3 py-2.5 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-700/60 ${
              location.pathname === "/my-tasks" ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-200" : ""
            }`}
          >
            <span>My Tasks</span>
            <span>→</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/all-tasks")}
            className={`flex w-full items-center justify-between rounded-xl border border-slate-700/80 bg-slate-800/60 px-3 py-2.5 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-700/60 ${
              location.pathname === "/all-tasks" ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-200" : ""
            }`}
          >
            <span>All Tasks</span>
            <span>→</span>
          </button>
        </div>
      )}

      <div className="mt-auto space-y-3 pt-4">
        {!isCollapsed ? (
          <button className="flex w-full items-center justify-between rounded-xl border border-slate-700/80 bg-slate-800/60 px-3 py-3 text-sm text-slate-200">
            <span className="flex items-center gap-3">
              <span className="text-base">☾</span>
              Dark Mode
            </span>
            <span className="flex h-6 w-11 items-center rounded-full bg-indigo-500/70 p-1">
              <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/60 p-3 text-base text-slate-200"
            aria-label="Dark mode"
          >
            ☾
          </button>
        )}

        <div
          className={`flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-800/60 px-3 py-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white">{user?.name || "User"}</div>
              <div className="truncate text-xs text-slate-400">{user?.email || ""}</div>
            </div>
          )}

          {!isCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-600 bg-slate-700/80 px-2 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
