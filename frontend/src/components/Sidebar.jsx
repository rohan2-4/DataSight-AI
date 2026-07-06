function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-8">
        DataSight AI
      </h1>

      <ul className="space-y-5">

        <li className="hover:text-blue-400 cursor-pointer">
          Dashboard
        </li>

        <li className="hover:text-blue-400 cursor-pointer">
          Upload Dataset
        </li>

        <li className="hover:text-blue-400 cursor-pointer">
          Analytics
        </li>

        <li className="hover:text-blue-400 cursor-pointer">
          Reports
        </li>

        <li className="hover:text-blue-400 cursor-pointer">
          Settings
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;