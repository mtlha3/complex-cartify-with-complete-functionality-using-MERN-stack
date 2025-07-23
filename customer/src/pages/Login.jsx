import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import toast from "react-hot-toast";
import { API_URL } from "../config";

const Login = () => {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    toast.loading("Logging in...");

    try {
      await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.dismiss();
      toast.success("Login successful! 🎉");
      navigate("/");
    } catch (error) {
      toast.dismiss();
      toast.error("Invalid email or password ❌");
    }
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat relative" 
      style={{ backgroundImage: "url('Ecommerce-image.png')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96 border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">
          Welcome Back! 🚀
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md bg-white/30 text-white placeholder-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md bg-white/30 text-white placeholder-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 rounded-xl hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            onClick={() => setIsForgotPasswordOpen(true)} 
            className="text-white hover:underline"
          >
            Forgot Password?
          </button>
          <p className="text-white mt-3">
            Don't have an account? 
            <span 
              onClick={() => navigate('/signup')} 
              className="text-blue-400 cursor-pointer hover:underline ml-1"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>

      {isForgotPasswordOpen && (
        <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />
      )}
    </div>
  );
};

export default Login;
