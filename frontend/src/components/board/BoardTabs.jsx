const BoardTabs = ({ activeTab, boardMembersLength, onTabChange, onCreateTask, boardColumns }) => (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-3 shadow-[0_20px_50px_rgba(15,23,42,0.65)] xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
            {[
                { label: "Board", key: "board" },
                { label: `Members (${boardMembersLength})`, key: "members" },
            ].map((tab) => (
                <button
                    key={tab.key}
                    type="button"
                    onClick={() => onTabChange(tab.key)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                        activeTab === tab.key
                            ? "border border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                            : "border border-slate-700/80 bg-slate-800/50 text-slate-300 hover:bg-slate-700/60"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
            <button
                type="button"
                className="rounded-xl border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200"
            >
                Filters
            </button>

            <button
                type="button"
                className="rounded-xl border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200"
            >
                Group by: None
            </button>

            <button
                type="button"
                onClick={() => onCreateTask(boardColumns?.[0]?._id || "")}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110"
            >
                + Add Task
            </button>
        </div>
    </div>
);

export default BoardTabs;
