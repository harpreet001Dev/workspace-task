import StatCard from "../components/dashboard/StatCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import TaskItem from "../components/dashboard/TaskItem";
import ActivityItem from "../components/dashboard/ActivityItem";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const workspace = useSelector((state) => state.auth.workspace);
  const [data, setData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [inviteMessage, setInviteMessage] = useState("");

  const getDashboardData = async () => {
    try {
      const res = await api.Dashboard();
      if (res.success) {
        setData(res?.data)
        localStorage.setItem(
          "dashboardData",
          JSON.stringify(res?.data)
        );
      }
    } catch (error) {
      console.log(error, "error");

      const cachedData = localStorage.getItem("dashboardData");

      if (cachedData) {
        setData(JSON.parse(cachedData));
      }
    }
  }

  const getRecentActivities = async () => {
    try {
      const res = await api.GetRecentActivities();
      if (res.success) {
        setRecentActivities(res?.data || []);
      }
    } catch (error) {
      console.log(error, "Unable to load recent activities.");
    }
  };

  const handleInviteClick = async () => {
    try {
      const res = await api.CreateInvite();
      const inviteLink = res?.data?.inviteLink;

      if (inviteLink) {
        await navigator.clipboard.writeText(inviteLink);
        setInviteMessage("Invite link copied to clipboard.");
        return;
      }

      setInviteMessage("Invite created successfully.");
    } catch (error) {
      console.error(error);
      setInviteMessage("Unable to create invite right now.");
    }
  };

  useEffect(() => {
    getDashboardData();
    getRecentActivities();
  }, [])

  const dashboardStats = [
    {
      label: "Projects",
      value: data?.stats?.totalProjects || 0,
      icon: "▣",
      colorClass: "bg-indigo-500/90",
    },
    {
      label: "My Tasks",
      value: data?.stats?.myTasks || 0,
      icon: "☑",
      colorClass: "bg-violet-500/90",
    },
    {
      label: "Members",
      value: data?.stats?.members || 0,
      icon: "◍",
      colorClass: "bg-sky-500/90",
    },

  ];


  return (
    <main className="flex-1 p-3 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 rounded-2xl border border-slate-700/80 bg-gradient-to-r from-[#0f1d2d] via-[#112235] to-[#0f1d2d] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.65)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-indigo-300">Workspace overview</p>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Good evening, {user?.name} 👋
              </h1>
              <p className="mt-2 text-base text-slate-400 md:text-lg">
                Here’s what’s happening in your workspace today.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-[#122235] px-3 py-2 text-sm text-slate-300">
                <span className="text-lg">🗓</span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              {workspace?.role === "owner" && (
                <button
                  onClick={handleInviteClick}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110"
                >
                  Invite member
                </button>
              )}

              <div className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-800/60 px-2 py-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="pr-1 text-sm text-slate-200">{user?.name}</div>
              </div>
            </div>
          </div>
        </div>

        {inviteMessage && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {inviteMessage}
          </div>
        )}

        <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-sm shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">My Tasks</h2>
                <Link
                  to="/my-tasks"
                  className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
                >
                  View all →
                </Link>
              </div>

              <div className="space-y-3">
                {data?.myTasks?.map((task) => (
                  <TaskItem
                    key={task._id}
                    title={task.title}
                    priority={task.priority}
                    description={task.description}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-sm shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>
              </div>

              <div className="space-y-1">
                {recentActivities.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/40 p-4 text-sm text-slate-300">
                    No recent activity yet.
                  </div>
                ) : (
                  recentActivities.map((item) => (
                    <ActivityItem key={item._id} initials={item.initials} colorClass={item.colorClass} message={item.message} time={item.timeLabel} />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-sm shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Projects</h2>
                <Link to="/projects" className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200">
                  View all →
                </Link>
              </div>

              <div className="space-y-4">
                {data?.projectsWithMembers?.map((project) => (
                  <ProjectCard
                    key={project._id}
                    title={project.name}
                    members={project.totalMembers}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-sm shadow-slate-950/20">
              <h2 className="mb-4 text-2xl font-semibold text-white">Quick Links</h2>
              <div className="grid gap-3">
                <Link
                  to="/projects"
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-center text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110"
                >
                  View Projects
                </Link>
                <Link
                  to="/my-tasks"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-3 text-center text-base font-medium text-slate-100 transition hover:bg-slate-700/60"
                >
                  Open My Tasks
                </Link>
                <Link
                  to="/all-tasks"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-3 text-center text-base font-medium text-slate-100 transition hover:bg-slate-700/60"
                >
                  Open All Tasks
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;