const express = require("express");
const multer = require('multer');
const path = require('path');

const adminController = require("../controllers/admin.controller.js");

const router = express.Router();

router.get("/", adminController.renderAdminPage);

router.get("/problem/edit/:proIdx", adminController.proEditPageRender);
router.post("/problem/edit/:proIdx", (req, res, next) => {
    
    adminController.uploadMiddleware(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.send(`<script>alert("Warning: Upload Fail"); window.location.href = '/';</script>`);
        }
        
        next();
    });
}, adminController.editProblem);
router.get("/problem/delete/:proIdx", adminController.deleteProblem);
router.get("/user/ban/:usrIdx", adminController.banUser);
router.get("/report/check/:repIdx", adminController.checkReport);
module.exports = router;