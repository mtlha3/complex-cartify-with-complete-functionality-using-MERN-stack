import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [showPopup, setShowPopup] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [product, setProduct] = useState({ name: "", description:"", price: "", quantity: "", image: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/product/seller", { withCredentials: true });
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data?.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/order/seller", { withCredentials: true });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data?.message);
    }
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setProduct({ name: prod.name, description: prod.description ,price: prod.price, quantity: prod.quantity, image: prod.image });
    setShowPopup(true);
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct({ ...product, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await axios.put(
          `http://localhost:5000/product/edit/${editingProduct.productId}`,
          product,
          { withCredentials: true }
        );
        alert(res.data.message || "Product updated successfully");
      } else {
        const res = await axios.post(
          "http://localhost:5000/product/add",
          product,
          { withCredentials: true }
        );
        alert(res.data.message || "Product added successfully");
      }
      setShowPopup(false);
      setEditingProduct(null);
      setProduct({ name: "", description:"" ,price: "", quantity: "", image: "" });
      fetchProducts();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    try {
      const productToDelete = products.find((p) => p.productId === id);

      if (!productToDelete) {
        alert("Product not found!");
        return;
      }

      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/product/delete/${productToDelete.productId}`, { withCredentials: true });

      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error.response?.data?.message);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/order/status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      alert(res.data.message || "Order status updated successfully");
      fetchOrders(); 
    } catch (error) {
      console.error("Error updating order status:", error.response?.data?.message);
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Seller Dashboard</h2>
      <div className="flex justify-end mb-4">
        <button onClick={() => { setShowPopup(true); setEditingProduct(null); setProduct({ name: "", price: "", quantity: "", image: "" }); }} className="bg-blue-500 text-white px-4 py-2 rounded shadow">
          Add Product
        </button>
        <button onClick={() => { setShowOrders(!showOrders); fetchOrders(); }} className="bg-green-500 text-white px-4 py-2 rounded shadow ml-2">
          Orders
        </button>
      </div>

      {/* Product List */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Your Products</h3>
        {products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id} className="border-b">
                  <td className="p-3">
                    <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded" />
                  </td>
                  <td className="p-3">{prod.name}</td>
                  <td className="p-3">{prod.description}</td>
                  <td className="p-3">${prod.price}</td>
                  <td className="p-3">{prod.quantity}</td>
                  <td className="p-3">
                    <button onClick={() => handleEdit(prod)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(prod.productId)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Orders List */}
      {showOrders && (
        <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-bold mb-4">Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders for your products.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">Product Name</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Total Price</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  order.cartItems.map((item) => (
                    item.sellerId === order.cartItems[0].sellerId && (
                      <tr key={item.productId} className="border-b">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">${item.totalPrice}</td>
                        <td className="p-3">{order.status}</td>
                        <td className="p-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.Id, e.target.value)}
                            className="border p-2 rounded"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Canceled">Canceled</option>
                          </select>
                        </td>
                      </tr>
                    )
                  ))
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add/Edit Product Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
                className="border p-2 mb-2 w-full rounded"
                required
              />
                            <input
                type="text"
                name="description"
                placeholder="Description"
                value={product.description}
                onChange={handleChange}
                className="border p-2 mb-2 w-full rounded"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={product.price}
                onChange={handleChange}
                className="border p-2 mb-2 w-full rounded"
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={product.quantity}
                onChange={handleChange}
                className="border p-2 mb-2 w-full rounded"
                required
              />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 mb-2 w-full rounded" />
              <div className="flex justify-end">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                  {editingProduct ? "Update" : "Submit"}
                </button>
                <button onClick={() => { setShowPopup(false); setEditingProduct(null); }} className="bg-red-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
