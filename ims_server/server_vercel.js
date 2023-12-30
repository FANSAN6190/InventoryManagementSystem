require('dotenv').config();

require('dotenv').config({ path: '.env.development.local' });
const { sql } = require('@vercel/postgres');

const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

// Loading SSL certificate and key
const options = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
};


//----------------------------Main------------------------------//
const server_port=process.env.SERVER_PORT || 8600;

const app = express();

app.use(cors());

app.get('/api/user', async (req, res) => {
    try {
        const users = await sql`SELECT * FROM users;`;
        console.log(json(users));
        res.json(users);
        
    } catch (error) {
        console.log(json({ error: error.message }));
        res.status(500).json({ error: error.message });
    }
});

https.createServer(options, app).listen(server_port, () => {
    console.log(`Server running at Port:${server_port}`);
    const url = `https://localhost:${server_port}`;
    console.log(`URL: ${url}`);
  });