import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Myorders from "./pages/Myorders";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/products/:storeId" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Myorders />} />
      </Routes>
    </Router>
  );
};

export default App;
