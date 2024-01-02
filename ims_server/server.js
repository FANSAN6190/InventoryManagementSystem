require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const pgSession = require("connect-pg-simple")(session);
const https = require("https");
const fs = require("fs");
const util = require("util");

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

app.get("/products", checkAuthenticated, async (req, res) => {
  try {
    const client = await pool.connect();
    const productResult = await client.query(
      `select product_id, product_name, supplier_name,price,supplier_id 
      from ims_schema.users,ims_schema.inventory_stock,ims_schema.inventory 
      where user_code='${req.user_code}'and ims_schema.users.user_name=ims_schema.inventory.user_name 
      and ims_schema.inventory_stock.inventory_id=ims_schema.inventory.inventory_id;`
    );
    const results = { results: productResult ? productResult.rows : null };
    client.release();
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
app.use(express.json());
//=======================Inventory Handling=========================//


/* 
    const sendInventoryData = async (event) => {
        event.preventDefault();
        const AUdata=getInputInJson();
        if(AUdata==="" || (AUdata.inventoryName==="" && AUdata.inventoryId==="")){
            console.log("Please fill relevant details");
            return;
        }
        
        try {
          const response = await fetch("http://localhost:5600/add-update-inventory",
            {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(AUdata),
                credentials: 'include',
            })
            if (response.status === 200) {
                console.log("Inventory Registered");
            }
            else {
                console.log("Failed to Register Inventory, Try Again");
            }
            console.log(response);
        } catch (error) {
            console.error("Error:", error); 
            console.log("An error occured while registering inventory");
        }
        
    }; */
    
app.post("/add-update-inventory",checkAuthenticated, async (req, res) => {
  try{
    const client = await pool.connect();
    const { inventoryId, inventoryName, productCatalogue, isCreatingNewInventory} = req.body;
    const userCode=req.user_code;
    const userName=(await client.query(`SELECT user_name FROM ims_schema.users WHERE user_code='${userCode}';`)).rows[0].user_name;
    if(isCreatingNewInventory){
      const insertNewInventoryQuery=`INSERT INTO ims_schema.inventory(inventory_code,inventory_id,inventory_name,user_name,product_catalogue) 
      VALUES ($1,$2,$3,$4,$5)`;
      await client.query(insertNewInventoryQuery,[inventoryId,inventoryId,inventoryName,userName,productCatalogue]);
    }
  }catch(err){
    console.error(err);
  }
});


//==================================================================//


//=======================Authentication Handling=========================//

const jwtVerify = util.promisify(jwt.verify);
app.post("/register", async (req, res) => {
  const {
    userName, fullName, dob, email, countryCode, phoneNo, password, confirmPass} = req.body;
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
    const values = [userCode, userName, fullName, dob, email, countryCode, phoneNo, hashedPassword];
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
      user_name = user.user_name;
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

// Middleware for checking authentication
async function checkAuthenticated(req, res, next) {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const user = await jwtVerify(token, process.env.JWT_SECRET);
    req.user_code = user.userCode; // Attach user_code to req object

    next();
  } catch (err) {
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
