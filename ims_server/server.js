import dotenv from "dotenv";
dotenv.config();
import express from "express";
import https from "https";

import authenticationRouter from "./src/controller/authenticationController/Authentication.js";

const app = express();
const server_port = process.env.PORT || 5600;

const server = https.createServer(app);

app.get("/", (req, res) => {
  try {
    console.log("SL2 :: Root call");
    let condition = true; //default
    if (condition) {
      res.send("RL1 :: This is IMS Server root api");
    } else {
      res.status(400).send('FRL2 :: Root call failed');
    }
  } catch (error) {
    error.route = "/";
    next(error);
  }
});

app.use("/auth", authenticationRouter);

app.listen(server_port, () => {
  console.log(`Server running at Port:${server_port}`);
  const url = `http://localhost:${server_port}`;
  console.log(`URL: ${url}`);
});
