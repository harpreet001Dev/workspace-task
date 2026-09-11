const ProjectCard = ({ title, members }) => {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#122235] p-3 shadow-sm shadow-slate-950/20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
            <span className="text-lg text-white">P</span>
          </div>

          <div>
            <div className="text-lg font-semibold text-white">
              {title}
            </div>
          </div>
        </div>

        <button className="text-xl text-slate-400">⋮</button>
      </div>

      <div className="mt-4 flex items-center justify-end text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <span>{members}</span>
          <span>members</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;