import { Link } from "react-router-dom";

function Hero() {
  const token = localStorage.getItem("token");

  return (
    <section className="min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white text-center p-6 relative overflow-hidden font-sans">
      {/* Background blobs for premium feel */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl px-6 relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Transform Business Data into{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Actionable Insights
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-slate-550 mt-6 max-w-2xl mx-auto leading-relaxed">
          Upload your spreadsheets, build interactive visualizations, and chat with an AI copilot to discover hidden patterns in seconds.
        </p>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to={token ? "/dashboard" : "/register"}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition cursor-pointer text-sm"
          >
            {token ? "Go to Dashboard" : "Get Started Free"}
          </Link>
          <a
            href="#features"
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-7 py-3.5 rounded-xl border border-slate-200 shadow-sm transition cursor-pointer text-sm"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;