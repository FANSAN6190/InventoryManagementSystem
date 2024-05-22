//import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { checkLoginStatus } from "../../user/withAuthCheck";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../../config";
import { useDispatch } from 'react-redux';
import {useSelector} from 'react-redux'
import {selectInventory} from "../../../redux/actions/invSelectAction";
import {invArray} from "../../../redux/actions/invSelectAction";

const StyledNavLink = styled(Link)`
  border-radius: 10px;
  border: none;
  color: Black;
  padding: 10px;
  font-size: 18px;
  transition: 0.3s;
  outline: none;
  cursor: pointer;
  
  &:active {
    transform: scale(0.95);
  }
  &:hover {
    background-color: #d2e6fa;
  }
`;
const StyledNavbar = styled(Navbar)`
  float: left;
  display: flex;
  background-color: #b4c8cc;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 10px;
  font-size: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  margin-top: 5px;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;
const StyledDropdownItem = styled(NavDropdown.Item)`
  border-radius: 0px;
  border: none;
  color: black;
  font-size: 15px;
  transition: 0.3s;
  outline: none;
  background-color: #333; // dim color
  cursor: pointer;
  &:active {
    transform: scale(0.95);
  }
  &:hover {
    background-color: #d2e6fa;
  }
  background-color: white;
`;

const StyledSelect = styled.select`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  color: #333;
  margin-left: 10px;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 15px;
`;
function NavPane() {
  const [inventories, setInventories] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch inventories when component mounts
    fetch(`${SERVER_URL}/inventory/get-inventories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then(response => response.json())
      .then(data => {
        const inventories = data.results.map(inventory => inventory.inventory_id);
        setInventories(inventories);
      })
      .catch(error => {
        console.error('Error fetching inventories:', error);
      });
  }, []);
  
  
  let selInv = useSelector(state => state.inventory.selectedInventory);
  let invs= useSelector(state => state.inventory.inventory_arr);
  console.log(selInv);
  console.log(invs)
  if(selInv==null){
    dispatch(selectInventory(inventories[0]));
    dispatch(invArray(inventories));
  }

  function logout() {
    fetch(`${SERVER_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // include credentials to send the httpOnly cookie
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === "success") {
          console.log("Logged out successfully");
          document.getElementById("logout").style.display = "none";
          
          window.location.reload();
        } else {
          console.log("Logout failed");
        }
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }
  useEffect(() => {
    checkLoginStatus().then((isAuthenticated) => {
      if (isAuthenticated) {
        document.getElementById("logout").style.display = "";
        document.getElementById("inventory-select").style.display = "";
      }
    });
  }, []);
  return (
    <StyledNavbar collapseOnSelect expand="lg">
      <Navbar.Brand href="/" style={{ display: "flex" }}>
        <img
          src={process.env.PUBLIC_URL + "/logo1.png"}
          width="60"
          height="60"
          className="d-inline-block align-top"
          alt="My Website Logo"
        />
        <h4
          className="text-muted"
          style={{ marginTop: "15px", marginLeft: "10px" }}
        >
          Inventory Management System
        </h4>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={StyledNavLink} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={StyledNavLink} to="/dashboard">
            Dashboard
          </Nav.Link>
          <NavDropdown
            style={{ marginTop: "5px", marginLeft: "10px" }}
            title="Others"
            id="collasible-nav-dropdown"
          >
            <StyledDropdownItem>
              <Link to="/add_update_inventory">Add/Update Inventory</Link>
            </StyledDropdownItem>
            <StyledDropdownItem>
              <Link to="/inventory_status">Inventory Status</Link>
            </StyledDropdownItem>
            <StyledDropdownItem>
              <Link to="/products">Products</Link>
            </StyledDropdownItem>
            <StyledDropdownItem>
              <Link to="/suppliers">Suppliers</Link>
            </StyledDropdownItem>
            <StyledDropdownItem>
              <Link to="/api/user">Orders</Link>
            </StyledDropdownItem>
          </NavDropdown>
          <Button as={StyledNavLink} id="logout" style={{display:"none", height:"10%"}} onClick={logout}>
            Logout
          </Button>
          <StyledDiv>
            <div id="inventory-select" style={{display:"none"}}>
              <label htmlFor="inventory-select">Select Inventory:</label>
              <StyledSelect 
                defaultValue={inventories[0]} // Set the first inventory as the default value
                onChange={(e) => {
                  // Handle inventory selection
                  dispatch(selectInventory(e.target.value));
                  dispatch(invArray(inventories));
                }}>
                {inventories.map((inventory, index) => (
                  <option key={index} value={inventory}>
                    {inventory}
                  </option>
                ))}
              </StyledSelect>
            </div>
          </StyledDiv>
        </Nav>
      </Navbar.Collapse>
    </StyledNavbar>
  );
}

export default NavPane;
