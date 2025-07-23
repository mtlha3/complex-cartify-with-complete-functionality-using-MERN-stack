import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';


const MyOrders = () => {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/order/user`, {
          withCredentials: true, 
        });
        setOrders(response.data); 
      } catch (err) {
        setError('Failed to fetch orders'); 
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false); 
      }
    };

    fetchOrders();
  }, []); 

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-5xl font-bold text-center text-gray-800 mb-12 tracking-wide">
          🛍 Your Orders
        </h2>

        {orders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => (
              <div
                key={order.Id}
                className="relative bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/30 transition-transform transform hover:scale-105"
              >
                {/* Order ID */}
                <h3 className="text-2xl font-bold text-blue-500">
                  Order #{order.Id}
                </h3>

                {/* Status Badge */}
                <p className="mt-2 text-gray-700 flex items-center gap-2">
                  <span className="font-medium text-gray-900">Status:</span>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-xl shadow-sm ${
                      order.status === "Delivered"
                        ? "bg-green-200 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-200 text-yellow-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>

                {/* Total Price */}
                <p className="mt-3 text-gray-900 text-lg font-semibold">
                  💰 Total:{" "}
                  <span className="text-blue-500 text-xl">${order.totalAmount}</span>
                </p>

                {/* Items in Order */}
                <h4 className="mt-4 text-lg font-semibold text-gray-800">
                  🛒 Items:
                </h4>
                <ul className="mt-2 space-y-2">
                  {order.cartItems && order.cartItems.length > 0 ? (
                    order.cartItems.map((item, index) => (
                      <li
                        key={index}
                        className="bg-gray-100 p-3 rounded-lg flex justify-between items-center shadow-sm"
                      >
                        <span className="text-gray-700">
                          {item.name} - {item.quantity}x
                        </span>
                        <span className="text-blue-600 font-bold">${item.price}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">No items in this order.</li>
                  )}
                </ul>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl mt-10">
            😔 You have no orders yet.
          </p>
        )}
      </div>
    </>
  );
};

export default MyOrders;
