require('dotenv').config();

const express = require('express');
const https = require('https');
const fs = require('fs');

const react_server_port=process.env.PORT || 8800;
const options = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
};

const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Listening
https.createServer(options, app).listen(react_server_port, () => {
    console.log(`React Production Server running at Port:${react_server_port}`);
    const url = `https://localhost:${react_server_port}`;
    console.log(`URL: ${url}`);
  });
