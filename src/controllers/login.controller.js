const LoginModel = require('../models/login.js');
const jwt = require("jsonwebtoken");

const SECRET_key = process.env.SECRET_key;

exports.renderLoginPage = (req, res) => {
    res.render("login");
};

exports.handleLogin = async (req, res) => {
    const { id, pw } = req.body;

    try {
        const user = await LoginModel.loginUser({ id, pw });
        const userClass = await LoginModel.classCheck({ id });
        
        console.log(user);
        
        const token = jwt.sign({ id: user.id, class: userClass }, SECRET_key, { algorithm: "HS256" });

        res.cookie("session", token, { httpOnly: true, secure: false, sameSite: 'Strict' });

        res.send(`<script>alert("Login Success"); window.location.href = '/wargame';</script>`);
    } catch (err) {
        console.error(err);
        return res.send(`<script>alert("Warning: Invalid ID/PW"); window.location.href = '/login';</script>`);
    }

};