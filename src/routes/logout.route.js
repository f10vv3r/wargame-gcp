const express = require("express");
const logoutController = require("../controllers/logout.controller.js");

const router = express.Router();

router.get("/", logoutController.userLogout);

module.exports = router;