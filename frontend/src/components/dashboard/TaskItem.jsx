const TaskItem = ({ title, priority, description }) => {
  const shortDescription = description
    ? description.replace(/\s+/g, " ").trim()
    : "";

  const displayedDescription = shortDescription.length > 90
    ? `${shortDescription.slice(0, 90).trim()}...`
    : shortDescription;

  return (
    <div className="group flex items-start justify-between gap-3 rounded-xl border border-slate-700/70 bg-[#111f2d] px-3 py-3 transition duration-200 hover:border-indigo-400/60 hover:bg-[#142739]">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-1 h-4 w-4 rounded-full border-2 border-slate-400 bg-transparent" />

        <div className="min-w-0 flex-1">
          <div className="text-base font-medium text-slate-100">
            {title}
          </div>

          {displayedDescription && (
            <div className="mt-1 text-sm text-slate-400">
              {displayedDescription}
            </div>
          )}

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-slate-600 bg-slate-800/80 px-2 py-0.5 uppercase tracking-wide">
              {priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;