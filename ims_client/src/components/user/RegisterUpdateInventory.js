import React, { useEffect, useState } from "react";
import './RegisterUpdateInventory.css';

function RegisterUpdateInventory() {
    const [inventoryNameId, setInventoryNameId] = useState("");
    const [productCatalogue, setProductCatalogue] = useState([
        { 
            productName: "", 
            price: "", 
            supplier: "", 
            productId: "", 
            quantity: "" ,
            otherDetails: [
                {
                    key: "",
                    value: ""
                }
            ] 
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
                quantity: "" ,
                otherDetails: [
                    {
                        key: "",
                        value: ""
                    }
                ]
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

    const updateOtherDetails = (productIndex, descIndex, field, value) => {
        const newProductCatalogue = [...productCatalogue];
        newProductCatalogue[productIndex].otherDetails[descIndex][field] = value;
        setProductCatalogue(newProductCatalogue);
    };

    const deleteOtherDetails = (productIndex, descIndex) => {
        const newProductCatalogue = [...productCatalogue];
        newProductCatalogue[productIndex].otherDetails = newProductCatalogue[productIndex].otherDetails.filter((_, i) => i !== descIndex);
        setProductCatalogue(newProductCatalogue);
    };

    const addOtherDetails = (productIndex) => {
        const newProductCatalogue = [...productCatalogue];
        newProductCatalogue[productIndex].otherDetails.push({ key: "", value: "" });
        setProductCatalogue(newProductCatalogue);
    };

    const [isCreatingNewInventory, setIsCreatingNewInventory] = useState(false);
    const [newInventoryName, setNewInventoryName] = useState('');
    const [newInventoryId, setNewInventoryId] = useState('');
    const [existingInventories, setExistingInventories] = useState([]);

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await fetch("http://localhost:5600/get-inventories",
                {
                    method: "GET",
                    headers: {"Content-Type": "application/json",},
                    credentials: 'include',
                });
                const data = await response.json();
                setExistingInventories(data.results.map((inventory) => inventory.inventory_name+'/'+inventory.inventory_id));
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchInventories();
    }, []);

    const getInputInJson = () => {
        const inputInJson = JSON.stringify({
            inventoryName: isCreatingNewInventory ? newInventoryName : inventoryNameId.split('/')[0],
            inventoryId: isCreatingNewInventory ? newInventoryId : inventoryNameId.split('/')[1],
            productCatalogue,
            isCreatingNewInventory,
        });
        return inputInJson;
    };


    const sendInventoryData = async (event) => {
        event.preventDefault();
        const AUdata=getInputInJson();
        console.log(AUdata);
        if(AUdata==="" || (AUdata.inventoryName==="" && AUdata.inventoryId==="")){
            console.log("Please fill relevant details");
            return;
        }
        
        try {
            console.log("AUdata")
            console.log(AUdata.inventoryName);
          const response = await fetch("http://localhost:5600/add-update-inventory",
            {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: AUdata,
                credentials: 'include',
            })
            if (response.status === 200) {
                console.log("Inventory Registered");
            }
            else {
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
        <div className="container"
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
                <div className="form-group" style={{padding:'20px'}}>
                    <h3>Select Inventory</h3>
                    <label htmlFor="inventoryName">Inventory Name/ID</label>
                    <select
                        className="form-control"
                        id="inventoryName"
                        value={inventoryNameId}
                        onChange={(e) => {
                            setInventoryNameId(e.target.value);
                            setIsCreatingNewInventory(e.target.value === 'new');
                        }}
                        required
                    >
                        <option value="">Select existing inventory</option>
                        <option value="new">Create new inventory</option>
                        {existingInventories.map((inventory, index) => (
                            <option key={index} value={inventory}>
                                {inventory}
                            </option>
                        ))}
                    </select>
                    
                    {isCreatingNewInventory && (
                        <div style={{display: 'flex', marginTop: '20px' }}>
                            <div style={{marginRight:'20px'}}>
                                <label htmlFor="newInventoryName">New Inventory Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="newInventoryName"
                                    placeholder="Enter new inventory name"
                                    value={newInventoryName}
                                    onChange={(e) => setNewInventoryName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`inventoryId`}>Inventory ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={`inventoryId`}
                                    style={{ width: '500px' }}
                                    placeholder="Create inventory ID"
                                    value={newInventoryId}
                                    onChange={(e) => setNewInventoryId(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}
                    
                </div>
                <div style={{ maxHeight: '500px', overflowY: 'auto'}}>
                    {productCatalogue.map((product, index) => (
                        <><ProductForm
                        key={index}
                        product={product}
                        index={index}
                        updateProduct={updateProduct}
                        deleteProduct={deleteProduct}
                        updateOtherDetails={updateOtherDetails}
                        deleteOtherDetails={deleteOtherDetails}
                        addOtherDetails={addOtherDetails}
                    />
                    <br></br></>
                    ))}
                </div>
                <button type="button" className="btn btn-primary bg-light text-dark" onClick={addProduct}>
                    Add Product
                </button>
                <button type="submit" className="btn btn-primary bg-light text-dark">
                    {isCreatingNewInventory ? "Add Inventory" : "Update Inventory"}
                </button>
            </form>
        </div>
    );

}
function ProductForm({ product, index, updateProduct, deleteProduct, updateOtherDetails, deleteOtherDetails, addOtherDetails }) {
    const [existingSuppliers, setExistingSuppliers] = useState([]);
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch("http://localhost:5600/get-suppliers",
                {
                    method: "GET",
                    headers: {"Content-Type": "application/json",},
                    credentials: 'include',
                });
                const data = await response.json();
                setExistingSuppliers(data.results.map((supplier) => supplier.supplier_name+'/'+supplier.supplier_id));
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchSuppliers();
    }, []);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' , backgroundColor:'#bef4f7', padding:'10px'}}>
                <h5> {index + 1}.{" "}</h5>
                <div className="form-group">
                    <label htmlFor={`productName${index}`}>Product Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id={`productName${index}`}
                        value={product.productName}
                        style={{ width: '500px' }}
                        onChange={(e) =>
                            updateProduct(index, "productName", e.target.value)
                        }
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`productId${index}`}>Product ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        id={`productId${index}`}
                        value={product.productId}
                        style={{ width: '150px' }}
                        onChange={(e) =>
                            updateProduct(index, "productId", e.target.value)
                        }
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`price${index}`}>Price:</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>₹</span>
                        <input
                            type="number"
                            className="form-control"
                            style={{ width: '100px', marginLeft: '5px' }}
                            id={`price${index}`}
                            value={product.price}
                            onChange={(e) => updateProduct(index, "price", e.target.value)}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor={`quantity${index}`}>Quantity:</label>
                    <input
                        type="number"
                        className="form-control"
                        style={{ width: '100px' }}
                        id={`quantity${index}`}
                        value={product.quantity}
                        onChange={(e) => updateProduct(index, "quantity", e.target.value)}
                        min="0"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor={`supplier${index}`}>Supplier ID:</label>
                    <select
                        className="form-control"
                        id={`supplier${index}`}
                        style={{ width: '200px' }}
                        value={product.supplier}
                        onChange={(e) => updateProduct(index, "supplier", e.target.value)}
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
                <button type="button" style={{width:'130px', height:'30px', marginTop:'30px'}} onClick={() => deleteProduct(index)}>Delete Product</button>
            </div>
                <div style={{display: 'flex', justifyContent: 'normal', backgroundColor:'#7af6ff', padding:'10px' }}>
                    <button type="button" className="add-details-button" onClick={() => addOtherDetails(index)}>
                        Add Other Product Details
                    </button>
                    <div style={{ width:'1000px', marginLeft:'80px'}}>
                        {product.otherDetails.map((desc, descIndex) => (
                            <div key={descIndex} style={{ display: 'flex', justifyContent: 'space-between' , padding:'5px' }}>
                                <input 
                                    type="text"
                                    placeholder="Enter Property"
                                    value={desc.key}
                                    onChange={(e) =>
                                        updateOtherDetails(index, descIndex, "key", e.target.value)
                                    }
                                    required
                                />
                                <input style={{ width: '600px'}}
                                    type="text"
                                    placeholder="Value"
                                    value={desc.value}
                                    onChange={(e) =>
                                        updateOtherDetails(index, descIndex, "value", e.target.value)
                                    }
                                    required
                                />
                                <button type="button" onClick={() => deleteOtherDetails(index, descIndex)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    );
}

export default RegisterUpdateInventory;



