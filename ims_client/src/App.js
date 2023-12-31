import { SpeedInsights } from "@vercel/speed-insights/react";
import { inject } from "@vercel/analytics";

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main/Main";
import Dashboard from "./components/Dashboard/Dashboard";
import MainContent from "./components/Main/MainContent";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import SupplierDetails from "./components/suppliers/Suppliers";
import Login from "./components/user/Login";
import Register from "./components/user/Register";

function App() {
  useEffect(() => {
    // vercel web analytics and speed insights
    inject();
  }, []); 
  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('User is logged in');
      } else {
        console.log('User is not logged in');
      }
    }, 3000); // Every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Main>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductDetails />} />
          <Route path="/suppliers" element={<SupplierDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Main>
      <SpeedInsights />
    </Router>
  );
}
export default App;
