const BoardBreadcrumb = ({ workspaceName, boardName, onBack }) => (
    <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
        <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-slate-700/80 bg-slate-800/50 px-2 py-1 text-slate-200 transition hover:bg-slate-700/60"
        >
            ← Back
        </button>

        <span>{workspaceName || "Acme Workspace"}</span>
        <span>›</span>
        <span>Boards</span>
        <span>›</span>
        <span className="text-slate-200">{boardName}</span>
    </div>
);

export default BoardBreadcrumb;
