function Sidebar({ activeTab, setActiveTab, userEmail, onLogout }) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "upload", label: "Upload Dataset", icon: "📥" },
    { id: "preview", label: "Data Preview", icon: "🔍" },
    { id: "visualizer", label: "Analytics Builder", icon: "📈" },
    { id: "insights", label: "AI Insights", icon: "🤖" },
  ];

  return (
    <div className="w-64 min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between border-r border-slate-800/60 font-sans">
      <div className="p-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/30">
            D
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            DataSight AI
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-900/80 bg-slate-900/40">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/40">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-300 truncate">
              {userEmail ? userEmail.split("@")[0] : "User"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{userEmail || "user@datasight.ai"}</p>
          </div>
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            ❌
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;