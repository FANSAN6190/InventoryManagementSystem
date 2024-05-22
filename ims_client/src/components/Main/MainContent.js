import React, { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {checkLoginStatus} from "../user/withAuthCheck";
import { useSelector } from 'react-redux';

function MainContent() {
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus().then((isAuthenticated) => {
      if (isAuthenticated) {
        document.getElementById("auth_div").style.display = "none";
      }
    });
  }, []);

  let selInv = useSelector(state => state.inventory.selectedInventory);
  let invs= useSelector(state => state.inventory.inventory_arr);
  console.log(selInv);
  console.log(invs);

  return (
    <Fragment>
      <br></br>
      <h1>Welcome to Our Website!</h1>
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
          paddingBottom: "50px",
        }}
      >
        <img
          style={{ height: "20%", width: "80%" }}
          src={process.env.PUBLIC_URL + "/ims_home_pic7.png"}
          alt="ims_home_pic7"
        />
      </span>
      <h2>Manage your inventory with ease!</h2>

      <div id="auth_div">
        <h3>Get Started by Registering or Logging In!</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="primary"
            style={{ marginRight: "10px" }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
          <Button
            variant="success"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </Button>
        </div>
      </div>
      <h1>{selInv}</h1>
    </Fragment>
  );
}

export default MainContent;
