import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import pgPromise from "pg-promise";
import { Server as socketIo } from "socket.io";

import connectPgSimple from "connect-pg-simple";
import https from "https";
import fs from "fs";
import util from "util";
import pg from "pg";

const pgp = pgPromise();
const { Pool } = pg;

import inventoriesRouter from "./routes/inventory_functions/inventory_handling.js";
import getInvDetailsRouter from "./routes/inventory_functions/get_inv_details.js";
import { Server } from "http";
// Database connection and credentials
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPWD,
  port: process.env.PGPORT,
});

// Loading SSL certificate and key
/* const options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
}; */
//----------------------------Main------------------------------//
const app = express();
const server_port = process.env.PORT || 5600;

const server = https.createServer(app);
const io = Server(server);


app.get("/", (req, res) => {
  res.send("This is IMS Server root api");
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5800",
      "https://localhost:5800",
      "https://inventory-management-system-gold.vercel.app",
      "https://www.stockspheretrack.live",
      "https://inventory-handling.d2ml9helmogfuu.amplifyapp.com",
    ],
    credentials: true,
    sameSite: "none",
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

app.get("/products", checkAuthenticated, async (req, res) => {
  try {
    const client = await pool.connect();
    const productResult = await client.query(
      `select p.product_id, p.product_name, p.price, p.supplier_id 
      from ims_schema.users u, ims_schema.inventory i, ims_schema.products p,
      jsonb_array_elements(i.product_catalogue) as pc
      where u.user_code=$1 
      and u.user_name=i.user_name 
      and p.product_id=pc->>'productId'
      and i.inventory_id=$2`,
      [req.user_code, req.query.inventory]
    );
    const results = { results: productResult ? productResult.rows : null };
    client.release();
    console.log("product: ");
    console.log(results);
    return res.json(results);
  } catch (err) {
    console.log("Error in products");
    console.error(err);
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

//=======================Inventory Handling=========================//
app.use("/inventory", inventoriesRouter(pool));
app.use("/inventory", getInvDetailsRouter(pool));
//==================================================================//

//=======================Authentication Handling=========================//

const jwtVerify = util.promisify(jwt.verify);
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
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

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
    res.status(201).json({
      status: "success",
      message: "Server Response : User registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
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
      const user_name = user.user_name;
      console.log("Server Response : User Found :: " + user_name);
      const match = await bcrypt.compare(password, user.hash_pwd);
      if (match) {
        // User authenticated successfully
        const token = jwt.sign(
          { id: user.id, userCode: user.user_code },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
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
      res.status(401).json({
        status: "fail",
        message: "Server Response : Authentication Failed :: User not Found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "An error occurred during authentication",
    });
  } finally {
    client?.release();
  }
});

app.get("/check-login-status", (req, res) => {
  console.log("CLS: Checking login status");
  const token = req.cookies["token"];
  if (!token) {
    console.log("CLS: No token found");
    return res.json({ isAuthenticated: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("CLS: Invalid token");
      return res.json({ isAuthenticated: false });
    }
    console.log("CLS: Valid token");
    res.json({ isAuthenticated: true, user: user });
  });
});

// Middleware for checking authentication
export async function checkAuthenticated(req, res, next) {
  const token = req.cookies["token"];
  if (!token) {
    console.log("CA: No token found");
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    console.log("CA: Token found");
    const user = await jwtVerify(token, process.env.JWT_SECRET);
    req.user_code = user.userCode; // Attach user_code to req object
    next();
  } catch (err) {
    console.log("CA: Invalid token");
    console.log(err);
    return res.status(401).json({ message: "Not authenticated" });
  }
}

app.post("/logout", (req, res) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return res.json({ result: "failed", message: "Not authenticated" });
    }
    res.clearCookie("token");
    return res.json({ result: "success", message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
  }
});
//===============================================================================//

//Listening
// https.createServer(options, app).listen(server_port, () => {
//     console.log(`Server running at Port:${server_port}`);
//     const url = `https://localhost:${server_port}`;
//     console.log(`URL: ${url}`);
// });
app.listen(server_port, () => {
  console.log(`Server running at Port:${server_port}`);
  const url = `http://localhost:${server_port}`;
  console.log(`URL: ${url}`);
});
