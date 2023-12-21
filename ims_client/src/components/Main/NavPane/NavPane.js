import React, { useEffect, useState } from "react";

import styled from "styled-components";
import {
  BrowserRouter as Router,
  Route,
  useNavigate,
  Routes,
  Link,
} from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import Dashboard from "../../Dashboard/Dashboard";

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
function NavPane() {
  const [Navcontent, setNavContent] = useState("home");
  const [open, setOpen] = useState(true);

  const handleClick = (newNavContent) => {
    setNavContent(newNavContent);
  };

  useEffect(() => {
    console.log(Navcontent);
  }, [Navcontent]);

  return (
    <Router>
      <StyledNavbar collapseOnSelect expand="lg">
        <Navbar.Brand href="#home">Inventory Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={StyledNavLink} href="#home">
              Home
            </Nav.Link>
            <Nav.Link as={StyledNavLink} to="/dashboard">
              Dashboard
            </Nav.Link>
            <NavDropdown title="Others" id="collasible-nav-dropdown">
              <StyledDropdownItem href="#products">Products</StyledDropdownItem>
              <StyledDropdownItem href="#suppliers">
                Suppliers
              </StyledDropdownItem>
              <StyledDropdownItem href="#orders">Orders</StyledDropdownItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </StyledNavbar>

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default NavPane;
