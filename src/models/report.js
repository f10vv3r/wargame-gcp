const mysql = require("mysql2/promise"); 

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

exports.infoProblem = async (proData) => {
    const info_query = 'SELECT * FROM problems WHERE pro_idx = ?;';

    try {
        const [proInfoResult] = await conn.query(info_query, proData); 
        const proContent = proInfoResult[0]; 

        return proContent; 
    } catch (err) {
        console.error("Error Models report.js => infoProblem:", err);
        throw err;  
    }
};

exports.whatUsrIdx = async (usrData) => {
    const user_query = 'SELECT usr_idx FROM users WHERE id = ?';

    try {
        const [userIdxResult] = await conn.query(user_query, usrData); 
        const usrIdx = userIdxResult[0].usr_idx; 

        return usrIdx; 
    } catch (err) {
        console.error("Error Models report.js => whatUsrIdx:", err);
        throw err;  
    }
}


exports.insertReport = async (usrData) => {
    const insert_query = 'INSERT INTO reports (usr_idx, usr_id, pro_idx, content) VALUES (?, ?, ?, ?);';
    

    try {
        await conn.query(insert_query, [usrData.usrIdx, usrData.currentUsrId, usrData.proIdx, usrData.content]); 
        return 1; 
    } catch (err) {
        console.error("Error Models report.js => whatUsrIdx:", err);
        throw err;  
    }
};