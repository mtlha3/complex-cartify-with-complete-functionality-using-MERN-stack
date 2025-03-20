import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const responses = await axios.get("http://localhost:5000/auth/status", {
          withCredentials: true,
        });
        setIsAuthenticated(responses.data.isAuthenticated);
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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-5 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-3xl font-bold tracking-wide hover:text-gray-300 transition">
        Cartify
      </Link>

      <div className="flex items-center space-x-8">
        {isAuthenticated ? (
          <>
            <Link to="/orders" className="text-lg hover:text-gray-300 transition">
              My Orders
            </Link>
            <Link to="/cart" className="relative flex items-center">
              <FaShoppingCart className="text-2xl hover:text-gray-300 transition" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-full transition font-semibold shadow-md"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full transition font-semibold shadow-md"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
