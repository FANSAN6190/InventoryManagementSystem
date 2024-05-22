import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { SERVER_URL } from "../../config";

function Register() {
  // const [user_id, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNo, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "500px",
    backgroundColor: "#0292cf",
    maxWidth: "90%",
    maxHeight: "90%",
    padding: "20px",
    boxSizing: "border-box",
    borderRadius: "20px",
    fontSize: "16px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  };

  const sendRegistrationData = (event) => {
    event.preventDefault();
    if (
      // user_id &&
      fullName &&
      dob &&
      email &&
      countryCode &&
      phoneNo &&
      password &&
      confirmPass
    ) {
      if (password !== confirmPass) {
        alert("Passwords do not match");
      } else {
        // Send the registration data to the server
        fetch(`${SERVER_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // user_id,
            fullName,
            dob,
            email,
            phoneNo,
            password,
            confirmPass,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Successfully Registered:", data);
            alert("Account Registered Successfully");
            setTimeout(() => {
              //navigate('/login');
              window.location.href = `/`;
            }, 1000);
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Failed to Register, Try Again");
          });
      }
    } else {
      alert("Please enter all values");
    }
  };
    
  useEffect(() => {
    if (
      // user_id &&
      fullName &&
      dob &&
      email &&
      countryCode &&
      phoneNo &&
      password &&
      confirmPass
    ) {
      if (password !== confirmPass) {
        console.log("passwords does not match");
      }
    } else {
      console.log("enter all values");
    }
  }, [
    // user_id,
    fullName,
    dob,
    email,
    countryCode,
    phoneNo,
    password,
    confirmPass,
  ]);
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
        class={"p-3 mb-2 bg-gradient text-white"}
        style={formStyle}
        onSubmit={sendRegistrationData}
      >
        <h1 class="text-center">
          <strong>Register</strong>
        </h1>
        {/* <div class="form-group">
          <label for="user_id">User ID</label>
          <input
            type="text"
            class="form-control"
            id="user_id"
            pattern="^[A-Za-z0-9_]{8,20}$"
            onBlur={(e) => {
              setUserId(e.target.value);
              e.target.setCustomValidity("");
              if (!e.target.validity.valid) {
                e.target.setCustomValidity(
                  "User ID must be 6-20 characters long and can only contain alphanumeric characters and underscores."
                );
              }
            }}
            placeholder="Enter User ID"
            required
          ></input>
        </div> */}
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input
            type="text"
            class="form-control"
            id="fullName"
            onBlur={(e) => setFullName(e.target.value)}
            placeholder="Enter Full Name"
            required
          ></input>
        </div>
        <div class="form-group">
          <label for="dob">Date of Birth</label>
          <input
            type="date"
            class="form-control"
            id="dob"
            onBlur={(e) => setDob(e.target.value)}
            required
          ></input>
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            type="email"
            class="form-control"
            id="email"
            aria-describedby="emailHelp"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            onBlur={(e) => {
              setEmail(e.target.value);
              e.target.setCustomValidity("");
              if (!e.target.validity.valid) {
                e.target.setCustomValidity(
                  "Please enter a valid email address."
                );
              }
            }}
            placeholder="Enter email"
            required
          ></input>
        </div>
        <div class="form-group">
          <label for="phoneNo">Phone Number</label>
          <PhoneInput
            country={"in"}
            enableSearch={true}
            onBlur={(e) => {
              if (e.target.value.length > 3) {
                const country = e.target.value.split(" ")[0];
                const phone_val = e.target.value
                  .split(country + " ")[1]
                  .replace(/\D/g, "");
                e.target.setCustomValidity("");
                if (phone_val.length !== 10) {
                  e.target.setCustomValidity(
                    "Phone number must be 10 digits long."
                  );
                } else {
                  setPhone(phone_val);
                  setCountryCode(country);
                }
              } else {
                e.target.setCustomValidity("Required field");
              }
            }}
            placeholder="Enter your Phone Number"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            onBlur={(e) => {
              setPassword(e.target.value);
              e.target.setCustomValidity("");
              if (!e.target.validity.valid) {
                e.target.setCustomValidity(
                  "Must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
                );
              }
            }}
            placeholder="Password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
            required
          ></input>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            onChange={(e) => {
              setConfirmPass(e.target.value);
              e.target.setCustomValidity("");
              if (e.target.value !== password) {
                e.target.setCustomValidity("Passwords do not match.");
              }
            }}
            placeholder="Retype Password"
            required
          ></input>
        </div>

        <button
          style={{ margin: "20px" }}
          type="submit"
          class="btn btn-primary bg-dark bg-gradient"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;
