import FeatureCard from "./FeatureCard";

function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50 border-t border-b border-slate-100 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Instant Discovery
          </h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            DataSight AI streamlines your analytical workflow, turning raw tabular files into interactive tools without coding.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Secure Data Importer"
            description="Drag and drop CSV or Excel files. We safely parse and store your datasets on disk, linking them securely to your user profile."
          />

          <FeatureCard
            title="Interactive Custom Charts"
            description="Instantly build Bar, Line, Area, Scatter, and Pie charts. Swap axes dynamically to visualize key trends."
          />

          <FeatureCard
            title="AI Copilot Q&A"
            description="Ask natural questions like 'average sales by region' or 'describe columns'. Receive immediate statistical summaries and inline charts."
          />
        </div>
      </div>
    </section>
  );
}

export default Features;