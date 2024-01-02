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

import withAuthCheck from './components/user/withAuthCheck';
import RegisterUpdateInventory from "./components/user/RegisterUpdateInventory";


const ProductDetailsWithAuthCheck= withAuthCheck(ProductDetails, true );
const SupplierDetailsWithAuthCheck= withAuthCheck(SupplierDetails, true );
const DashboardWithAuthCheck= withAuthCheck(Dashboard, true );
const RegisterUpdateInventoryWithAuthCheck= withAuthCheck(RegisterUpdateInventory, true );

function App() {
  useEffect(() => {
    // vercel web analytics and speed insights
    inject();
  }, []);



  // need to be removed later
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("/check-login-status", {
        method: "GET",
        credentials: "include", // Include credentials for CORS requests
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isAuthenticated) {
            console.log("User is logged in");
          } else {
            console.log("User is not logged in");
          }
        })
        .catch((error) => console.error("Error:", error));
    }, 3000); // Every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Main>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/dashboard" element={<DashboardWithAuthCheck />} />
          <Route path="/products" element={<ProductDetailsWithAuthCheck />}/>
          <Route path="/suppliers" element={<SupplierDetailsWithAuthCheck />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add_update_inventory" element={<RegisterUpdateInventoryWithAuthCheck />} />
        </Routes>
      </Main>
      <SpeedInsights />
    </Router>
  );
}
export default App;
