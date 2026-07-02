function FeatureCard({ title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
      <h3 className="text-xl font-bold text-blue-600 mb-3">
        {title}
      </h3>

      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;