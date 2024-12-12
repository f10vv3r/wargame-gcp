const express = require("express");
const userController = require("../controllers/user.controller.js");

const router = express.Router();

router.get("/", userController.renderUserPage);
router.post("/", userController.deleteAccount);
router.post("/modification", userController.modPassword);
module.exports = router;