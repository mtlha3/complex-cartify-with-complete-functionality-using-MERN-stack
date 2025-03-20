import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { addItem } from "../features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Nav from "../components/Nav";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { API_URL } from "../config";

const Products = () => {
  const { storeId } = useParams();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/store/${storeId}`);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/status`, { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    fetchProducts();
    checkAuth();
  }, [storeId]);

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (product.quantity === 0) return; 

    const cartItem = {
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity: 1,
      sellerId: storeId,
    };

    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
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
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Nav />
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
        Store Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-500"
              onClick={() => openModal(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-3 text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-600 mt-1 text-sm">{product.description}</p>
              <p className="text-blue-600 font-bold mt-2 text-lg">
                ${product.price}
              </p>
              <button
                className={`w-full px-4 py-2 rounded-lg mt-3 font-medium transition-all duration-300 ${
                  product.quantity > 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.quantity > 0) {
                    addToCart(product);
                    toast.success(`${product.name} added to cart! 🛒`);
                  } else {
                    toast.error(`${product.name} is out of stock! ❌`);
                  }
                }}
                disabled={product.quantity === 0}
              >
                {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No products available for this store.
          </p>
        )}
      </div>

      {/* Modal for Product Details */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 max-w-4xl relative shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-600 text-2xl font-bold hover:text-red-700 transition"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row items-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md"
              />
              <div className="md:ml-6 mt-4 md:mt-0">
                <h2 className="text-3xl font-bold text-gray-800">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 mt-2 text-lg">{selectedProduct.description}</p>
                <p className="text-blue-600 font-semibold mt-2 text-2xl">
                  ${selectedProduct.price}
                </p>
                <button
                  className={`w-full px-5 py-3 rounded-lg mt-4 text-lg font-medium transition-all duration-300 ${
                    selectedProduct.quantity > 0
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (selectedProduct.quantity > 0) {
                      addToCart(selectedProduct);
                      toast.success(`${selectedProduct.name} added to cart! 🛒`);
                    } else {
                      toast.error(`${selectedProduct.name} is out of stock! ❌`);
                    }
                  }}
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
  </>
     
  );
};

export default Products;
