import React, { Fragment } from "react";
import { Button } from "react-bootstrap";

function MainContent() {
  return (
    <Fragment>
      <br></br>
      <h1>Welcome to Our Website!</h1>
      <span style={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
          paddingBottom: "50px",
        }}>
        <img style={{ height: "20%", width: "80%" }}
          src={process.env.PUBLIC_URL + "/ims_home_pic7.png"}
          alt="ims_home_pic7"/>
      </span>
      <h2>Manage your inventory with ease!</h2>
      <h3>Get Started by Registering or Logging In!</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button variant="primary" style={{ marginRight: "10px" }}>
          Login
        </Button>
        <Button variant="success">Register</Button>
      </div>
    </Fragment>
  );
}

export default MainContent;
