import React, { useEffect, useState } from "react";

function SupplierDetails() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5600/suppliers`)
      .then((response) => response.json())
      .then((data) => setSuppliers(data.results));
  }, []);

  return (
    <div>
      <h1 className="mb-4">Supplier Details</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Supplier Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Number of Products</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(suppliers) &&
            suppliers.map((supplier) => (
              <tr key={supplier.supplier_id}>
                <td>{supplier.supplier_id}</td>
                <td>{supplier.supplier_name}</td>
                <td>{supplier.pno}</td>
                <td>{supplier.email}</td>
                <td>{supplier.no_of_products}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierDetails;
