const accentClasses = [
    "bg-gradient-to-br from-indigo-500 to-violet-500",
    "bg-gradient-to-br from-emerald-500 to-teal-500",
    "bg-gradient-to-br from-pink-500 to-rose-500",
    "bg-gradient-to-br from-sky-500 to-cyan-500",
    "bg-gradient-to-br from-amber-500 to-orange-500",
    "bg-gradient-to-br from-fuchsia-500 to-purple-500",
];

const BoardHeader = ({ board, canManageMembers, onAddMembers }) => (
    <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.65)] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-semibold text-white">
                {board.name?.charAt(0)?.toUpperCase() || "B"}
            </div>

            <div>
                <div className="text-xs uppercase tracking-[0.25em] text-indigo-300">Workspace</div>
                <div className="text-3xl font-bold text-white">{board.name}</div>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0f1d2d] text-xs font-semibold text-white ${accentClasses[index % accentClasses.length].replace(
                            "bg-gradient-to-br",
                            "bg"
                        )}`}
                    >
                        {String.fromCharCode(65 + index)}
                    </div>
                ))}
            </div>

            {canManageMembers && (
                <button
                    type="button"
                    onClick={onAddMembers}
                    className="rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60"
                >
                    + Add Members
                </button>
            )}

            <button
                type="button"
                className="rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60"
            >
                Share
            </button>

            <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/60 text-xl text-slate-200"
            >
                ⋯
            </button>
        </div>
    </div>
);

export default BoardHeader;
