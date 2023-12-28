require('dotenv').config();

const express = require("express");
const https = require('https');
const fs = require('fs');
const cors = require('cors');

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
app.post('/api/authenticate', async (req, res) => {
  try {
    const client = await pool.connect();
    const { email, phone, password } = req.body;

    const userResult = await client.query('SELECT * FROM ims_schema.users WHERE email = $1 AND phone = $2 ', [email, phone]);
    
    if (userResult.rows.length > 0) {
      // User found and authenticated
      res.json({ status: 'success', message: 'User authenticated', user: userResult.rows[0] });
      console.log("Server: Authentication successful")
    } else {
      // User not found or password incorrect
      console.log("Server: Authentication failed")
      res.status(401).json({ status: 'fail', message: 'Authentication failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'An error occurred during authentication' });
  } finally {
    client.release();
  }
});


app.post("/post",(req,res)=>{
    res.send("Hello from Server");
});




//------------------------------------------------------------ -//


// Listening
https.createServer(options, app).listen(server_port, () => {
    console.log(`Server running at Port:${server_port}`);
    const url = `https://localhost:${server_port}`;
    console.log(`URL: ${url}`);
  });

  