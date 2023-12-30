require('dotenv').config();

const express = require("express");
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');

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

app.get("/",(req,res)=>{
    res.send("This is IMS Server root api");
});

app.use(cors());

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
        console.log("Server Response : Authentication successful")
        res.json({ status: 'success', message: 'Server Response : Authentication successful', user: userResult.rows[0] }); 
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
//------------------------------------------------------------ -//


// Listening
https.createServer(options, app).listen(server_port, () => {
    console.log(`Server running at Port:${server_port}`);
    const url = `https://localhost:${server_port}`;
    console.log(`URL: ${url}`);
  });

  