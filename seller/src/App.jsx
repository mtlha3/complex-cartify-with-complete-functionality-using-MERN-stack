import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import SDashboard from "./pages/SellerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sdashboard" element={<SDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
