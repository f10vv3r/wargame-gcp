const mysql = require("mysql2/promise"); 
const md5 = require('md5');

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

exports.infoUser = async (usrData) => {
    const info_query = 'SELECT * FROM users WHERE id = ?;';

    try {
        const [userInfoResult] = await conn.query(info_query, usrData); 
        const usrContent = userInfoResult[0]; 

        return usrContent; 
    } catch (err) {
        console.error("Error Models user.js => infoUser:", err);
        throw err;  
    }
};

exports.usrCount = async () => {
    const info_query = 'SELECT COUNT(*) AS count FROM users;';

    try {
        const [usrCountResult] = await conn.query(info_query); 
        const usrCount = usrCountResult[0].count; 
        console.log(usrCount);
        return usrCount; 
    } catch (err) {
        console.error("Error Models user.js => infoUser:", err);
        throw err;  
    }
};

exports.infoScore = async () => {
    const info_query = 'select * from users order by score DESC;';

    try {
        const [scoreContent] = await conn.query(info_query); 

        return scoreContent; 
    } catch (err) {
        console.error("Error Models user.js => infoScore:", err);
        throw err;  
    }
};

exports.modPassword = async (usrData) => {
    const mod_query = 'UPDATE users SET pw = ? WHERE id = ?;';
    const newPassword = usrData.newPassword;
    const currentId = usrData.currentId;
    try {
        await conn.query(mod_query, [md5(newPassword), currentId]); 
        return 1;
    } catch (err) {
        console.error("Error Models user.js => modPassowrd:", err);
        throw err;  
    }
};


exports.deleteAccount = async (usrData) => {
    const info_query = 'SELECT usr_idx FROM users WHERE id = ?;';
    const deleteUsers_query =    'DELETE FROM users WHERE usr_idx = ?';
    const deleteProblems_query = 'DELETE FROM problems WHERE usr_idx = ?';
    const deleteComments_query = 'DELETE FROM comments WHERE usr_idx = ?';
    const deleteVotes_query =    'DELETE FROM votes WHERE usr_idx = ?';

    try {
        const [usrIdxResult] = await conn.query(info_query, usrData); 
        const usrIdx = usrIdxResult[0].usr_idx; 

        console.log(usrIdx);

        await conn.query(deleteVotes_query, usrIdx);
        await conn.query(deleteComments_query, usrIdx);
        await conn.query(deleteProblems_query, usrIdx);
        await conn.query(deleteUsers_query, usrIdx);

    } catch (err) {
        console.error("Error Models user.js => infoUser:", err);
        throw err;  
    }
};