const express = require("express");
const forgotController = require("../controllers/forgot.controller.js");

const router = express.Router();

router.get("/", forgotController.renderForgotPage);

router.post("/", forgotController.checkUser);

module.exports = router;