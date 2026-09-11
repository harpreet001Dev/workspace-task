const TaskItem = ({ title, priority }) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-[#111f2d] px-3 py-3">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 rounded-full border-2 border-slate-400 bg-transparent" />

        <div className="flex-1">
          <div className="text-base text-slate-100">
            {title}
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-slate-600 px-2 py-0.5">
              {priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;