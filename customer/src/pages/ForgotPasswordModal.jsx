import { useState } from "react";
import axios from "axios";


const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  console.log("Modal isOpen:", isOpen);
  

  const handleSendOTP = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
      setMessage(response.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { email, password });
      setMessage(response.data.message);
      onClose(); 
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300 ${
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    } z-50`}
>
  <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-96 border border-white/20 relative">
  
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-white hover:text-red-400 transition"
    >
      ✖
    </button>

    <h2 className="text-2xl font-bold text-center text-white mb-4">
      {step === 1
        ? "Forgot Password 🔑"
        : step === 2
        ? "Verify OTP 📩"
        : "Reset Password 🔒"}
    </h2>

    {message && <p className="text-green-400 text-center">{message}</p>}
    {error && <p className="text-red-400 text-center">{error}</p>}

    {step === 1 && (
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-white/20 border border-white/30 text-white rounded-md placeholder-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
        <button
          onClick={handleSendOTP}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition"
        >
          Send OTP
        </button>
      </div>
    )}

    {step === 2 && (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 bg-white/20 border border-white/30 text-white rounded-md placeholder-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
        <button
          onClick={handleVerifyOTP}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition"
        >
          Verify OTP
        </button>
      </div>
    )}

    {step === 3 && (
      <div className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-white/20 border border-white/30 text-white rounded-md placeholder-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 bg-white/20 border border-white/30 text-white rounded-md placeholder-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
        <button
          onClick={handleResetPassword}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition"
        >
          Reset Password
        </button>
      </div>
    )}

    <button
      onClick={onClose}
      className="mt-4 text-white text-sm hover:underline block text-center"
    >
      Cancel & Return
    </button>
  </div>
</div>
  );
};

export default ForgotPasswordModal;
