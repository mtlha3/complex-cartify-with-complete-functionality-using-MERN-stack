import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';

const MyOrders = () => {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/order/user', {
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
    <div>
      <Nav/>
      <h2>Your Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.Id}> {/*orders always has a unique Id */}
            <h3>Order ID: {order.Id}</h3>
            <p>Status: {order.status}</p>
            <p>Total Price: ${order.totalAmount}</p>
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
