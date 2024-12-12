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

exports.checkUser = async (userData) => {
    const check_query = 'SELECT * FROM users WHERE id = ? AND email = ?;';
    
    try {
        const [userResult] = await conn.query(check_query, [userData.id, userData.email]);
        const user = userResult[0];

        console.log("| Model | forgot => checkUser | Success");
        return user; 
    } catch (error) {
        console.error("| Model | forgot => checkUser", error);  
        throw err;
    }
};

exports.updatePw = async (usrData) => {
    const class_query = 'UPDATE users SET pw = ? WHERE id = ?;';
    console.log(usrData)
    try {
        await conn.query(class_query, [md5(usrData.randStr), usrData.id]); 
        return 1;

    } catch (error) {
        console.error("Model | forgot => updatePw", error);  
        throw err; 
    }
};
