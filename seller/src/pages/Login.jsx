import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const Login = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success("Login successful!");
      navigate("/sdashboard");
    } catch (error) {
      toast.error("Invalid credentials");
      console.error(error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: forgotEmail,
      });
      toast.success("Password reset link sent!");
      setIsForgotPasswordOpen(false);
      setForgotEmail(""); 
    } catch (error) {
      toast.error("Failed to send reset link.");
      console.error(error);
    }
  };

  return (
    <>
      <Toaster />
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80')",
        }}
      >
        {/* Login Form */}
        <div className="bg-white/60 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-[420px] border border-gray-300 transition-all hover:scale-105">
          <h2 className="text-3xl font-bold text-center mb-5 text-gray-900">
            🚀 Welcome Back
          </h2>
          <p className="text-center text-gray-700 mb-6 text-lg">
            Login to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all font-semibold text-lg"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-5 space-y-3">
            <button
              onClick={() => setIsForgotPasswordOpen(true)}
              className="text-blue-600 font-medium hover:underline transition-all hover:scale-105"
            >
              Forgot Password?
            </button>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 font-medium hover:underline transition-all hover:scale-105"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] border border-gray-300">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                🔑 Forgot Password
              </h2>
              <p className="text-center text-gray-700 mb-6">
                Enter your email to receive a reset link
              </p>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="text-center mt-5">
                <button
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="text-gray-500 font-medium hover:underline transition-all hover:scale-105"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
