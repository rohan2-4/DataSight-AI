import { formatDistanceToNow } from "../utils/dateUtils";

function ActivityFeed({ activities, darkMode }) {
  return (
    <div className={`rounded-2xl border shadow-xl p-6 mt-8 ${
      darkMode ? "bg-slate-900/60 border-slate-800/80 text-white" : "bg-white border-slate-100 text-slate-800"
    }`}>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Activity</h2>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {activities.map((activity, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 pb-3 border-b last:border-b-0 last:pb-0 ${
              darkMode ? "border-slate-800/60" : "border-slate-100"
            }`}
          >
            <span className="text-xl p-2 bg-slate-850 rounded-xl shadow-inner border border-slate-800/40">
              {activity.icon || "🔔"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-350 leading-relaxed">
                {activity.message}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                {activity.date ? formatDistanceToNow(new Date(activity.date)) : "Just now"}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-center py-6 text-slate-500 text-xs italic">
            No recent activity recorded.
          </p>
        )}
      </div>
    </div>
  );
}

export default ActivityFeed;