const mysql = require("mysql2/promise");
const md5 = require('md5');

require("dotenv").config({ path: __dirname + "/config/.env" });

const user = process.env.MySQL_user;
const pass = process.env.MySQL_pass;

const conn = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: user,
    password: pass,
    database: "wargame",
});

exports.signupUser = async (userData) => {
    const signup_query = 'INSERT INTO users (id, pw, email, class, flag) VALUES (?, ?, ?, 0, NULL);';

    try {
        const hashedPassword = md5(userData.pw);

        const [results] = await conn.query(signup_query, [userData.id, hashedPassword, userData.email]);

        return results;  

    } catch (err) {
        console.error("Error signing up user:", err);
        throw err;  
    }
};
