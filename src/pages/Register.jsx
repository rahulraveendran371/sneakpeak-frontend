import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const registerUser = async () => {

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      toast.error("All fields are required");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const nameRegex = /^[A-Za-z ]+$/;

    if (!nameRegex.test(trimmedName)) {
      toast.error("Name should contain only letters");
      return;
    }

    try {

      await api.post("/auth/register", {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword
      });

      toast.success("Registration successful 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message || "Registration failed"
      );

    }

  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1542291026-7eec264c27ff)",
      }}
    >

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative bg-white w-96 p-8 rounded-xl shadow-lg z-10">

        <Link
          to="/"
          className="text-sm text-gray-600 hover:underline block mb-3"
        >
          ← Back to Home
        </Link>

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-3 w-full mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-5 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={registerUser}
          className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}