import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config";

function Login() {
  const formStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "90%",
    width: "325px",
    maxHeight: "90%",
    padding: "20px",
    boxSizing: "border-box",
    borderRadius: "20px",
    fontSize: "16px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  };
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const sendLoginData = useCallback(() => {
    fetch(`${SERVER_URL}/login`, {
      // replace with your server's address and port
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, phone, password }),
      credentials: "include", // Include credentials for CORS requests
    })
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true); // set isLoggedIn to true
        } else {
          console.log("Login Failed, try again");
        }
      })
      .catch((error) => {
        console.error("Error in Sending data to server:", error);
      });
  }, [email, phone, password]);

  const setValues = async (event) => {
    event.preventDefault();
    setEmail(document.getElementById("loginEmail").value);
    setPhone(document.getElementById("loginPno").value);
    setPassword(document.getElementById("loginPassword").value);
  };
  useEffect(() => {
    if (email && phone && password) {
      sendLoginData();
    } else {
      console.log("enter all values");
    }
  }, [email, phone, password, sendLoginData]);

  useEffect(() => {
    if (isLoggedIn) {
      window.alert("Login Successfully");
      console.log("Login Success");
      window.location.href = `/`;
    }
  }, [isLoggedIn, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <form
        class={"p-3 mb-2 bg-secondary bg-gradient text-white"}
        style={formStyle}
        onSubmit={setValues}
      >
        <h1>
          <strong>Login</strong>
        </h1>
        <div class="form-group">
          <label for="loginEmail">Email address</label>
          <input
            type="email"
            class="form-control"
            id="loginEmail"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          ></input>
        </div>
        <div class="form-group">
          <label for="loginPno">Phone Number</label>
          <input
            type="tel"
            class="form-control"
            id="loginPno"
            aria-describedby="pnoHelp"
            placeholder="Enter Phone Number"
          ></input>
        </div>
        <div class="form-group">
          <label for="loginPassword">Password</label>
          <input
            type="password"
            class="form-control"
            id="loginPassword"
            placeholder="Password"
            required
          ></input>
        </div>

        <button
          style={{ margin: "20px"}}
          type="submit"
          class="btn btn-primary bg-dark bg-gradient"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
