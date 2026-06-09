import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) return toast.error("All fields are required");
    if (!validateEmail(email)) return toast.error("Please enter a valid email");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });

      if (!data?.token || !data?.user) throw new Error("Invalid server response");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("user-changed"));

      toast.success("Login successful!");
      navigate(data.user?.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-4"
      style={{ background: "#111" }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1542291026-7eec264c27ff)",
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">

        {/* Top dark section */}
        <div className="bg-black px-8 pt-8 pb-7 text-center">
          {/* Logo box */}
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-white/50">Sign in to your SneakPeak account</p>
        </div>

        {/* Form section */}
        <div className="px-8 py-7">
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email field */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Email address
              </label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-3 text-gray-400 text-base" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 transition"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3 text-gray-400 text-base" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 mt-2"
            >
              <FiArrowRight />
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-gray-100" />
            <span className="text-xs text-gray-400">Don&apos;t have an account?</span>
            <hr className="flex-1 border-gray-100" />
          </div>

          <p className="text-center text-sm text-gray-500">
            New here?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}