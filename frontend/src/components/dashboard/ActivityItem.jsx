const ActivityItem = ({ initials, colorClass, message, time }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClass} font-semibold text-white`}>
        {initials}
      </div>

      <div className="flex flex-1 items-center justify-between gap-3">
        <p className="text-sm text-slate-200">
          <span className="font-medium text-white">{message}</span>
        </p>
        <span className="whitespace-nowrap text-xs text-slate-400">{time}</span>
      </div>
    </div>
  );
};

export default ActivityItem;
