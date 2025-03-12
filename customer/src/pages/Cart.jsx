import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { removeItem, incrementQuantity, decrementQuantity, addItem, resetCart } from "../features/cartSlice";
import Nav from "../components/Nav";
const Cart = () => {
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
      const response = await axios.get("http://localhost:5000/cart/cart", {
        withCredentials: true,
      });

      dispatch(resetCart());
      response.data.forEach((item) => dispatch(addItem(item)));
    } catch (error) {
      console.error(" Error fetching cart:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [dispatch]);

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete("http://localhost:5000/cart/remove", {
        withCredentials: true,
        data: { productId },
      });
      dispatch(removeItem(productId));
      fetchCart(); 
    } catch (error) {
      console.error("Error removing item from cart:", error.response?.data || error.message);
    }
  };

  const handleIncrementQuantity = async (productId) => {
    dispatch(incrementQuantity(productId)); 
  
    try {
      await axios.put(
        "http://localhost:5000/cart/increment", 
        { productId },
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error("❌ Error incrementing quantity:", error.response?.data || error.message);
    }
  };
  
  const handleDecrementQuantity = async (productId) => {
    dispatch(decrementQuantity(productId));
  
    try {
      await axios.put(
        "http://localhost:5000/cart/decrement",
        { productId },
        { withCredentials: true }
      );
      fetchCart(); 
    } catch (error) {
      console.error("❌ Error decrementing quantity:", error.response?.data || error.message);
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
        "http://localhost:5000/order/place",
        { ...orderDetails, cartItems: cart },
        { withCredentials: true }
      );

      console.log("Order placed successfully:", response.data);
      dispatch(resetCart());
      setShowOrderForm(false);
      alert("Your order has been placed successfully!");
    } catch (error) {
      console.error("❌ Error placing order:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-5">
      <Nav/>
      <h2 className="text-2xl font-bold mb-3">Shopping Cart</h2>

      {loading ? (
        <p className="text-gray-500">Loading cart...</p>
      ) : cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="border p-4 rounded-lg shadow-md">
            {cart.map((item) => (
              <li key={item.productId} className="flex justify-between items-center p-2 border-b">
                <span>{item.name} - ${item.price}</span>
                <div className="flex items-center gap-3">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleDecrementQuantity(item.productId)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleIncrementQuantity(item.productId)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mt-5">Total Price: ${totalPrice.toFixed(2)}</h3>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
            onClick={() => setShowOrderForm(true)}
          >
            Place Order
          </button>

          {showOrderForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h3 className="text-2xl font-bold mb-4">Order Details</h3>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm">Name</label>
                  <input type="text" id="name" name="name" value={orderDetails.name} onChange={handleInputChange} className="border p-2 w-full" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm">Address</label>
                  <textarea id="address" name="address" value={orderDetails.address} onChange={handleInputChange} className="border p-2 w-full" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm">Phone Number</label>
                  <input type="text" id="phone" name="phone" value={orderDetails.phone} onChange={handleInputChange} className="border p-2 w-full" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="block text-sm">Payment Method</label>
                  <select id="paymentMethod" name="paymentMethod" value={orderDetails.paymentMethod} onChange={handleInputChange} className="border p-2 w-full">
                    <option value="COD">Cash on Delivery</option>
                    <option value="CreditCard">Credit Card</option>
                  </select>
                </div>
                <div className="flex justify-between gap-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleSubmitOrder}>Submit Order</button>
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={() => setShowOrderForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
