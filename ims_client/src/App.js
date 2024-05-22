import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux_store";

import Main from "./components/Main/Main";
import Dashboard from "./components/Dashboard/Dashboard";
import MainContent from "./components/Main/MainContent";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import SupplierDetails from "./components/suppliers/Suppliers";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import InventoryStatus from "./components/InventoryStatus/InventoryStatus";
import withAuthCheck from "./components/user/withAuthCheck";
import RegisterUpdateInventory from "./components/user/RegisterUpdateInventory";
import { SERVER_URL } from "./config";

const ProductDetailsWithAuthCheck = withAuthCheck(ProductDetails, true);
const SupplierDetailsWithAuthCheck = withAuthCheck(SupplierDetails, true);
const InventoryStatusWithAuthCheck = withAuthCheck(InventoryStatus, true);
const DashboardWithAuthCheck = withAuthCheck(Dashboard, true);
const RegisterUpdateInventoryWithAuthCheck = withAuthCheck(
  RegisterUpdateInventory,
  true
);

function App() {

  // need to be removed later
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(`${SERVER_URL}/auth/check-login-status`, {
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
    <Provider store={store}>
      <Router>
        <Main>
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/dashboard" element={<DashboardWithAuthCheck />} />
            <Route path="/products" element={<ProductDetailsWithAuthCheck />} />
            <Route path="/suppliers" element={<SupplierDetailsWithAuthCheck />} />
            <Route path="/inventory_status" element={<InventoryStatusWithAuthCheck />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/add_update_inventory"
              element={<RegisterUpdateInventoryWithAuthCheck />}
            />
          </Routes>
        </Main>
      </Router>
    </Provider>
  );
}
export default App;
