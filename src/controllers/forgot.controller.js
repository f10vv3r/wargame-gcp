const ForgotModel = require('../models/forgot.js');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const e = require('express');

const SECRET_key = process.env.SECRET_key;
const GOOGGLE_id = process.env.GOOGGLE_id;
const GOOGGLE_pw = process.env.GOOGGLE_pw;

const sendMail = async (mail) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: GOOGGLE_id,
                pass: GOOGGLE_pw,
            },
        });

        await transporter.sendMail({
            ...mail,
        });
    } catch (error) {
        console.error("Controller | forgot => checkUser => sendMail | ", error);
    }
};

const resetPasswordMail = async (authNum, to) => {
    const mail = {
        from: "[f10w3r_Wargame]",
        to: to,
        subject: `[f10w3r_Wargame] 비밀번호 재설정 안내 메일입니다.`,
        text: `귀하의 비밀번호가 다음과 같이 변경되었음을 안내드립니다.`,
        html: `<div style="color: black"><ul style="font-size: 16px; background: #eee; border-radius: 10px; padding: 15px; list-style: none">
          <li>비밀번호: ${authNum}</li>
          <li>* 비밀번호 입력 후 비밀번호를 재설정하세요.</li>
      </ul>
      <p style="margin-top: 35px; text-align: center; font-size: 18px">[f10w3r_Wargame]</p>
      <p style="margin-top: 15px; text-align: center; font-size: 12px; color: '#999'">
          본 메일은 발신 전용입니다.
      </p></div>`,
    };
    return await sendMail(mail);
};

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const randStr = generateRandomString(8);

exports.renderForgotPage = (req, res) => {
    res.render("forgot");
};

exports.checkUser = async (req, res) => {
    const { id, email } = req.body;
    console.log(req.body);

    try {
        const oldToken = req.cookies.session;
        if (oldToken) {
            const verified = jwt.verify(oldToken, SECRET_key);

            if (verified.id == id) {
                //section 1
                const user = await ForgotModel.checkUser({ id, email });
                await resetPasswordMail(randStr, email);
                await ForgotModel.updatePw({randStr, id})
                console.log(user);
                return res.send(`<script>alert("Email sent successfully"); window.location.href = '/login';</script>`);

            } else {
                console.log(verified.id, "| Controller | forgot => checkUser | Fail");
                return res.send(`<script>alert("Access restricted. This attempt will be reported to the administrator"); window.location.href = '/';</script>`);
            }
        }
        //section 2
        const user = await ForgotModel.checkUser({ id, email })
        await resetPasswordMail(randStr, email);
        await ForgotModel.updatePw({randStr, id})
        console.log(user);
        return res.send(`<script>alert("Email sent successfully"); window.location.href = '/login';</script>`);

    } catch (error) {
        console.error("Controller | forgot => checkUser | ", error);
        return res.send(`<script>alert("Warning: Invalid ID/Email"); window.location.href = '/login';</script>`);
    }

};