import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import { logout } from "../../redux/slices/authSlice";

const sidebarItems = [
  { label: "Dashboard", icon: "◫", path: "/dashboard" },
  { label: "Projects", icon: "▣", path: "/projects" },
  { label: "My Tasks", icon: "☑", path: "/my-tasks" },
  { label: "All Tasks", icon: "▤", path: "/all-tasks" },
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
      } ${isCollapsed ? "h-auto" : "h-screen"}`}
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

      <div className="min-h-0 flex-1 overflow-y-auto">
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
      </div>

      <div className="mt-auto space-y-3 pt-4">
        {!isCollapsed && (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-500/20 to-red-500/20 px-3 py-3 text-sm font-semibold text-rose-100 shadow-lg shadow-rose-500/10 transition hover:brightness-110"
          >
            <span className="text-base">↵</span>
            Logout
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
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
