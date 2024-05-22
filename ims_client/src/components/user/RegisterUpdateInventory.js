import React, { useEffect, useState } from "react";
import "./RegisterUpdateInventory.css";
import { SERVER_URL } from "../../config";
import CreatableSelect from "react-select/creatable";

function RegisterUpdateInventory() {
  const [productCatalogue, setProductCatalogue] = useState([
    {
      productName: "",
      price: "",
      supplier: "",
      productId: "",
      quantity: "",
      otherDetails: [
        {
          key: "",
          value: "",
        },
      ],
    },
  ]);

  const addProduct = () => {
    setProductCatalogue([
      ...productCatalogue,
      {
        productName: "",
        price: "",
        supplier: "",
        productId: "",
        quantity: "",
        otherDetails: [
          {
            key: "",
            value: "",
          },
        ],
      },
    ]);
  };

  const updateProduct = (index, field, value) => {
    const newProductCatalogue = [...productCatalogue];
    newProductCatalogue[index][field] = value;
    setProductCatalogue(newProductCatalogue);
  };
  const deleteProduct = (index) => {
    setProductCatalogue(productCatalogue.filter((_, i) => i !== index));
  };

  const [isCreatingNewInventory, setIsCreatingNewInventory] = useState(false);

  const getInputInJson = () => {
    // const inputInJson = JSON.stringify({
    //   inventoryName: isCreatingNewInventory
    //     ? newInventoryName
    //     : inventoryNameId.split("/")[0],
    //   inventoryId: isCreatingNewInventory
    //     ? newInventoryId
    //     : inventoryNameId.split("/")[1],
    //   productCatalogue,
    //   isCreatingNewInventory,
    // });
    // return inputInJson;
  };

  const sendInventoryData = async (event) => {
    event.preventDefault();
    const AUdata = getInputInJson();
    console.log(AUdata);
    if (
      AUdata === "" ||
      (AUdata.inventoryName === "" && AUdata.inventoryId === "")
    ) {
      console.log("Please fill relevant details");
      return;
    }

    try {
      console.log("AUdata");
      console.log(AUdata.inventoryName);
      const response = await fetch(
        `${SERVER_URL}/inventory/add-update-inventory`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: AUdata,
          credentials: "include",
        }
      );
      if (response.status === 200) {
        console.log("Inventory Registered");
      } else {
        console.log("Failed to Register Inventory, Try Again");
      }
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
      console.log("An error occured while registering inventory");
    }
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "cyan",
    padding: "20px",
    boxSizing: "border-box",
    borderRadius: "20px",
    fontSize: "16px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <form
        className="form p-3 mb-2 text-dark"
        style={formStyle}
        onSubmit={sendInventoryData}
      >
        <h1 className="text-center">
          <strong>Add/Update Inventory</strong>
        </h1>
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          {productCatalogue.map((product, index) => (
            <>
              <ProductForm
                key={index}
                product={product}
                index={index}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
              />

              <br></br>
            </>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary bg-light text-dark"
          onClick={addProduct}
        >
          Add Product
        </button>
        <button type="submit" className="btn btn-primary bg-light text-dark">
          {isCreatingNewInventory ? "Add Inventory" : "Update Inventory"}
        </button>
      </form>
    </div>
  );
}
function ProductForm({ product, index, updateProduct, deleteProduct }) {
  const ItemCategories = ["Electronics", "Books", "Clothing"]; // Add more categories as needed
  const categoryOptions = ItemCategories.map((category) => ({
    value: category,
    label: category,
  }));
  const itemTypes = ["Type1", "Type2", "Type3"]; // Replace with your actual item types
  const typeOptions = itemTypes.map((type) => ({ value: type, label: type }));
  const brands = ["Brand1", "Brand2", "Brand3"]; // Replace with your actual brands
  const brandOptions = brands.map((brand) => ({ value: brand, label: brand }));
  const HSNCodes = ["HSN1", "HSN2", "HSN3"]; // Replace with your actual HSN codes
  const hsnOptions = HSNCodes.map((hsn) => ({ value: hsn, label: hsn }));

  const [lastClicked, setLastClicked] = useState(null); // Add this state variable to keep track of the last clicked radio button
  const [selection, setSelection] = useState(""); // Add this state variable to keep track of the selection
  const [existingSuppliers, setExistingSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/inventory/get-suppliers`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setExistingSuppliers(
          data.results.map(
            (supplier) => supplier.supplier_name + "/" + supplier.supplier_id
          )
        );
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSuppliers();
  }, []);
  return (
    <div>
      <div style={{ backgroundColor: "#bef4f7", padding: "10px" }}>
        <div>
          <div className="form-group" style={{ display: "flex" }}>
            <h5> {index + 1}. </h5>
            <div style={{ display: "flex" }}>
              <label htmlFor={`productId${index}`}>Item Code/Bar Code:</label>
              <input
                type="text"
                className="form-control"
                id={`productId${index}`}
                value={product.productId}
                style={{ width: "150px" }}
                onChange={(e) =>
                  updateProduct(index, "productId", e.target.value)
                }
                required
              />
            </div>
            <div style={{ display: "flex" }}>
              <label htmlFor={`productName${index}`}>Item Name:</label>
              <input
                type="text"
                className="form-control"
                id={`productName${index}`}
                value={product.productName}
                onChange={(e) =>
                  updateProduct(index, "productName", e.target.value)
                }
                required
              />
            </div>

            <div style={{ display: "flex" }}>
              <label htmlFor={`brand${index}`}>Brand:</label>
              <CreatableSelect
                isClearable 
                id={`brand${index}`}
                value={brandOptions.find(
                  (option) => option.value === product.brand
                )}
                onChange={(e) =>
                  updateProduct(index, "brand", e ? e.value : "")
                }
                options={brandOptions}
              />
            </div>

            <div style={{ display: "flex" }}>
              <label htmlFor={`price${index}`}>Price:</label>
              <span>₹</span>
              <input
                type="number"
                className="form-control"
                style={{ width: "100px", marginLeft: "5px" }}
                id={`price${index}`}
                value={product.price}
                onChange={(e) => updateProduct(index, "price", e.target.value)}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div style={{ display: "flex"}}>
              <label htmlFor={`quantity${index}`}>Quantity:</label>
              <input
                type="number"
                className="form-control"
                style={{ width: "100px" }}
                id={`quantity${index}`}
                value={product.quantity}
                onChange={(e) => updateProduct(index, "quantity", e.target.value)}
                min="0"
                required
              />
            </div>
            <button
              type="button"
              style={{ width: "130px", height: "30px", marginTop: "30px" }}
              onClick={() => deleteProduct(index)}
            >
              Delete Product
            </button>
          </div>
        </div>

        <div>
          <div
            className="form-group"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <div style={{ display: "flex" }}>
              <label htmlFor={`type${index}`}>Type:</label>
              <CreatableSelect
                isClearable
                id={`type${index}`}
                value={typeOptions.find(
                  (option) => option.value === product.type
                )}
                onChange={(e) => updateProduct(index, "type", e ? e.value : "")}
                options={typeOptions}
                style={{ width: "200px" }}
              />
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <input
                    type="radio"
                    id={`category${index}`}
                    value="category"
                    checked={selection === "category"}
                    onClick={(e) => {
                      if (lastClicked === e.target.value) {
                        setSelection("");
                        setLastClicked(null);
                      } else {
                        setSelection(e.target.value);
                        setLastClicked(e.target.value);
                      }
                    }}
                  />
                  <label htmlFor={`category${index}`}>Item Category</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id={`hsn${index}`}
                    value="hsn"
                    checked={selection === "hsn"}
                    onClick={(e) => {
                      if (lastClicked === e.target.value) {
                        setSelection("");
                        setLastClicked(null);
                      } else {
                        setSelection(e.target.value);
                        setLastClicked(e.target.value);
                      }
                    }}
                  />
                  <label htmlFor={`hsn${index}`}>HSN Code</label>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "10px",
                }}
              >
                {selection === "category" && (
                  <div className="form-group">
                    <CreatableSelect
                      isClearable
                      id={`categorySelect${index}`}
                      value={categoryOptions.find(
                        (option) => option.value === product.category
                      )}
                      onChange={(e) =>
                        updateProduct(index, "category", e ? e.value : "")
                      }
                      options={categoryOptions}
                      style={{ width: "200px" }}
                    />
                  </div>
                )}
                {selection === "hsn" && (
                  <div className="form-group">
                    <CreatableSelect
                      isClearable
                      id={`hsnSelect${index}`}
                      value={hsnOptions.find(
                        (option) => option.value === product.hsn
                      )}
                      onChange={(e) =>
                        updateProduct(index, "hsn", e ? e.value : "")
                      }
                      options={hsnOptions}
                      style={{ width: "200px" }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <label htmlFor={`supplier${index}`}>Supplier ID:</label>
              <select
                className="form-control"
                id={`supplier${index}`}
                style={{ width: "200px", marginLeft: "5px" }}
                value={product.supplier}
                onChange={(e) =>
                  updateProduct(index, "supplier", e.target.value)
                }
                required
              >
                <option value="">Select a supplier</option>
                {existingSuppliers.map((supplierId, supplierIndex) => (
                  <option key={supplierIndex} value={supplierId}>
                    {supplierId}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUpdateInventory;
