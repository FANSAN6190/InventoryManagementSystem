import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

function Register() {
  const [phoneNo, setPhone] = useState("");

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'90vh'}}>
      <form class={"p-3 mb-2 bg-secondary bg-gradient text-white"}>
        <h1><strong>Register</strong></h1>
        <div class="form-group">
          <label for="userName">User Name</label>
          <input type="text" class="form-control" id="userName" placeholder="Enter Username" required></input>
        </div>
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input type="text" class="form-control" id="fullName" placeholder="Enter Full Name" required></input>
        </div>
        <div class="form-group">
          <label for="dob">Date of Birth</label>
          <input type="date" class="form-control" id="dob" required></input>
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required></input>
        </div>
        <div class="form-group">
          <label for="phoneNo">Phone Number</label>
          <PhoneInput country={"in"} enableSearch={true} value={phoneNo} onChange={(phoneNo) => setPhone(phoneNo)} placeholder="Enter your Phone Number"/>            
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" id="password" placeholder="Password" required></input>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" class="form-control" id="confirmPassword" placeholder="Retype Password" required></input>
        </div>

        {/* <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div> */}

        <button style={{margin:"20px"}} type="submit" class="btn btn-primary bg-dark bg-gradient">Sign Up</button>
      </form>
    </div>
  )
}

export default Register