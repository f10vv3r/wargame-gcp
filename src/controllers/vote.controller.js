const VoteModel = require('../models/vote.js');
const jwt = require("jsonwebtoken");
const SECRET_key = process.env.SECRET_key;

exports.vote = async (req, res) => {
    
    const token = req.cookies.session;
    const verified = jwt.verify(token, SECRET_key);
    const id = verified.id;
    const pro_idx = req.body.page;
    const difficulty = req.body.difficulty

    console.log(req.body);
    
    try{
        VoteModel.insertVoteValue

        const user = await VoteModel.whatUsrIdx(id);
        const check = await VoteModel.checkVote(user.usr_idx, pro_idx);

        if (check == 1) {
            res.send(`<script>alert("Warning: You have already voted"); window.location.href = '/wargame/problem?page=${pro_idx}';</script>`);
        } else {
            await VoteModel.insertVoteValue(user.usr_idx, pro_idx, difficulty);
            res.send(`<script>alert("Vote Success"); window.location.href = '/wargame/problem?page=${pro_idx}';</script>`);
        }
    } catch (err) {
        console.error("Error vote.controller.js => vote:", err);
        throw err;  
    }

};
