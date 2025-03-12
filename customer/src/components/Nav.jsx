import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/status", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Cartify
      </Link>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/orders" className="hover:underline">
              My Orders
            </Link>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-green-500 px-4 py-2 rounded-lg">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
