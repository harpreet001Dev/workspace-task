import { useSelector } from "react-redux";
import api from "../api/api";
import { useState, useEffect } from "react";

const projects = [
  {
    id: 1,
    title: "Website Development",
    createdAt: "Created Sep 10, 2026",
    members: 5,
    tasks: 12,
    progress: 70,
    accentClass: "bg-gradient-to-br from-indigo-500 to-violet-500",
    short: "W",
  },
  {
    id: 2,
    title: "Mobile App",
    createdAt: "Created Sep 8, 2026",
    members: 3,
    tasks: 8,
    progress: 40,
    accentClass: "bg-gradient-to-br from-indigo-500 to-violet-500",
    short: "M",
  },
  {
    id: 3,
    title: "Backend API",
    createdAt: "Created Sep 5, 2026",
    members: 4,
    tasks: 21,
    progress: 60,
    accentClass: "bg-gradient-to-br from-indigo-500 to-violet-500",
    short: "B",
  },
  {
    id: 4,
    title: "Marketing",
    createdAt: "Created Sep 1, 2026",
    members: 6,
    tasks: 14,
    progress: 35,
    accentClass: "bg-gradient-to-br from-indigo-500 to-violet-500",
    short: "M",
  },
  {
    id: 5,
    title: "Design System",
    createdAt: "Created Aug 28, 2026",
    members: 4,
    tasks: 9,
    progress: 80,
    accentClass: "bg-gradient-to-br from-indigo-500 to-violet-500",
    short: "D",
  },
  {
    id: 6,
    title: "Client Portal",
    createdAt: "Created Aug 20, 2026",
    members: 3,
    tasks: 11,
    progress: 25,
    accentClass: "bg-gradient-to-br from-indigo-500 to-violet-500",
    short: "C",
  },
];

const ProjectCard = ({ title, createdAt, members, tasks, progress, accentClass, short }) => {
    const [projects,setProjects]=useState([]);
    const getBoards = async () => {
        try {
          const res = await api.Board();
          if (res.success) {
            setProjects(res?.data)
          }
        } catch (error) {
          console.log(error, "error")
        }
      }
    
      useEffect(() => {
        getBoards()
      }, [])
    return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#112235] p-4 shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentClass}`}>
            <span className="text-2xl font-semibold text-white">{short}</span>
          </div>

          <div>
            <div className="text-2xl font-semibold text-white">{title}</div>
            <div className="text-sm text-slate-400">{createdAt}</div>
          </div>
        </div>

        <button className="text-xl text-slate-400">⋮</button>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-base">◉</span>
          <span>{members} members</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base">☰</span>
          <span>{tasks} tasks</span>
        </div>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-700/80">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <button className="mt-5 w-full rounded-xl border border-slate-600/80 bg-slate-800/50 px-4 py-3 text-base font-medium text-white transition hover:bg-slate-700/70">
        Open Project →
      </button>
    </div>
  );
};

const Projects = () => {
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
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="pr-1 text-sm text-slate-200">{user?.name || "User"}</div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Projects</h1>
            <p className="mt-2 text-lg text-slate-400">Manage and organize your workspace projects.</p>
          </div>

          <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110">
            + New Project
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.65)] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2.5 text-slate-300">
            <span className="text-lg">⌕</span>
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <button className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-800/60 px-3 py-2.5 text-left text-sm text-slate-200">
            <span className="flex items-center gap-2">
              <span>☰</span>
              All Projects
            </span>
            <span>⌄</span>
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Projects;
