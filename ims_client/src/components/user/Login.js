import React from 'react'

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
  
  const handleSubmit = (event) => {
    const email = document.getElementById('loginEmail').value;
    const phone = document.getElementById('loginPhone').value;

    if (!email || !phone) {
      alert('Please enter either an email address or a phone number.');
      event.preventDefault();
    }
  }
  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'90vh'}}>
      <form class={"p-3 mb-2 bg-secondary bg-gradient text-white"} style={formStyle} onSubmit={handleSubmit}>
        <h1><strong>Login</strong></h1>
        <div class="form-group">
          <label for="loginEmail1">Email address</label>
          <input type="email" class="form-control" id="loginEmail" aria-describedby="emailHelp" placeholder="Enter email"></input>
        </div>
        <div class="form-group">
          <label for="loginEmail1">Phone Number</label>
          <input type="email" class="form-control" id="loginEmail" aria-describedby="emailHelp" placeholder="Enter Phone Number"></input>
        </div>
        <div class="form-group">
          <label for="loginPassword1">Password</label>
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