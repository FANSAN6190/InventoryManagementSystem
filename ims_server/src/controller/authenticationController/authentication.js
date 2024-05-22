import express from "express";
import bcrypt from "bcrypt";
import util from "util";
import pkg from "pg";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pool from '../../config/DBConfig.js'

dotenv.config();

const router = express.Router();
const jwtVerify = util.promisify(jwt.verify);

router.post("/register", async (req, res) => {
  
  try {
    RegisterService(req.body);
    // Send a success response
    res.status(201).json({
      status: "success",
      message: "Server Response : User registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

router.post("/login", async (req, res) => {
  let client;
  try {
    const client = await pool.connect();
    const { email, phone, password } = req.body;
    const userResult = await client.query(
      "SELECT user_code, hash_pwd FROM ims_schema.users WHERE email = $1 AND phone_no = $2",
      [email, phone]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const user_code = user.user_code;
      console.log("Server Response : User Found :: " + user_code);
      const match = await bcrypt.compare(password, user.hash_pwd);
      if (match) {
        // User authenticated successfully
        const token = jwt.sign(
          {userCode: user.user_code, email: user.email},
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
        console.log("Server Response : Authentication failed");
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

router.get("/check-login-status", (req, res) => {
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

router.post("/logout", (req, res) => {
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

export default router;