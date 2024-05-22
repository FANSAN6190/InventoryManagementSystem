import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    console.log("SL2 :: Register");
    if (true) {
      res.status(201).send('SRL2 :: Registration successfull');
    } else {
      res.status(400).send('FRL2 :: Registration failed');
    }
  } catch (error) {
    error.route = "/register";
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    console.log("SL2 :: Login");
    if (true) {
      res.status(200).send('SRL2 :: Login successful');
    } else {
      res.status(401).send('FRL2 :: Login failed');
    }
  } catch (error) {
    error.route = '/login';
    next(error);
  }
});

router.get("/check-login-status", (req, res, next) => {
  try {
    console.log("SL2 :: Check Login Status");
    if (true) {
      res.status(200).send('SRL2 :: Active Session');
    } else {
      res.status(401).send('FRL2 :: No Active Session');
    }
  } catch (error) {
    error.route = '/check-login-status';
    next(error);
  }
});

router.post("/logout", (req, res, next) => {
  try {
    console.log("SL2 :: Logout");
    if (true) {
      res.status(200).send('SRL2 :: Logout successful');
    } else {
      res.status(400).send('FRL2 :: Logout failed');
    }
  } catch (error) {
    error.route = '/logout';
    next(error);
  }
});

router.use((err, req, res, next) => {
  console.error(`EL2 :: Error in route: ${err.route}`);
  console.error(err.stack);
  res.status(500).send('EL2 :: Something broke || ' + err);
});

export default router;