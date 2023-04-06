const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// returns the authorization token
router.post("/login", authController.login);

// creates new user
router.post("/register", authController.register);

module.exports = router;