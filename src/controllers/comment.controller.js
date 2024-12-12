const CommentModel = require('../models/comment.js');
const jwt = require("jsonwebtoken");
const SECRET_key = process.env.SECRET_key;

exports.insertComment = async (req, res) => {
    
    const token = req.cookies.session;
    const proContent = req.body;
    const comment = req.body.comment;
    let comGroup = req.body.com_idx;
    let depth = req.body.depth;
    const proIdx = proContent.pro_idx;
    const verified = jwt.verify(token, SECRET_key);
    const id = verified.id;

    if (!comment) {
        return res.send(`<script>alert("Enter Comment"); window.location.href = '/wargame/problem?page=${proContent.pro_idx}';</script>`);
    }

    try{
        console.log(req.body);
        if (!depth) {
            depth = 0;
        }
        if (typeof comGroup === 'undefined') {
            comGroup = 0;
        }

        const usrIdx = await CommentModel.whatUsrIdx({id});
        await CommentModel.insertComment({comGroup, usrIdx, proIdx, comment, id, depth});
       
        return res.send(`<script>window.location.href = '/wargame/problem?page=${proContent.pro_idx}';</script>`);
    } catch (err) {
        console.error("Error comment.js => insertComment:", err);
        throw err;  
    }

};

exports.deleteComment = async (req, res) => {
    
    const token = req.cookies.session;
    const comIdx = req.params.comIdx
    jwt.verify(token, SECRET_key);

    console.log(comIdx);

    try{
        const proContent = await CommentModel.whatProIdx({comIdx});
        await CommentModel.deleteComment({comIdx});
        return res.send(`<script>window.location.href = '/wargame/problem?page=${proContent}';</script>`);
    } catch (err) {
        console.error("Error comment.js => insertComment:", err);
        throw err;  
    }

};

exports.editComment = async (req, res) => {
    
    const token = req.cookies.session;
    const comIdx = req.body.comIdx
    const editText = req.body.editText
    jwt.verify(token, SECRET_key);

    console.log(comIdx);

    try{
        const proContent = await CommentModel.whatProIdx({comIdx});
        await CommentModel.editComment({comIdx, editText});
        return res.send(`<script>window.location.href = '/wargame/problem?page=${proContent}';</script>`);
    } catch (err) {
        console.error("Error comment.js => insertComment:", err);
        throw err;  
    }

};