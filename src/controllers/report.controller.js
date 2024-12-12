const ReportModel = require('../models/report.js');
const jwt = require("jsonwebtoken");

const SECRET_key = process.env.SECRET_key;

exports.renderReportPage = async (req, res) => {
    
    try {
        const token = req.cookies.session;
        const proIdx = req.params.proIdx;
        const verified = jwt.verify(token, SECRET_key);
        const currentUsrId = verified.id;

        const proContent = await ReportModel.infoProblem(proIdx);  
        
        res.render("report", { 'posts': {currentUsrId, proContent}});

    } catch (error) {
        console.error("Error Controller report => renderReportPage:", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }

};

exports.insertReport = async (req, res) => {
    
    try {
        const token = req.cookies.session;
        const proIdx = req.params.proIdx;
        const content = req.body.report;
        const verified = jwt.verify(token, SECRET_key);
        const currentUsrId = verified.id;

        console.log(req.body);

        const usrIdx = await ReportModel.whatUsrIdx(currentUsrId);
        console.log(proIdx);
        await ReportModel.insertReport({usrIdx, currentUsrId, proIdx, content});
        res.send(`<script>alert("Thank you for reporting the issue. We will look into it as soon as possible."); window.location.href = '/wargame/problem?page=${proIdx}';</script>`);

    } catch (error) {
        console.error("Error Controller report => insertReport:", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/'</script>`);
    }

};


