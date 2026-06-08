import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

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
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/auth/register", {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      alert("Registration successful! 🎉");
      navigate("/login");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed.";
      alert("Error: " + errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-96 p-8 rounded-xl shadow-lg">
        <Link to="/" className="text-sm text-gray-600 underline mb-4 block">← Back</Link>
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <input className="border p-3 w-full mb-3 rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-3 w-full mb-3 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-3 w-full mb-5 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={registerUser} className="w-full bg-black text-white py-3 rounded">Register</button>
      </div>
    </div>
  );
} // <--- ഈ ബ്രേസ് (brace) ആയിരുന്നു മിസ്സിംഗ്!