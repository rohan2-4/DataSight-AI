import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { useState, useEffect } from "react";
import RecentUploads from "../components/RecentUploads";
import ActivityFeed from "../components/ActivityFeed";
import UploadSection from "../components/UploadSection";
import AnalyticsChart from "../components/AnalyticsChart";
import CsvPreview from "../components/CsvPreview";
import AIInsights from "../components/AIInsights";
import axios from "axios";
function Dashboard() {



const [uploads, setUploads] = useState(() => {
  const savedUploads = localStorage.getItem("uploads");

  if (savedUploads) {
    return JSON.parse(savedUploads);
  }

  return [
    {
      file: "sales.csv",
      size: "2 MB",
      status: "Uploaded",
      date: "2026-07-01T10:00:00.000Z",
    },
    {
      file: "customers.xlsx",
      size: "5 MB",
      status: "Uploaded",
      date: "2026-07-01T10:00:00.000Z",
    },
  ];
});
const fetchUploads = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/uploads"
    );

    console.log("Uploads: " ,response.data);

    setUploads(response.data);

  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
    fetchUploads();
}, []);
const [csvData, setCsvData] = useState([]);
const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    console.log("Dashboard Loaded Successfully");
    console.log(csvData);
    
  },[csvData] );
  useEffect(() => {
  localStorage.setItem(
    "uploads",
    JSON.stringify(uploads)
  );
}, [uploads]);

    const stats = [
      { title: "Datasets", value: uploads.length },
      { title: "Reports", value: 45 },
      { title: "Users", value: 1250 },
      { title: "AI Insights", value: 60 },
      { title: "Storage Used", value: "10 GB" },
      { title: "Uploads Today", value:uploads.length },
      { title: "Accuracy", value: "98%" },
    ];



  return (
    <div className={darkMode ? "flex bg-gray-900 ": "flex"}>

      <Sidebar />

      <div className={darkMode ?  "flex-1 bg-gray-800 min-h-screen p-8 text-white"
                  : "flex-1 bg-slate-100 min-h-screen p-8"}>

  <h1 className="text-4xl font-bold mb-8">
    Welcome, Rohan 👋
  </h1>

  {/* Statistics Cards */}
  <div className="grid grid-cols-3 gap-6">
    {stats.map((stat, index) => (
      <StatCard
        key={index}
        title={stat.title}
        value={stat.value}
      />
    ))}
  </div>

  {/* Analytics Chart */}
  <AnalyticsChart 
    uploads={uploads}  
  />

  {/* Upload Section */}
  <UploadSection 
    uploads={uploads}
    setUploads={setUploads}
    csvData={csvData}
    setCsvData={setCsvData}
  />

  {/* Recent Uploads */}
  <RecentUploads 
    uploads={uploads}
    setUploads={setUploads}
    darkmode={darkMode}
  />

  {/* Activity Feed */}
  <ActivityFeed />
<button
  onClick={() => setDarkMode(!darkMode)}
  className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
>
  {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>
<CsvPreview
  csvData={csvData}
  />
<AIInsights
   uploads={uploads}
   csvData={csvData}
   darkMode={darkMode}
   />
</div>

    </div>
  );
}

export default Dashboard;