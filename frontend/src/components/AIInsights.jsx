import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];

function AIInsights({ activeUpload, activeInsights, darkMode }) {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Reset chat history when dataset changes
  useEffect(() => {
    setChatHistory([
      {
        sender: "ai",
        text: `Hello! I've analyzed **${activeUpload?.filename || "your dataset"}**. You can ask me questions about this dataset, such as:
- *"average sales by region"*
- *"describe price"*
- *"correlation between temperature and ice_cream_sales"*`,
      },
    ]);
  }, [activeUpload]);

  if (!activeUpload || !activeInsights) {
    return (
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 mt-6 shadow-xl">
        <p className="text-lg">No active insights available.</p>
        <p className="text-sm mt-1 text-slate-500">Select an uploaded dataset to view quality metrics and chat with the AI.</p>
      </div>
    );
  }

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
    setChatHistory((prev) => [...prev, userMessage]);
    const currentQuery = query;
    setQuery("");
    setQueryLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://127.0.0.1:8000/uploads/${activeUpload.id}/query`,
        { question: currentQuery },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage = {
        sender: "ai",
        text: response.data.answer,
        chartData: response.data.chart_data,
        xAxis: response.data.x_axis,
        yAxis: response.data.y_axis,
      };

      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to query dataset");
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I encountered an error analyzing that query. Make sure the spelling matches the columns in your dataset exactly.",
        },
      ]);
    } finally {
      setQueryLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-emerald-500 stroke-emerald-500";
    if (score >= 60) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 text-white">
      {/* Metrics Section */}
      <div className={`lg:col-span-1 p-6 rounded-2xl border shadow-xl flex flex-col justify-between ${
        darkMode ? "bg-slate-900/60 border-slate-800/80" : "bg-slate-900 border-slate-950/20"
      }`}>
        <div>
          <h3 className="text-xl font-bold mb-4 tracking-tight">Data Health Index</h3>
          
          {/* Circular Progress Gauge */}
          <div className="flex flex-col items-center py-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  strokeWidth="8"
                  stroke="#1e293b"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  strokeWidth="8"
                  className={getScoreColor(activeInsights.data_quality)}
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - activeInsights.data_quality / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold">{activeInsights.data_quality}%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Health Score</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 mt-6 border-t border-slate-800/80 pt-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Cell Count:</span>
              <span className="font-semibold">
                {(activeInsights.rows * activeInsights.columns).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Missing Values:</span>
              <span className={`font-semibold ${activeInsights.missing_cells > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {activeInsights.missing_cells.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Duplicate Rows:</span>
              <span className={`font-semibold ${activeInsights.duplicate_rows > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {activeInsights.duplicate_rows.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Numeric Columns:</span>
              <span className="font-semibold">{activeInsights.numeric_columns_count}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Categorical Columns:</span>
              <span className="font-semibold">{activeInsights.categorical_columns_count}</span>
            </div>
          </div>
        </div>

        {/* AI Findings List */}
        <div className="mt-8 border-t border-slate-800/80 pt-5 flex-1 overflow-y-auto max-h-[220px]">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI Diagnostics</h4>
          <ul className="space-y-2.5">
            {activeInsights.findings.map((finding, idx) => (
              <li key={idx} className="text-xs flex gap-2.5 text-slate-300">
                <span className="text-slate-500">•</span>
                <span>{finding}</span>
              </li>
            ))}
            {activeInsights.findings.length === 0 && (
              <li className="text-xs text-slate-500 italic">No warnings or flags detected. Clean dataset!</li>
            )}
          </ul>
        </div>
      </div>

      {/* Chat Section */}
      <div className={`lg:col-span-2 rounded-2xl border shadow-xl flex flex-col h-[520px] ${
        darkMode ? "bg-slate-900/60 border-slate-800/80" : "bg-slate-900 border-slate-950/20"
      }`}>
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🤖</span>
            <div>
              <h3 className="text-sm font-bold tracking-tight">DataSight AI Copilot</h3>
              <p className="text-[10px] text-emerald-400">Online • Ready to analyze</p>
            </div>
          </div>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-md ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/40"
              }`}>
                {/* Answer Text */}
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                {/* Inline Chart Result */}
                {msg.chartData && msg.chartData.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/60 w-full h-[160px] bg-slate-900/60 p-2 rounded-lg">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={msg.chartData}>
                        <XAxis dataKey={msg.xAxis} stroke="#64748b" fontSize={9} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #334155",
                            borderRadius: "6px",
                            fontSize: "10px",
                            color: "#f8fafc"
                          }}
                        />
                        <Bar dataKey={msg.yAxis} fill="#3b82f6" radius={[2, 2, 0, 0]}>
                          {msg.chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          ))}
          {queryLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700/40 rounded-2xl rounded-bl-none px-4 py-3 shadow-md flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">AI is analyzing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleQuerySubmit} className="p-4 border-t border-slate-800/80 bg-slate-950/20 flex gap-2">
          <input
            type="text"
            placeholder={`Ask a question about ${activeUpload.filename}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={queryLoading}
            className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={queryLoading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIInsights;