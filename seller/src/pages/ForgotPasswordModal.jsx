import { useState } from "react";
import axios from "axios";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );
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
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, password }
      );
      setMessage(response.data.message);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-white/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 relative transform transition-all scale-95 hover:scale-100 border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          {step === 1
            ? "🔑 Forgot Password"
            : step === 2
            ? "🔍 Verify OTP"
            : "🔒 Reset Password"}
        </h2>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <div className="space-y-5">
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="📧 Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                required
              />
              <button
                onClick={handleSendOTP}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-lg"
              >
                🚀 Send OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="🔢 Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                required
              />
              <button
                onClick={handleVerifyOTP}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-lg"
              >
                ✅ Verify OTP
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="🔒 New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                required
              />
              <input
                type="password"
                placeholder="🔒 Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                required
              />
              <button
                onClick={handleResetPassword}
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-lg"
              >
                🔄 Reset Password
              </button>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full text-center text-red-500 font-medium hover:underline text-sm transition-all hover:scale-105"
        >
          ❌ Close
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
