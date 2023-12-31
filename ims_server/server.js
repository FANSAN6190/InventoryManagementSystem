require("dotenv").config();

const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

let user_name;
let user_code;
// Database connection and credentials
const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPWD,
  port: process.env.PGPORT,
});

// Loading SSL certificate and key
const options = {
  key: fs.readFileSync("../key.pem"),
  cert: fs.readFileSync("../cert.pem"),
};

//----------------------------Main------------------------------//
const app = express();
const server_port = process.env.SERVER_PORT || 8600;

app.get("/", (req, res) => {
  res.send("This is IMS Server root api");
});

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5800", // replace with the domain of your client app
    credentials: true,
  })
);

app.get("/data", async (req, res) => {
  try {
    const client = await pool.connect();
    const userResult = await client.query("SELECT * FROM ims_schema.users");
    //select * from ims_schema.products;
    const results = { results: userResult ? userResult.rows : null };
    client.release();
    console.log(results);
    return res.json(results);
  } catch (err) {
    console.error(err);
  }
});

const util = require("util");
const jwtVerify = util.promisify(jwt.verify);

app.get("/products", async (req, res) => {
  try {
    const client = await pool.connect();
    const productResult = await client.query(
      `select product_id, product_name, supplier_name,price,supplier_id from ims_schema.inventory_stock,ims_schema.inventory where user_name='${user_name}' and ims_schema.inventory_stock.inventory_id=ims_schema.inventory.inventory_id;`
    );
    const results = { results: productResult ? productResult.rows : null };
    client.release();
    console.log(results);
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Not authenticated" });
  }
});

app.get("/suppliers", async (req, res) => {
  try {
    const client = await pool.connect();
    const supplierResult = await client.query(
      "SELECT * FROM ims_schema.suppliers"
    );
    const results = { results: supplierResult ? supplierResult.rows : null };
    client.release();
    console.log(results);
    return res.json(results);
  } catch (err) {
    console.error(err);
  }
});

app.use(express.json());
app.post("/register", async (req, res) => {
  const {
    userName,
    fullName,
    dob,
    email,
    countryCode,
    phoneNo,
    password,
    confirmPass,
  } = req.body;
  console.log(
    "server received :: " +
      userName +
      " " +
      fullName +
      " " +
      dob +
      " " +
      email +
      " " +
      countryCode +
      " " +
      phoneNo +
      " " +
      password +
      " " +
      confirmPass
  );
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(
    "server received :: " +
      userName +
      " " +
      fullName +
      " " +
      dob +
      " " +
      email +
      " " +
      countryCode +
      " " +
      phoneNo +
      " " +
      hashedPassword
  );

  // Connect to the database
  const client = await pool.connect();
  try {
    // Insert the user data into the database
    const { rows } = await client.query(
      "SELECT nextval('ims_schema.user_code_seq')"
    );
    const userCounter = rows[0].nextval;
    const userCode =
      userName.substring(0, 4) +
      phoneNo.substring(phoneNo.length - 4) +
      String(userCounter).padStart(4, "0");

    const insertUserQuery = `
      INSERT INTO ims_schema.users(user_code, user_name, full_name, dob, email, country_code, phone_no, hash_pwd)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
      userCode,
      userName,
      fullName,
      dob,
      email,
      countryCode,
      phoneNo,
      hashedPassword,
    ];
    console.log(values);
    await client.query(insertUserQuery, values);

    // Send a success response
    res
      .status(201)
      .json({
        status: "success",
        message: "Server Response : User registered successfully",
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        status: "error",
        message: "Server Response : An error occurred during registration",
      });
  } finally {
    client.release();
  }
});

app.post("/login", async (req, res) => {
  let client;
  try {
    const client = await pool.connect();
    const { email, phone, password } = req.body;
    const userResult = await client.query(
      "SELECT * FROM ims_schema.users WHERE email = $1 AND phone_no = $2",
      [email, phone]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      user_name = user.user_name;
      console.log("Server Response : User Found :: " + user_name);
      const match = await bcrypt.compare(password, user.hash_pwd);
      if (match) {
        // User authenticated successfully
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.cookie("token", token, { httpOnly: true });

        res.json({ 
          status: "success",
          message: "Authentication successful",
          token,
        });
      } else {
        // User authentication failed
        res
          .status(401)
          .json({ status: "error", message: "Authentication failed" });
      }
    } else {
      console.log("Server Response : Authentication Failed :: User not Found");
      res
        .status(401)
        .json({
          status: "fail",
          message: "Server Response : Authentication Failed :: User not Found",
        });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        status: "error",
        message: "An error occurred during authentication",
      });
  } finally {
    client?.release();
  }
});

app.get("/check-login-status", (req, res) => {
  const token = req.cookies["token"];
  if (!token) {
    return res.json({ isAuthenticated: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.json({ isAuthenticated: false });
    }
    res.json({ isAuthenticated: true, user: user });
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ status: "success", message: "Logged out successfully" });
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
