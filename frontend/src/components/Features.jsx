import FeatureCard from "./FeatureCard";

function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <FeatureCard
            title="Upload Datasets"
            description="Upload CSV and Excel files securely."
          />

          <FeatureCard
            title="Interactive Dashboard"
            description="View charts, KPIs and analytics."
          />

          <FeatureCard
            title="AI Insights"
            description="Automatically generate business insights."
          />

        </div>

      </div>
    </section>
  );
}

export default Features;