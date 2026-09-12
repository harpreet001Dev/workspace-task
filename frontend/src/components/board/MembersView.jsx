const MembersView = ({ boardMembers, boardId, canManageMembers, onAddMembers }) => (
    <div className="rounded-2xl border border-slate-700/80 bg-[#112235] p-4 shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
        <div className="mb-4 flex items-center justify-between gap-3">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Project members</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Team</h3>
            </div>

            {canManageMembers && (
                <button
                    type="button"
                    onClick={onAddMembers}
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110"
                >
                    + Add Members
                </button>
            )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {boardMembers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/40 p-4 text-sm text-slate-300">
                    No members added yet.
                </div>
            ) : (
                boardMembers.map((member) => (
                    <div
                        key={`${boardId}-member-card-${member._id}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-900/40 p-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                                {member.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div>
                                <div className="font-medium text-white">{member.name}</div>
                                <div className="text-sm text-slate-400">{member.email}</div>
                            </div>
                        </div>

                        <span className="rounded-full border border-slate-600 bg-slate-800/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-200">
                            {member.role || "member"}
                        </span>
                    </div>
                ))
            )}
        </div>
    </div>
);

export default MembersView;
