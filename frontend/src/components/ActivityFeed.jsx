function ActivityFeed() {

  const activities = [
    {
      icon: "✅",
      message: "sales.csv uploaded",
    },
    {
      icon: "📊",
      message: "Report generated",
    },
    {
      icon: "👤",
      message: "New user registered",
    },
    {
      icon: "🤖",
      message: "AI Insights completed",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-bold mb-4">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="flex items-center gap-3 border-b pb-3"
          >

            <span className="text-2xl">
              {activity.icon}
            </span>

            <p>
              {activity.message}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ActivityFeed;