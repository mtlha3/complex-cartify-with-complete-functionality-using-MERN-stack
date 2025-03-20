import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";


const Signup = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [Storename, setStorename] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null); 
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        { Storename, email, password, image }, 
        { withCredentials: true }
      );

      toast.success("Signup successful! Please log in.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
      console.error(error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); 
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
  className="flex justify-center items-center min-h-screen bg-cover bg-center px-4"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80')",
  }}
>
  <div className="bg-white/30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-[420px] border border-gray-200 transition-all hover:scale-105">
    <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
      🏪 Seller Sign Up
    </h2>
    <p className="text-center text-gray-700 mb-6 text-lg">
      Create your store and start selling today!
    </p>

    <form onSubmit={handleSignup} className="space-y-6">
      <div>
        <input
          type="text"
          placeholder="Store Name"
          value={Storename}
          onChange={(e) => setStorename(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          required
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-800 mb-2">
          Upload Store Image
        </label>
        <div className="relative flex items-center justify-center w-full border border-gray-300 rounded-xl bg-gray-100 p-3 cursor-pointer hover:bg-gray-200 transition">
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            aria-label="Upload store image"
          />
          <span className="text-gray-600">📷 Choose Image</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all font-semibold text-lg"
      >
        🚀 Sign Up
      </button>
    </form>

    <p className="text-center text-gray-800 mt-5">
      Already have an account?{" "}
      <a href="/login" className="text-blue-600 font-medium hover:underline transition-all hover:scale-105">
        Log in
      </a>
    </p>
  </div>
</div>

  
  );
};

export default Signup;
