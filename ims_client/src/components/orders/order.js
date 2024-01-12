import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { SERVER_URL } from "../../config";

function order(){
    const [orders, getOrders]= useState([]);
    const navigate=useNavigate;
    const [existingInventories,setExistingInventories]=useState([]);
    useEffect(()=>{
        const fetchInventories= async ()=> {
            try{
                const response= await fetch(`${SERVER_URL}/get-inventories`,{
                    method: "GET",
                    headers: {"Content-Type":"application/json"},
                    credentials:"include",
                });
                const data=await response.json();
                setExistingInventories(
                    data.results.map((inventory)=>inventory.inventory_id)
                );
            }catch(error){
                console.error("Error: ",error)
            }
        };
        fetchInventories();
    },[]);
    const [selectedInventory,setSelectedInventories]=useState("");
    useEffect(()=>{
        if(selectedInventory!==""){
            fetch(`${SERVER_URL}/orders?inventory=${selectedInventory}`,{credentials:"include",})
            .then((response)=>response.json())
            .then((data)=>getOrders(data.results))
            .catch((error)=>{
                console.error("Error: ",error);
            });
        }
    },[selectedInventory,navigate]);
    return(
        <div>
            <h1 className="mb-4">Order Data</h1>
            <select
            className="custom-select mb-4"
            style={{
                padding:"5px", borderRadius:"10px",display:"block",fontSize:"20px",
            }}
            onChange={(e)=>setSelectedInventories(e.target.value)}>
                {existingInventories.map((inventory,index)=>(
                    <option key={index} value={inventory}>{inventory}</option>
                ))}
            </select>
            <table className="table">
                <thead>
                    <tr>
                        <th>Order_ID</th>
                        <th>Order Name</th>
                        <th>Order Made On</th>
                        <th>Supplier</th>
                        <th>Quantity</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(orders)&& orders.map((order)=>(
                        <tr key={order.order_id}>
                            <td>{order.order_id}</td>
                            <td>{order.orderName}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.supplier}</td>
                            <td>{order.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default order;