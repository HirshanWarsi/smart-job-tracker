import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Smart Job Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your applications smarter 🚀
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email address"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}