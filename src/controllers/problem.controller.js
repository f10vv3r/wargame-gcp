const ProblemModel = require('../models/problem.js');
const jwt = require("jsonwebtoken");

const SECRET_key = process.env.SECRET_key;

exports.renderProblemPage = async (req, res) => {
    
    try {
        const token = req.cookies.session;
        const page = req.query.page || req.body.pro_idx;
        const verified = jwt.verify(token, SECRET_key);
        const currentUsrId = verified.id;
        const currentUsrClass = verified.class;

        const problemContent = await ProblemModel.infoProblem(page);
        const commentContent = await ProblemModel.infoComment(page);
        const difficulty = await ProblemModel.checkDifficulty(page);
        const writerId = await ProblemModel.whoUser(problemContent.usr_idx);
        const currentUsrIdx= await ProblemModel.whoUsrIdx(currentUsrId);
        const currentUsrContent= await ProblemModel.userContent(currentUsrId);
    
        console.log(currentUsrContent);
        
        res.render("problem", { 'posts': { problemContent, writerId, currentUsrId, currentUsrIdx, currentUsrClass, currentUsrContent, difficulty, commentContent}});

    } catch (error) {
        console.error("Error Controller problem => renderProblemPage:", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }

};

exports.checkFlag = async (req, res) => {
    const flag = req.body.flag;
    const score = req.body.score;
    const proTitle = req.body.proTitle;
    const page = req.query.page;
  
    const token = req.cookies.session;
    const verified = jwt.verify(token, SECRET_key);
    const id = verified.id;
    let status;
    console.log(req.body);

    try {
        status = "incorrct";
        const usrIdx = await ProblemModel.whoUsrIdx(id);
        const result = await ProblemModel.resultCheckFlag(page, flag);
       
        if (result) {
            status = "corrct";
            await ProblemModel.resultInsertFlag(page, score, id);
            await ProblemModel.insertFlagLog({page, proTitle, usrIdx, id, flag, status});
             return res.send(`<script>alert("Correct flag"); window.location.href = '/wargame/problem?page=${page}';</script>`);
        } else {
            await ProblemModel.insertFlagLog({page, proTitle, usrIdx, id, flag, status});
            return res.send(`<script>alert("Incorrect flag"); window.location.href = '/wargame/problem?page=${page}';</script>`);
        }


    } catch (error) {
        console.error("Error Controller => problem.controller.js:", error);  
        return res.send(`<script>alert("Incorrect flag"); window.location.href = '/wargame/problem?page=${page}';</script>`);
    }
};

