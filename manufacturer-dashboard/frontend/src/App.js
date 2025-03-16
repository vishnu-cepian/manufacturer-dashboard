import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import RegisterProduct from "./pages/RegisterProduct";
import MyProducts from "./pages/MyProducts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/register-product" element={<PrivateRoute><RegisterProduct /></PrivateRoute>} />
        <Route path="my-products" element={<MyProducts />}/>
      </Routes>
    </Router>
  );
}

export default App;
