require('dotenv').config();

const express = require("express");
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

// Database connection and credentials
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDB,
    password: process.env.PGPWD,
    port: process.env.PGPORT,
});

// Loading SSL certificate and key
const options = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
};


//----------------------------Main------------------------------//
const app=express();
const server_port=process.env.SERVER_PORT || 8600;

//--------------------Session Handling-------------------------//
app.use(session({
  store: new pgSession({
    pool: pool, // Use your existing PostgreSQL connection pool
    tableName: "session" // Optional. Use this if you want to specify a different table name. Default is 'session'.
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    sameSite: 'none', 
  } // Note: the `secure` option requires an HTTPS connection
}));

app.get('/check-login-status', (req, res) => {
  //console.log("Session : "+req.session+"::: User : "+req.session.user);
  console.log("Session ID : "+req.sessionID);
  console.log("Session : ", req.session);
  console.log("User : ", req.session.user);
  if (req.session && req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error while Logout:"+err);
      res.status(500).json({ status: 'error', message: 'An error occurred during logout' });
    } else {
      res.redirect('/login');
    }
  });
});
//--------------------------------------------------------------//

app.get("/",(req,res)=>{
  res.send("This is IMS Server root api");
});

app.use(cors({
origin: 'http://localhost:5800', // replace with the domain of your client app
credentials: true,
}));

app.get('/data', async (req, res) => {
    try {
      const client = await pool.connect();
      const userResult = await client.query('SELECT * FROM ims_schema.users');
      //select * from ims_schema.products;
      const results = { 'results': (userResult) ? userResult.rows : null};
      client.release();
      console.log(results);
      return res.json(results);
    } catch (err) {
      console.error(err);
    }
});

app.get('/products', async (req, res) => {
  if (req.session && req.session.user) {
    try {
      const client = await pool.connect();
      const productResult = await client.query('SELECT * FROM ims_schema.products');
      const results = { 'results': (productResult) ? productResult.rows : null};
      client.release();
      console.log(results);
      return res.json(results);
    } catch (err) {
      console.error(err);
    }
  }
  else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/suppliers', async (req, res) => {
    try {
      const client = await pool.connect();
      const supplierResult = await client.query('SELECT * FROM ims_schema.suppliers');
      const results = { 'results': (supplierResult) ? supplierResult.rows : null};
      client.release();
      console.log(results);
      return res.json(results);
    } catch (err) {
      console.error(err);
    }
});

app.use(express.json());
app.post('/register', async(req, res) => {
  const {userName, fullName, dob, email, countryCode, phoneNo, password, confirmPass} = req.body;
  console.log("server received :: "+ userName +" "+ fullName +" "+ dob +" "+ email +" "+ countryCode +" "+ phoneNo +" "+ password +" "+ confirmPass);
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("server received :: "+ userName +" "+ fullName +" "+ dob +" "+ email +" "+ countryCode +" "+ phoneNo +" "+ hashedPassword);

  // Connect to the database
  const client = await pool.connect();
  try {
    // Insert the user data into the database
    const { rows } = await client.query('SELECT nextval(\'ims_schema.user_code_seq\')');
    const userCounter = rows[0].nextval;
    const userCode = userName.substring(0, 4) + phoneNo.substring(phoneNo.length - 4) + String(userCounter).padStart(4, '0');

    const insertUserQuery = `
      INSERT INTO ims_schema.users(user_code, user_name, full_name, dob, email, country_code, phone_no, hash_pwd)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [userCode,userName, fullName, dob, email, countryCode, phoneNo, hashedPassword];
    console.log(values);
    await client.query(insertUserQuery, values);
    
    // Send a success response
    res.status(201).json({ status: 'success', message: 'Server Response : User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server Response : An error occurred during registration' });
  } finally {
    client.release();
  }
});

app.post('/login', async (req, res) => {
  let client;
  try {
    const client = await pool.connect();
    const { email, phone, password } = req.body;
    const userResult = await client.query('SELECT * FROM ims_schema.users WHERE email = $1 AND phone_no = $2', [email, phone]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const match = await bcrypt.compare(password, user.hash_pwd);
      if (match) {
        console.log("User:"+user.user_code+" logged in successfully");
        req.session.user = user;  
        req.session.save(err => {
          if (err) {
            console.error("Error while saving session:"+err);
          } else {
            res.json({status: 'success', message: 'Server Response : Authentication successful', session : req.session, user:req.session.user})
            console.log("Server Response : Authentication successful")
          }
        });
        
        //res.json({ status: 'success', message: 'Server Response : Authentication successful', user: userResult.rows[0].message }); 
      } else {
        console.log("Server Response : Authentication Failed :: Incorrect Password");
        res.status(401).json({ status: 'fail', message: 'Server Response : Authentication Failed :: Incorrect Password' });
      }
      
    } else {
      console.log("Server Response : Authentication Failed :: User not Found")
      res.status(401).json({ status: 'fail', message: 'Server Response : Authentication Failed :: User not Found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'An error occurred during authentication' });
  } finally {
    client?.release();
  }
});

//--------------------------------------------------------------//

// Listening
// https.createServer(options, app).listen(server_port, () => {
//     console.log(`Server running at Port:${server_port}`);
//     const url = `https://localhost:${server_port}`;
//     console.log(`URL: ${url}`);
//   });
app.listen(server_port, () => {
  console.log(`Server running at Port:${server_port}`);
  const url = `http://localhost:${server_port}`;
  console.log(`URL: ${url}`);
});
  