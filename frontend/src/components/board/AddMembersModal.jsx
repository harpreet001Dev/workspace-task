const AddMembersModal = ({
    memberModalOpen,
    memberSearch,
    memberAddingId,
    memberError,
    availableWorkspaceUsers,
    setMemberSearch,
    setMemberModalOpen,
    setMemberError,
    handleAddBoardMember,
}) => {
    if (!memberModalOpen) {
        return null;
    }

    const filteredUsers = availableWorkspaceUsers.filter((memberUser) => {
        const text = `${memberUser.name} ${memberUser.email}`.toLowerCase();
        return text.includes(memberSearch.toLowerCase());
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
            <div className="w-full max-w-xl rounded-2xl border border-slate-700/80 bg-[#0f1d2d] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.65)]">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Project Members</p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">Add team members</h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setMemberModalOpen(false);
                            setMemberError("");
                            setMemberSearch("");
                        }}
                        className="text-2xl text-slate-400 transition hover:text-white"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={memberSearch}
                        onChange={(event) => setMemberSearch(event.target.value)}
                        placeholder="Search workspace users"
                        className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                </div>

                {memberError && <p className="mb-4 text-sm text-red-400">{memberError}</p>}

                <div className="max-h-80 space-y-3 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/40 p-4 text-center text-sm text-slate-300">
                            No available users to add.
                        </div>
                    ) : (
                        filteredUsers.map((memberUser) => (
                            <div
                                key={memberUser._id}
                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-900/40 p-3"
                            >
                                <div>
                                    <div className="font-medium text-white">{memberUser.name}</div>
                                    <div className="text-sm text-slate-400">{memberUser.email}</div>
                                </div>

                                <button
                                    type="button"
                                    disabled={memberAddingId === memberUser._id}
                                    onClick={() => handleAddBoardMember(memberUser._id)}
                                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {memberAddingId === memberUser._id ? "Adding..." : "Add"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddMembersModal;
