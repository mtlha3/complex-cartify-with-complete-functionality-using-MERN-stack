import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { addItem } from "../features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Products = () => {
  const { storeId } = useParams();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/product/store/${storeId}`);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [storeId]);

  const addToCart = async (product) => {
    const cartItem = {
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity: 1,
      sellerId: storeId
    };

    console.log("Sending to backend:", cartItem);

    try {
      const response = await axios.post(
        "http://localhost:5000/cart/add",
        cartItem,
        { withCredentials: true }
      );

      console.log("Cart updated:", response.data);
      dispatch(addItem({ id: product.id, name: product.name, price: product.price }));
    } catch (error) {
      console.error("Error adding to cart:", error.response ? error.response.data : error.message);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto p-6">
      <nav className="mb-5 flex gap-4">
        <Link to="/" className="text-blue-500">Home</Link>
        <Link to="/cart" className="text-blue-500">Cart ({cart.length})</Link>
      </nav>

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Store Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openModal(product)} 
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
              <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600">Description: {product.description}</p>
              <p className="text-gray-600">Price: ${product.price}</p>
              <button
                className={`px-4 py-2 rounded-lg mt-2 ${product.quantity > 0
                    ? "bg-blue-500 text-white"
                    : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                onClick={(e) => {
                  e.stopPropagation(); 
                  addToCart(product);
                }}
                disabled={product.quantity === 0}
              >
                {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available for this store.</p>
        )}
      </div>

      {/* Modal for Product Details */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-500 text-xl font-bold"
            >
              X
            </button>
            <div className="flex">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-1/2 h-64 object-cover rounded" />
              <div className="ml-6">
                <h2 className="text-2xl font-semibold">{selectedProduct.name}</h2>
                <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
                <p className="text-gray-600 mt-2">Price: ${selectedProduct.price}</p>
                <button
                  className={`px-4 py-2 rounded-lg mt-4 ${selectedProduct.quantity > 0
                      ? "bg-blue-500 text-white"
                      : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                  onClick={() => selectedProduct.quantity > 0 && addToCart(selectedProduct)}
                  disabled={selectedProduct.quantity === 0}
                >
                  {selectedProduct.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
