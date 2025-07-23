import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";


const Home = () => {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/store-info`);
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStores();
  }, []);

  return (
    <>
    <Nav />
    <div className="animated-bg min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">Our Stores</h1>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {stores.map((store, index) => (
            <div
              key={index}
              onClick={() => navigate(`/products/${store.Id}`)}
              className="relative cursor-pointer bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center justify-center h-64 p-6">
                <img
                  src={store.image}
                  alt={store.Storename}
                  className="w-28 h-28 object-cover rounded-full border-4 border-gray-300 shadow-sm"
                />
                <h3 className="text-xl font-semibold text-gray-800 mt-5">{store.Storename}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  

  );
};

export default Home;
