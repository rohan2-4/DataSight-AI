import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(1280);

  function increase() {
    setCount(count + 1);
  }

  const stats = [
    { label: "Datasets Processed", value: "24,800+" },
    { label: "AI Insights Generated", value: "185,000+" },
    { label: "Analytics Charts Rendered", value: "62,400+" },
  ];

  return (
    <section id="counter" className="py-24 bg-white text-center font-sans relative">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-12 tracking-tight">
          Trusted by Data Professionals
        </h2>

        {/* Static Metrics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-sm">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Playful Interactive Counter */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-3xl max-w-xl mx-auto shadow-xl text-white">
          <h3 className="text-lg font-bold mb-2">Try Our Live Sandbox Clicker</h3>
          <p className="text-xs text-slate-400 mb-6">
            Help us reach our processing milestone. Each click simulates a processed query!
          </p>
          <div className="flex flex-col items-center gap-4">
            <span className="text-4xl font-black text-blue-400 tracking-wider">
              {count.toLocaleString()}
            </span>
            <button
              onClick={increase}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              ⚡ Simulate Query
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Counter;