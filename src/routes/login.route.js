const express = require("express");
const loginController = require("../controllers/login.controller.js");

const router = express.Router();

router.get("/", loginController.renderLoginPage);

router.post("/", loginController.handleLogin);

module.exports = router;