const StatCard = ({ label, value, meta, icon, colorClass, accentClass }) => {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#122235] p-4 shadow-sm shadow-slate-950/20">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
          <span className="text-xl text-white">{icon}</span>
        </div>

        <div className="flex-1">
          <div className="text-2xl font-semibold text-white">{value}</div>
          <div className="mt-1 text-xl font-medium text-slate-100">{label}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${accentClass}`} />
          <span>{meta}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
