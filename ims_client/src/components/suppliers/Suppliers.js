import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config";

function SupplierDetails() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/suppliers`)
      .then((response) => response.json())
      .then((data) => setSuppliers(data.results));
  }, []);

  return (
    <div>
      <div id="add_sup">
        
      </div>
      <div id="sup_table">
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
    </div>
  );
}

export default SupplierDetails;
