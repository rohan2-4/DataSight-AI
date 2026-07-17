import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import RecentUploads from "../components/RecentUploads";
import ActivityFeed from "../components/ActivityFeed";
import UploadSection from "../components/UploadSection";
import AnalyticsChart from "../components/AnalyticsChart";
import CsvPreview from "../components/CsvPreview";
import AIInsights from "../components/AIInsights";
import Visualizer from "../components/Visualizer";

function Dashboard() {
  const [uploads, setUploads] = useState([]);
  const [activeUpload, setActiveUpload] = useState(null);
  const [activeData, setActiveData] = useState(null);
  const [activeInsights, setActiveInsights] = useState(null);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(true); // default to sleek dark mode
  const [userEmail, setUserEmail] = useState("");
  const [activities, setActivities] = useState([]);

  const navigate = useNavigate();

  const logActivity = (icon, message) => {
    setActivities((prev) => [
      { icon, message, date: new Date().toISOString() },
      ...prev,
    ]);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchUploads = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/uploads", getAuthHeader());
      setUploads(response.data);
      
      // Auto-select first upload if none active
      if (response.data.length > 0 && !activeUpload) {
        handleSelectUpload(response.data[0]);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
        toast.error("Your session expired. Please log in again.");
      }
    }
  };

  const handleSelectUpload = async (upload) => {
    setActiveUpload(upload);
    const headers = getAuthHeader();

    try {
      const dataRes = await axios.get(`http://127.0.0.1:8000/uploads/${upload.id}/data`, headers);
      setActiveData(dataRes.data);

      const insightsRes = await axios.get(`http://127.0.0.1:8000/uploads/${upload.id}/insights`, headers);
      setActiveInsights(insightsRes.data);

      logActivity("🔍", `Activated dataset: "${upload.filename}"`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load details for this dataset.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const email = localStorage.getItem("userEmail");
    setUserEmail(email || "");

    setActivities([
      { icon: "🚀", message: "DataSight AI session started.", date: new Date().toISOString() }
    ]);

    fetchUploads();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const calculateTotalStorage = () => {
    let totalKb = 0;
    uploads.forEach((up) => {
      const sizeStr = up.size || "";
      const val = parseFloat(sizeStr) || 0;
      if (sizeStr.includes("MB")) {
        totalKb += val * 1024;
      } else {
        totalKb += val;
      }
    });
    if (totalKb >= 1024) return `${(totalKb / 1024).toFixed(2)} MB`;
    return `${totalKb.toFixed(2)} KB`;
  };

  const stats = [
    { title: "Total Datasets", value: uploads.length },
    { title: "Total Rows Count", value: uploads.reduce((acc, u) => acc + (u.rows || 0), 0).toLocaleString() },
    { title: "Active Dataset", value: activeUpload ? activeUpload.filename : "None Selected" },
    { title: "Health Index", value: activeInsights ? `${activeInsights.data_quality}%` : "N/A" },
    { title: "Storage Space", value: calculateTotalStorage() },
  ];

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-250 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 p-8 overflow-y-auto h-screen max-w-7xl mx-auto w-full">
        {/* Workspace Top Bar */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-900/40 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {activeTab === "overview" && "Workspace Overview"}
              {activeTab === "upload" && "Dataset Importer"}
              {activeTab === "preview" && "Dataset Grid Explorer"}
              {activeTab === "visualizer" && "Custom Chart Builder"}
              {activeTab === "insights" && "AI Insights Dashboard"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Welcome back, <span className="text-blue-500 font-semibold">{userEmail.split("@")[0]}</span> • DataSight BI engine is ready.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeUpload && (
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                darkMode ? "bg-slate-900/60 border-slate-800/80 text-slate-300" : "bg-white border-slate-100 text-slate-700"
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Workspace: {activeUpload.filename}</span>
              </div>
            )}
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer hover:shadow-lg transition ${
                darkMode ? "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900" : "bg-white border-slate-150 hover:bg-slate-50"
              }`}
              title="Toggle theme"
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </header>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.map((stat, idx) => (
                <StatCard
                  key={idx}
                  title={stat.title}
                  value={stat.value}
                  darkMode={darkMode}
                />
              ))}
            </div>

            {/* Dynamic Comparison Chart */}
            <AnalyticsChart uploads={uploads} darkMode={darkMode} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Uploads Manager */}
              <div className="lg:col-span-2">
                <RecentUploads
                  uploads={uploads}
                  setUploads={setUploads}
                  activeUploadId={activeUpload ? activeUpload.id : null}
                  onSelectUpload={handleSelectUpload}
                  darkMode={darkMode}
                />
              </div>

              {/* Real-time Activity Logs */}
              <div className="lg:col-span-1">
                <ActivityFeed activities={activities} darkMode={darkMode} />
              </div>
            </div>
          </div>
        )}

        {/* Upload Dataset Tab */}
        {activeTab === "upload" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <UploadSection
              setUploads={setUploads}
              onSelectUpload={(up) => {
                handleSelectUpload(up);
                setActiveTab("overview"); // redirect to main view
              }}
              darkMode={darkMode}
            />
            
            <RecentUploads
              uploads={uploads}
              setUploads={setUploads}
              activeUploadId={activeUpload ? activeUpload.id : null}
              onSelectUpload={handleSelectUpload}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* Spreadsheet Data Grid Preview */}
        {activeTab === "preview" && (
          <div className="animate-fadeIn">
            <CsvPreview activeData={activeData} darkMode={darkMode} />
          </div>
        )}

        {/* Analytics Visualizer Builder */}
        {activeTab === "visualizer" && (
          <div className="animate-fadeIn">
            <Visualizer activeData={activeData} />
          </div>
        )}

        {/* AI Copilot & Quality Insights */}
        {activeTab === "insights" && (
          <div className="animate-fadeIn">
            <AIInsights
              activeUpload={activeUpload}
              activeInsights={activeInsights}
              darkMode={darkMode}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;