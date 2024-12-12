const express = require("express");
const signupController = require("../controllers/signup.controller.js");

const router = express.Router();

router.get("/", signupController.renderSignupPage);

router.post("/", signupController.handleSignup);

module.exports = router;