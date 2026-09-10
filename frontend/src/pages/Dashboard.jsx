import StatCard from "../components/dashboard/StatCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import TaskItem from "../components/dashboard/TaskItem";
import ActivityItem from "../components/dashboard/ActivityItem";
import { useSelector } from "react-redux";

const dashboardStats = [
  {
    label: "Projects",
    value: 6,
    meta: "2 from last month",
    icon: "▣",
    colorClass: "bg-indigo-500/90",
    accentClass: "bg-indigo-400",
  },
  {
    label: "My Tasks",
    value: 12,
    meta: "4 from last week",
    icon: "☑",
    colorClass: "bg-violet-500/90",
    accentClass: "bg-violet-400",
  },
  {
    label: "Members",
    value: 18,
    meta: "3 new this month",
    icon: "◍",
    colorClass: "bg-sky-500/90",
    accentClass: "bg-sky-400",
  },
  {
    label: "Due Soon",
    value: 4,
    meta: "2 this week",
    icon: "◔",
    colorClass: "bg-amber-500/90",
    accentClass: "bg-amber-400",
  },
];

const projects = [
  {
    title: "Website Redesign",
    subtitle: "UI/UX and branding updates",
    progress: 80,
    accentClass: "bg-gradient-to-r from-indigo-500 to-violet-500",
    tasks: 12,
    members: 5,
  },
  {
    title: "Mobile Application",
    subtitle: "React Native application",
    progress: 60,
    accentClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
    tasks: 18,
    members: 6,
  },
  {
    title: "Marketing Campaign",
    subtitle: "Landing page and content",
    progress: 40,
    accentClass: "bg-gradient-to-r from-pink-500 to-rose-500",
    tasks: 8,
    members: 4,
  },
];

const tasks = [
  { title: "Fix authentication bug", status: "todo", priority: "High", dueDate: "Today", dueLabel: "Today" },
  { title: "Design dashboard UI", status: "in-progress", priority: "Medium", dueDate: "Tomorrow", dueLabel: "Tomorrow" },
  { title: "Set up MongoDB aggregation", status: "todo", priority: "Low", dueDate: "Nov 22", dueLabel: "Nov 22" },
  { title: "Write API documentation", status: "done", priority: "Medium", dueDate: "Nov 25", dueLabel: "Nov 25" },
];

const activityItems = [
  {
    initials: "A",
    colorClass: "bg-indigo-500",
    message: "Alex moved \"Login UI\" to Done",
    time: "10 minutes ago",
  },
  {
    initials: "S",
    colorClass: "bg-violet-500",
    message: "Sarah created a new task \"API documentation\"",
    time: "35 minutes ago",
  },
  {
    initials: "J",
    colorClass: "bg-slate-500",
    message: "John joined the workspace",
    time: "1 hour ago",
  },
  {
    initials: "Y",
    colorClass: "bg-emerald-500",
    message: "You created \"Payment Integration\" project",
    time: "2 hours ago",
  },
  {
    initials: "E",
    colorClass: "bg-amber-500",
    message: "Emily commented on \"Design System\"",
    time: "3 hours ago",
  },
];

const sidebarMembers = [
  { initials: "B", name: "Bedu", role: "Owner" },
  { initials: "A", name: "Alex Johnson", role: "Admin" },
  { initials: "S", name: "Sarah Miller", role: "Member" },
  { initials: "J", name: "John Doe", role: "Member" },
  { initials: "E", name: "Emily Davis", role: "Member" },
];

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);


  return (
    <main className="flex-1 p-4 lg:p-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.65)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2.5 text-slate-300">
            <span className="text-lg">⌕</span>
            <input
              type="text"
              placeholder="Search projects, tasks, pages..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none lg:w-[380px]"
            />
          </div>

          <div className="flex items-center gap-3 self-end lg:self-auto">
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/60 text-slate-200">
              🔔
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/60 text-slate-200">
              ⚙
            </button>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-800/60 px-2 py-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="pr-1 text-sm text-slate-200">{user?.name}</div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Good evening, {user?.name} 👋</h1>
            <p className="mt-2 text-lg text-slate-400">Here’s what’s happening in your workspace today.</p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-[#122235] px-3 py-2 text-sm text-slate-300">
            <span className="text-lg">🗓</span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-sm shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">My Tasks</h2>
                <button className="text-sm font-medium text-indigo-300">View all →</button>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem key={task.title} {...task} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-sm shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>
                <button className="text-sm font-medium text-indigo-300">View all →</button>
              </div>

              <div className="space-y-1">
                {activityItems.map((item) => (
                  <ActivityItem key={item.message} {...item} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-sm shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Projects</h2>
                <button className="text-sm font-medium text-indigo-300">View all →</button>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectCard key={project.title} {...project} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-sm shadow-slate-950/20">
              <h2 className="mb-4 text-2xl font-semibold text-white">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110">
                  + New Project
                </button>
                <button className="w-full rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-3 text-base font-medium text-slate-100 transition hover:bg-slate-700/60">
                  + Create Task
                </button>
                <button className="w-full rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-3 text-base font-medium text-slate-100 transition hover:bg-slate-700/60">
                  + Create Page
                </button>
                <button className="w-full rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-3 text-base font-medium text-slate-100 transition hover:bg-slate-700/60">
                  + Invite Member
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-sm shadow-slate-950/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Workspace Members</h2>
                <button className="text-sm font-medium text-indigo-300">View all →</button>
              </div>

              <div className="space-y-3">
                {sidebarMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white">
                        {member.initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{member.name}</div>
                        <div className="text-xs text-slate-400">{member.role}</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-slate-600 bg-slate-700/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-indigo-500/20 via-slate-800/60 to-violet-500/20 p-4 shadow-sm shadow-slate-950/20">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl text-white">
                  ⚡
                </div>
              </div>
              <div className="mt-6 text-2xl font-semibold text-white">Keep building.</div>
              <div className="mt-2 text-sm text-slate-300">Great teams turn ideas into reality.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;