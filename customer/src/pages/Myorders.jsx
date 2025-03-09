import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // Store orders here
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for handling failed API calls

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Make a GET request to fetch the orders for the authenticated user
        const response = await axios.get('http://localhost:5000/order/user', {
          withCredentials: true, // Ensures token is sent automatically with request
        });
        setOrders(response.data); // Set the orders data in the state
      } catch (err) {
        setError('Failed to fetch orders'); // Handle error state
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false); // Set loading to false once the API call is complete
      }
    };

    fetchOrders();
  }, []); // Empty dependency array means this effect will run only once when the component mounts

  // If orders are loading, show a loading message
  if (loading) {
    return <div>Loading orders...</div>;
  }

  // If there's an error, show the error message
  if (error) {
    return <div>{error}</div>;
  }

  // If no orders are found, show a message
  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <h2>Your Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.Id}> {/* Assuming each order has a unique Id */}
            <h3>Order ID: {order.Id}</h3>
            <p>Status: {order.status}</p>
            <p>Total Price: ${order.totalAmount}</p> {/* Corrected to `totalAmount` */}
            <ul>
              {order.cartItems && order.cartItems.length > 0 ? (
                order.cartItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} x ${item.price}
                  </li>
                ))
              ) : (
                <li>No items in this order.</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyOrders;
