import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/store-info");
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Our Stores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {stores.map((store, index) => (
          <div
            key={index}
            onClick={() => navigate(`/products/${store.Id}`)} 
            className="relative cursor-pointer bg-white border-2 border-gray-300 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:border-gray-500 hover:shadow-xl"
          >
            <div className="flex flex-col items-center justify-center h-56">
              <img
                src={store.image}
                alt={store.Storename}
                className="w-24 h-24 object-cover rounded-full border-4 border-gray-300"
              />
              <h3 className="text-lg font-semibold text-gray-800 mt-4">{store.Storename}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
