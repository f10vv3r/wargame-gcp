const UserModel = require('../models/user.js');
const jwt = require("jsonwebtoken");

const SECRET_key = process.env.SECRET_key;

exports.renderUserPage = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        const currentId = verified.id;

        const currentUser = await UserModel.infoUser(currentId);
        const scoreList = await UserModel.infoScore();
        const usrCount = await UserModel.usrCount();
        console.log(currentUser);


        res.render("user", { 'posts': { currentUser, scoreList, usrCount } });
    } catch (error) {
        console.error("Error Controller user.controller.js => renderUserPage:", error);
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }

};

exports.deleteAccount = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        const currentId = verified.id;
        
        await UserModel.deleteAccount(currentId);

        res.clearCookie("session", { httpOnly: true, secure: false, sameSite: 'Strict' });
        return res.send(`<script>alert("Success Account Deletion"); window.location.href = '/';</script>`);
    } catch (error) {
        console.error("Error Controller user => renderUserPage:", error);
        return res.send(`<script>alert("Warning: Incorrect Approach"); window.location.href = '/';</script>`);
    }

};

exports.modPassword = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        const currentId = verified.id;
        console.log(req.body.pw);
        const newPassword = req.body.pw;

        if (!newPassword) {
            return res.send(`<script>alert("Please enter ID, Email, and Password."); window.location.href = '/user';</script>`);
        }
    
        const pwRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!pwRegex.test(newPassword)) {
            return res.send(`<script>alert("Password must be at least 8 characters long, and include one number and one special character."); window.location.href = '/user';</script>`);
        }

        await UserModel.modPassword({ currentId, newPassword });

        return res.send(`<script>alert("Success Modification Password"); window.location.href = '/user';</script>`);
    } catch (error) {
        console.error("Error Controller user => modPassword:", error);
        return res.send(`<script>alert("Warning: Incorrect Approach"); window.location.href = '/';</script>`);
    }

};
