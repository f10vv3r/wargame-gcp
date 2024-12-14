const mysql = require("mysql2/promise");
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

require("dotenv").config({ path: __dirname + "/config/.env" });

const user = process.env.MySQL_user;
const pass = process.env.MySQL_pass;
const mysqlPort = process.env.MySQL_port;
const host = process.env.DB_host;

const conn = mysql.createPool({
    host: host,
    port: mysqlPort,
    user: user,
    password: pass,
    database: "wargame",
});

exports.uploadProblem = (problemData, callback) => {
    const upload_query = 'INSERT INTO problems (usr_idx, title, text, category, score, flag, file) VALUES (?, ?, ?, ?, ?, ?, ?);';
    const upload_server_query = 'INSERT INTO problems (usr_idx, title, text, category, score, flag, port, file) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
    
    if (problemData.category == 'Web' || problemData.category == 'Pwn') {
        conn.query(upload_server_query, [problemData.usrIdx.usr_idx ,problemData.title, problemData.text, problemData.category, problemData.score, problemData.flag, problemData.port, problemData.releaseFileName], (err, results) => {
            if (err) {
                return callback(err); 
            }
            callback(null, results);
        });
    } else {
        conn.query(upload_query, [problemData.usrIdx.usr_idx ,problemData.title, problemData.text, problemData.category, problemData.score, problemData.flag, problemData.releaseFileName], (err, results) => {
            if (err) {
                return callback(err); 
            }
            callback(null, results);
        });
    }
};

exports.whatUsrIdx = async (usrData) => {
    const user_query = 'SELECT usr_idx FROM users WHERE id = ?';

    try {
        const [usrIdxResult] = await conn.query(user_query, usrData); 
        const useIdx = usrIdxResult[0]; 

        return useIdx; 
    } catch (err) {
        console.error("Error to finding user info:", err);
        throw err;  
    }
}