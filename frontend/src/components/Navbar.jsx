function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 shadow-sm bg-white">
      <h1 className="text-2xl font-bold text-blue-600">
        DataSight AI
      </h1>

      <ul className="flex gap-8 text-gray-700 font-medium">
        <li className="cursor-pointer hover:text-blue-600">Home</li>
        <li className="cursor-pointer hover:text-blue-600">Features</li>
        <li className="cursor-pointer hover:text-blue-600">About</li>
        <li className="cursor-pointer hover:text-blue-600">Login</li>
      </ul>
    </nav>
  );
}

export default Navbar;