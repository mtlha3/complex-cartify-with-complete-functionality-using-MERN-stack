import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


const SellerDashboard = () => {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/product/seller`, {
        withCredentials: true,
      });
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data?.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/order/seller`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data?.message);
    }
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setProduct({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      quantity: prod.quantity,
      image: prod.image,
    });
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
          `${API_URL}/product/edit/${editingProduct.productId}`,
          product,
          { withCredentials: true }
        );
        alert(res.data.message || "Product updated successfully");
      } else {
        const res = await axios.post(
          `${API_URL}/product/add`,
          product,
          { withCredentials: true }
        );
        alert(res.data.message || "Product added successfully");
      }
      setShowPopup(false);
      setEditingProduct(null);
      setProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
        image: "",
      });
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

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmDelete) return;

      await axios.delete(
        `${API_URL}/product/delete/${productToDelete.productId}`,
        { withCredentials: true }
      );

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
        `${API_URL}/order/status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      alert(res.data.message || "Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response?.data?.message
      );
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully!");
      
      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
      toast.error("Logout failed!");
    }
  };

  return (
    <>
      <Toaster />
      <div className="p-6 bg-gradient-to-b from-blue-100 to-blue-300 min-h-screen relative">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
          🛍️ Seller Dashboard
        </h2>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              setShowPopup(true);
              setEditingProduct(null);
              setProduct({ name: "", price: "", quantity: "", image: "" });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            ➕ Add Product
          </button>

          <button
            onClick={() => {
              setShowOrders(!showOrders);
              fetchOrders();
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            📦 View Orders
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            🚪 Logout
          </button>
        </div>

        {/* Product List */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-2xl">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">
            🛒 Your Products
          </h3>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center">No products added yet.</p>
          ) : (
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-300 text-gray-800">
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
                  <tr
                    key={prod._id}
                    className="border-b hover:bg-gray-100 transition-all"
                  >
                    <td className="p-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                      />
                    </td>
                    <td className="p-3 font-medium">{prod.name}</td>
                    <td className="p-3 text-gray-600">{prod.description}</td>
                    <td className="p-3 text-green-600 font-bold">
                      ${prod.price}
                    </td>
                    <td className="p-3">{prod.quantity}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prod.productId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Orders Section */}
        {showOrders && (
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-2xl mt-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">
              📦 Orders
            </h3>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center">
                No orders for your products.
              </p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-300 text-gray-800">
                    <th className="p-3 text-left">Product Name</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Total Price</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) =>
                    order.cartItems.map((item) =>
                      item.sellerId === order.cartItems[0].sellerId ? (
                        <tr
                          key={item.productId}
                          className="border-b hover:bg-gray-100 transition-all"
                        >
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3 text-green-600 font-bold">
                            ${item.totalPrice}
                          </td>
                          <td className="p-3 font-semibold">{order.status}</td>
                          <td className="p-3">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.Id, e.target.value)
                              }
                              className="border p-2 rounded"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Canceled">Canceled</option>
                            </select>
                          </td>
                        </tr>
                      ) : null
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Add/Edit Product Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-2xl font-bold mb-4">
                {editingProduct ? "✏️ Edit Product" : "➕ Add Product"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={product.description}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={product.price}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border p-2 w-full rounded-md"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    {editingProduct ? "Update" : "Submit"}
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerDashboard;
