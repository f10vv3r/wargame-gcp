const express = require("express");
const errorController = require("../controllers/error.controller.js");

const router = express.Router();

router.get("/", errorController.renderErrorPage);

module.exports = router;