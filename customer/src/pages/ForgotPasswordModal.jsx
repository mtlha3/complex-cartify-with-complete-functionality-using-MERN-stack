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
      const response = await axios.post("http://localhost:5000/auth/forgot-password", { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/verify-otp", { email, otp });
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
      const response = await axios.post("http://localhost:5000/auth/reset-password", { email, password });
      setMessage(response.data.message);
      onClose(); 
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ${isOpen ? "" : "hidden"}`}>
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold text-center mb-4">
          {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
        </h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button onClick={handleSendOTP} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
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
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button onClick={handleVerifyOTP} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
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
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button onClick={handleResetPassword} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
              Reset Password
            </button>
          </div>
        )}

        <button onClick={onClose} className="mt-4 text-red-500 hover:underline text-sm w-full text-center">
          Close
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
