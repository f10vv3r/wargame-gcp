const WargameModel = require('../models/wargame.js');
const jwt = require("jsonwebtoken");

const SECRET_key = process.env.SECRET_key;

exports.renderWargamePage = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        jwt.verify(token, SECRET_key);

        const { count, content } = await WargameModel.infoProblem();
        const user = await WargameModel.infoUser(verified.id);
        console.log(user);
        res.render("wargame", { 'posts': {count, content, user} }); 


    } catch (error) {
        console.error("JWT verification failed:", error);  
        return res.send(`<script>alert("Invalid Token. Please Login again."); window.location.href = '/';</script>`);
    }

};
