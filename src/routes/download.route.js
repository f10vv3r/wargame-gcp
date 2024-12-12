const express = require("express");
const downloadController = require("../controllers/download.controller.js");

const router = express.Router();

router.get("/:fileName", downloadController.fileDownload);

module.exports = router;