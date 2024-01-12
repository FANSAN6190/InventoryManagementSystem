import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config";

function ProductDetails() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [existingInventories, setExistingInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState("");
  
  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/inventory/get-inventories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        const inventories = data.results.map((inventory) => inventory.inventory_id);
        setExistingInventories(inventories);
        if (inventories.length > 0) {
          setSelectedInventory(inventories[0]);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchInventories();
  }, []);


  useEffect(() => {
    if (selectedInventory) {
      setProducts([]);
      fetch(`${SERVER_URL}/products?inventory=${selectedInventory}`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => setProducts(data.results))
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [selectedInventory, navigate]);

  return (
    <div>
      <h1 className="mb-4">Product Details</h1>
      <select
        className="custom-select mb-4"
        style={{
          padding: "5px",
          borderRadius: "10px",
          display: "block",
          fontSize: "20px",
        }}
        onChange={(e) => setSelectedInventory(e.target.value)}
      >
        {existingInventories.map((inventory, index) => (
          <option key={index} value={inventory}>
            {inventory}
          </option>
        ))}
      </select>
      <table className="table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Supplier</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) &&
            products.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.product_name}</td>
                <td>{product.brand}</td>
                <td>{product.price}</td>
                <td>{product.supplier}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductDetails;
