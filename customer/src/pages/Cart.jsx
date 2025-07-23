import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import {
  removeItem,
  incrementQuantity,
  decrementQuantity,
  addItem,
  resetCart,
} from "../features/cartSlice";
import Nav from "../components/Nav";
import toast, { Toaster } from "react-hot-toast";
const Cart = () => {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "COD",
  });

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cart/cart`, {
        withCredentials: true,
      });

      dispatch(resetCart());
      response.data.forEach((item) => dispatch(addItem(item)));
    } catch (error) {
      console.error(
        " Error fetching cart:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [dispatch]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`${API_URL}/cart/remove`, {
        withCredentials: true,
        data: { productId },
      });
      dispatch(removeItem(productId));
      fetchCart();
    } catch (error) {
      console.error(
        "Error removing item from cart:",
        error.response?.data || error.message
      );
    }
  };

  const handleIncrementQuantity = async (productId) => {
    dispatch(incrementQuantity(productId));

    try {
      await axios.put(
        `${API_URL}/cart/increment`,
        { productId },
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error(
        "❌ Error incrementing quantity:",
        error.response?.data || error.message
      );
    }
  };

  const handleDecrementQuantity = async (productId) => {
    dispatch(decrementQuantity(productId));

    try {
      await axios.put(
        `${API_URL}/cart/decrement`,
        { productId },
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error(
        "❌ Error decrementing quantity:",
        error.response?.data || error.message
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/order/place`,
        { ...orderDetails, cartItems: cart },
        { withCredentials: true }
      );

      console.log("Order placed successfully:", response.data);
      dispatch(resetCart());
      setShowOrderForm(false);
    } catch (error) {
      console.error(
        "❌ Error placing order:",
        error.response?.data || error.message
      );
    }
  
  };



  return (
    <>
      <Nav />

      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🛒 Shopping Cart
        </h2>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading cart...</p>
        ) : cart.length === 0 ? (
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        ) : (
          <>
            <ul className="bg-white shadow-lg rounded-lg p-5 divide-y">
              {cart.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between items-center py-3"
                >
                  <span className="text-lg font-medium">
                    {item.name} -{" "}
                    <span className="text-green-600">${item.price}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow transition"
                      onClick={() => handleDecrementQuantity(item.productId)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span className="text-lg">{item.quantity}</span>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow transition"
                      onClick={() => handleIncrementQuantity(item.productId)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-2xl font-semibold text-gray-700 mt-6">
              Total:{" "}
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </h3>

            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg mt-5 shadow-lg transition block w-full text-center text-lg"
              onClick={() => setShowOrderForm(true)}
            >
              🛍️ Place Order
            </button>

            {showOrderForm && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 animate-fade-in">
                <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md transition transform scale-95 hover:scale-100">
                  <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    🛍️ Order Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={orderDetails.name}
                        onChange={handleInputChange}
                        className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={orderDetails.address}
                        onChange={handleInputChange}
                        className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={orderDetails.phone}
                        onChange={handleInputChange}
                        className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <select
                        name="paymentMethod"
                        value={orderDetails.paymentMethod}
                        onChange={handleInputChange}
                        className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="COD">Cash on Delivery</option>
                        <option value="CreditCard">Credit Card</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 mt-6">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition w-full text-lg"
                      onClick={() => {
                        handleSubmitOrder();
                        toast.success("🎉 Order placed successfully!");
                        setShowOrderForm(false);
                      }}
                    >
                      ✅ Submit Order
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow transition w-full text-lg"
                      onClick={() => setShowOrderForm(false)}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
