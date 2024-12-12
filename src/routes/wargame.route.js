const express = require("express");

const wargameController = require("../controllers/wargame.controller.js");
const problemController = require("../controllers/problem.controller.js");
const voteController = require("../controllers/vote.controller.js");
const uploadController = require("../controllers/upload.controller.js");
const commentController = require("../controllers/comment.controller.js");
const reportController = require("../controllers/report.controller.js");

const router = express.Router();

router.get("/", wargameController.renderWargamePage);

router.get("/problem", problemController.renderProblemPage);
router.post("/problem", problemController.checkFlag);

router.post("/problem/vote", voteController.vote);

router.post("/problem/comment", commentController.insertComment);
router.post("/problem/comment/edit", commentController.editComment);
router.get("/problem/comment/delete/:comIdx", commentController.deleteComment);

router.get("/problem/report/:proIdx", reportController.renderReportPage);
router.post("/problem/report/:proIdx", reportController.insertReport);

router.get("/upload", uploadController.renderUploadPage);
router.post("/upload", (req, res, next) => {
    
    uploadController.uploadMiddleware(req, res, (err) => {
        if (err) {
            return res.send(`<script>alert("Warning: Upload Fail"); window.location.href = '/';</script>`);
        }
        
        next();
    });
}, uploadController.handleUpload);

module.exports = router;