import { SpeedInsights } from "@vercel/speed-insights/react";
import { inject } from "@vercel/analytics";

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main/Main";
import Dashboard from "./components/Dashboard/Dashboard";
import MainContent from "./components/Main/MainContent";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import SupplierDetails from "./components/suppliers/Suppliers";

function App() {
  useEffect(() => {
    // vercel web analytics and speed insights
    inject();
  }, []);
  return (
    <Router>
      <Main>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductDetails />} />
          <Route path="/suppliers" element={<SupplierDetails />} />
        </Routes>
      </Main>
      <SpeedInsights />
    </Router>
  );
}
export default App;
