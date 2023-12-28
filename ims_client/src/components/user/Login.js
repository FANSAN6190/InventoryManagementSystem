import React, { useState } from 'react'

function Login() {
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    maxWidth: '90%', 
    height: '400px', 
    maxHeight: '90%',
    padding: '20px',
    boxSizing: 'border-box',
    borderRadius:'20px',
    fontSize: '16px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    }
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    async function sendLoginData(event) {
      event.preventDefault();

      try {
        const response = await fetch('https://localhost:5600/api/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            phone: phone,
            password: password
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Successful login");
          alert(`Welcome ${data.name}!, you have successfully logged in!`)
        } else {
          console.log("Failed login");
          alert('Login failed.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while trying to log in.');
      }
    }
      
    return (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'90vh'}}>
        <form class={"p-3 mb-2 bg-secondary bg-gradient text-white"} style={formStyle} onSubmit={sendLoginData}>
          <h1><strong>Login</strong></h1>
          <div class="form-group">
            <label for="loginEmail">Email address</label>
            <input type="email" class="form-control" id="loginEmail" aria-describedby="emailHelp" placeholder="Enter email"></input>
          </div>
          <div class="form-group">
            <label for="loginPno">Phone Number</label>
            <input type="tel" class="form-control" id="loginPno" aria-describedby="pnoHelp" placeholder="Enter Phone Number"></input>
          </div>
          <div class="form-group">
            <label for="loginPassword">Password</label>
            <input type="password" class="form-control" id="loginPassword" placeholder="Password" required></input>
          </div>

          {/* <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
            <label class="form-check-label" for="exampleCheck1">Check me out</label>
          </div> */}

          <button style={{margin:"20px"}} type="submit" class="btn btn-primary bg-dark bg-gradient">Submit</button>
        </form>
      </div>
    )
}

export default Login


/* const handleSubmit = async (event) => {      
      const updateValues = new Promise((resolve, reject) => {
        setEmail(document.getElementById('loginEmail').value);
        setPhone(document.getElementById('loginPno').value);
        setPassword(document.getElementById('loginPassword').value);
        event.preventDefault();
        resolve();
      });
      await updateValues;
      console.log("tes1 ",email, phone, password);
      console.log("tes2 ",email, phone, password);

      await Promise.all();
      
      if (!email || !phone) {
        alert('Please enter either an email address or a phone number.');
        return;
      }

      const response = await fetch('/api/authenticate', { // replace '/api/authenticate' with your server endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone, password }),
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log("Successfull login");
        alert(`Welcome ${data.name}!, you have successfully logged in!`)
      } else {
        console.log("Failed login");
        alert('Login failed.');
      }
    }   */

    