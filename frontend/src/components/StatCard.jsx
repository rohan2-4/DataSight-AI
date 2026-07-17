function StatCard({ title, value, darkMode }) {
  return (
    <div className={`p-6 rounded-2xl border shadow-xl transition-all duration-200 hover:-translate-y-0.5 ${
      darkMode
        ? "bg-slate-900/60 border-slate-800/80 text-white"
        : "bg-white border-slate-100 text-slate-800"
    }`}>
      <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  );
}

export default StatCard;