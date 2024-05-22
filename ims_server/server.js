import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import pg from "pg";

const { Pool } = pg;

import inventoriesRouter from "./src/controller/inventoryController/inventory_handling.js";
import getInvDetailsRouter from "./src/controller/inventoryController/get_inv_details.js";
import authenticationRouter from "./src/controller/authenticationController/authentication.js";
import { checkAuthenticated } from "./src/controller/authenticationController/authentication.js";

import pool from './src/config/DBConfig.js'

import { Server } from "http";

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
      and u.user_code=i.user_code 
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
app.use("/auth", authenticationRouter);
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
