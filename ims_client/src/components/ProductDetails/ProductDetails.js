import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function ProductDetails() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5600/products`, { credentials: 'include' }) // Include credentials
    .then(response => response.json())
    .then((data) => setProducts(data.results))
    .catch(error => {
      console.error('Error:', error);
    });
  }, [navigate]);

  return (
    <div>
      <h1 className="mb-4">Product Details</h1>
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
