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

exports.loginUser = async (userData) => {
    const login_query = 'SELECT * FROM users WHERE id = ? AND pw = ?;';
    
    try {
        const [userResult] = await conn.query(login_query, [userData.id, md5(userData.pw)]);
        const user = userResult[0];

        return user; 
    } catch (err) {
        console.error("Error fetching login result:", err);
        throw err;
    }
};

exports.classCheck = async (userData) => {
    const class_query = 'SELECT class FROM users WHERE id = ?;';

    try {
        const [userClassResult] = await conn.query(class_query, [userData.id]); 
        const userClass = userClassResult[0].class; 

        return userClass;

    } catch (err) {
        console.error("Error fetching class check:", err);
        throw err; 
    }
};
