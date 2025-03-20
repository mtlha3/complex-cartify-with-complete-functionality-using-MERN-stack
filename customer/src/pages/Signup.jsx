import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        {name, email, password}, 
        { withCredentials: true }
      );

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed.");
      console.error(error);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600">
    <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 border border-white/40">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Sign Up</h2>
  
      <form onSubmit={handleSignup} className="space-y-5">
        <input
          type="text"
          placeholder="Username "
          value={name}
          onChange={(e) => setname(e.target.value)}
          className="w-full p-3 bg-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/80 transition duration-300"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/80 transition duration-300"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/80 transition duration-300"
          required
        />
  
        <button
          type="submit"
          className="w-full bg-white text-blue-600 p-3 rounded-lg font-semibold hover:bg-blue-100 transition duration-300"
        >
          Sign Up
        </button>
      </form>
  
      <p className="mt-4 text-white text-sm text-center">
        Already have an account?{" "}
        <a href="/login" className="font-bold underline hover:text-white/90">
          Login
        </a>
      </p>
    </div>
  </div>
  
  );
};

export default Signup;
