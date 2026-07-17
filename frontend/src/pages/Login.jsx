import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Create url encoded form body for OAuth2 Password Bearer flow
      const params = new URLSearchParams();
      params.append("username", email); // OAuth2 expects 'username' which maps to email
      params.append("password", password);

      const response = await axios.post("http://127.0.0.1:8000/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Save token to localStorage
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("userEmail", email);

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || "Invalid email or password";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md text-white">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            DataSight AI
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Sign in to access your business intelligence dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
            <a href="#" className="text-slate-400 hover:text-white transition">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/30 hover:shadow-blue-900/40 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-6 border-t border-slate-700/50 pt-5">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold underline decoration-2 underline-offset-4"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
