import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();   // prevent page reload

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("All fields are required");
      return;
    }

    try {

      const res = await api.post("/auth/login", {
        email: trimmedEmail,
        password: trimmedPassword
      });

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // notify contexts
      window.dispatchEvent(new Event("user-changed"));

      toast.success("Login successful 🎉");

      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message || "Invalid email or password"
      );

    }

  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1542291026-7eec264c27ff)",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative bg-white p-8 rounded-lg shadow-xl w-96 z-10">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        {/* FORM */}
        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Login
          </button>

        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}