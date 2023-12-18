require('dotenv').config();

const express = require("express");
const https = require('https');
const fs = require('fs');
const cors = require('cors');


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
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

//Main
const app=express();
const server_port=process.env.SERVER_PORT || 8600;

app.get("/",(req,res)=>{
    res.send("Message from Server");
});

app.use(cors());

app.get('/data', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM ims_schema.users');
      const results = { 'results': (result) ? result.rows : null};
      client.release();
      console.log(results);
      return res.json(results);
    } catch (err) {
      console.error(err);
    }
});

app.post("/post",(req,res)=>{
    res.send("Hello from Server");
});


// Listening
https.createServer(options, app).listen(server_port, () => {
    console.log(`Server running at Port:${server_port}`);
    const url = `https://localhost:${server_port}`;
    console.log(`URL: ${url}`);
  });