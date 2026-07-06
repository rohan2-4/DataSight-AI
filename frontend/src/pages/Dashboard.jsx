import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { useState, useEffect } from "react";
import RecentUploads from "../components/RecentUploads";
import ActivityFeed from "../components/ActivityFeed";
import UploadSection from "../components/UploadSection";
import AnalyticsChart from "../components/AnalyticsChart";
function Dashboard() {

  const [stats, setStats] = useState([]);

  useEffect(() => {
    console.log("Dashboard Loaded Successfully");

    const dashboardData = [
      { title: "Datasets", value: 120 },
      { title: "Reports", value: 45 },
      { title: "Users", value: 1250 },
      { title: "AI Insights", value: 60 },
      { title: "Storage Used", value: "10 GB" },
      { title: "Uploads Today", value: 10 },
      { title: "Accuracy", value: "98%" },
    ];

    setStats(dashboardData);

  }, []);

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen p-8">

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
  <AnalyticsChart />

  {/* Upload Section */}
  <UploadSection />

  {/* Recent Uploads */}
  <RecentUploads />

  {/* Activity Feed */}
  <ActivityFeed />

</div>

    </div>
  );
}

export default Dashboard;