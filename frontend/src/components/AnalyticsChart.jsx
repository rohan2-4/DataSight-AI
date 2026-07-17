import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function AnalyticsChart({ uploads, darkMode }) {
  // Map uploads to comparison data
  const data = uploads.map((up) => ({
    name: up.filename || up.file || "",
    rows: up.rows || 0,
    columns: up.columns || 0,
  })).reverse(); // Show oldest first

  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-2xl border shadow-xl p-6 mt-8 ${
      darkMode ? "bg-slate-900/60 border-slate-800/80 text-white" : "bg-white border-slate-100 text-slate-850"
    }`}>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Dataset Comparison Analytics</h2>
      <div className="h-[300px] w-full p-2 bg-slate-950/20 rounded-xl border border-slate-800/20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155/30" : "#cbd5e1/50"} vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                fontSize: "11px",
                color: "#f8fafc"
              }}
            />
            <Legend />
            <Bar dataKey="rows" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Rows Count" />
            <Bar dataKey="columns" fill="#10b981" radius={[4, 4, 0, 0]} name="Columns Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsChart;