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
      fetch('/check-login-status', {
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          if (data.loggedIn) {
            console.log('User is logged in : '+data.loggedIn);
          } else {
            console.log('User is not logged in : '+data.loggedIn);
          }
          console.log(data);
        });
    }, 3000);
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
