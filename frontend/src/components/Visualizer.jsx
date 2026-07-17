import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4", "#14b8a6"];

function Visualizer({ activeData }) {
  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  const columns = activeData?.column_names || [];
  const data = activeData?.data || [];

  // Automatically select default axes when columns load
  useEffect(() => {
    if (columns.length > 0) {
      setXAxis(columns[0]);
      if (columns.length > 1) {
        setYAxis(columns[1]);
      } else {
        setYAxis(columns[0]);
      }
    }
  }, [columns]);

  if (!activeData || data.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 mt-6 shadow-xl">
        <p className="text-lg">No active dataset selected.</p>
        <p className="text-sm mt-1 text-slate-500">Go to the Overview or Upload tab and select a dataset to visualize.</p>
      </div>
    );
  }

  const renderChart = () => {
    // If we have a pie chart, limit to top 10 items to prevent overlapping labels
    const chartData = chartType === "pie" ? data.slice(0, 10) : data;

    switch (chartType) {
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155/30" vertical={false} />
            <XAxis dataKey={xAxis} stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc"
              }}
            />
            <Legend />
            <Bar dataKey={yAxis} fill="#3b82f6" radius={[4, 4, 0, 0]} name={yAxis} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155/30" vertical={false} />
            <XAxis dataKey={xAxis} stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc"
              }}
            />
            <Legend />
            <Line type="monotone" dataKey={yAxis} stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} name={yAxis} />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155/30" vertical={false} />
            <XAxis dataKey={xAxis} stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc"
              }}
            />
            <Legend />
            <Area type="monotone" dataKey={yAxis} stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorY)" name={yAxis} />
          </AreaChart>
        );
      case "scatter":
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155/30" />
            <XAxis type="category" dataKey={xAxis} stroke="#94a3b8" fontSize={12} name={xAxis} />
            <YAxis type="number" dataKey={yAxis} stroke="#94a3b8" fontSize={12} name={yAxis} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc"
              }}
            />
            <Legend />
            <Scatter name={`${xAxis} vs ${yAxis}`} data={chartData} fill="#8b5cf6" />
          </ScatterChart>
        );
      case "pie":
        return (
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f8fafc"
              }}
            />
            <Legend />
            <Pie
              data={chartData}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#3b82f6"
              label={{ fill: "#f8fafc", fontSize: 11 }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 mt-8 shadow-xl text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Analytics Visualizer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing: <span className="text-blue-400 font-semibold">{activeData.filename}</span> ({data.length} records)
          </p>
        </div>

        {/* Configuration Selectors */}
        <div className="flex flex-wrap gap-3 items-center">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="bar">Bar Chart 📊</option>
              <option value="line">Line Chart 📈</option>
              <option value="area">Area Chart 📉</option>
              <option value="scatter">Scatter Plot ⚪</option>
              <option value="pie">Pie Chart 🍕</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              X-Axis
            </label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
            >
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Y-Axis (Numeric)
            </label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
            >
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart Render Window */}
      <div className="h-[400px] w-full flex items-center justify-center p-2 bg-slate-950/40 rounded-xl border border-slate-800/40">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Visualizer;
