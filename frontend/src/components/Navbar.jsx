import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="flex justify-between items-center px-10 py-5 shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 font-sans">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
          D
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          DataSight AI
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <ul className="hidden md:flex gap-8 text-slate-600 font-semibold text-sm">
          <li>
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
          </li>
          <li>
            <a href="#features" className="hover:text-blue-600 transition">
              Features
            </a>
          </li>
          <li>
            <a href="#counter" className="hover:text-blue-600 transition">
              Impact
            </a>
          </li>
        </ul>

        {token ? (
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
          >
            Dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-slate-650 hover:text-blue-600 text-xs font-bold transition px-3 py-2 cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;