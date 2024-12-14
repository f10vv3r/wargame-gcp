const mysql = require("mysql2/promise"); 

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

exports.insertComment = async (comData) => {
    const comment_query = 'INSERT INTO comments (com_group, usr_idx, usr_id, pro_idx, text, depth) VALUES (?, ?, ?, ?, ?, ?);';
    console.log(comData);
    parseInt(comData.proIdx, 10);
    parseInt(comData.comGroup, 10);
    
    try {
        await conn.query(comment_query, [comData.comGroup, comData.usrIdx, comData.id, comData.proIdx, comData.comment, comData.depth])
        return 1;
    } catch (err) {
        console.error("Error Models comment.js => insertComments:", err);
        throw err;
    }
};

exports.editComment = async (comData) => {
    const delete_query = 'UPDATE comments SET text = ? WHERE com_idx = ?';
    console.log(comData);
    
    try {
        await conn.query(delete_query, [comData.editText, comData.comIdx])
        return 1;
    } catch (err) {
        console.error("Error Models comment.js => editComment:", err);
        throw err;
    }
};


exports.deleteComment = async (comData) => {
    const delete_query = 'DELETE FROM comments WHERE com_idx = ?';
    console.log(comData);
    parseInt(comData.proIdx, 10);
    parseInt(comData.comGroup, 10);
    
    try {
        await conn.query(delete_query, [comData.comIdx])
        return 1;
    } catch (err) {
        console.error("Error Models comment.js => deleteComment:", err);
        throw err;
    }
};

exports.whatUsrIdx = async (userData) => {
    const user_query = 'SELECT usr_idx FROM users WHERE id = ?';

    try {
        const [usrIdxResult] = await conn.query(user_query, userData.id); 
        const usrIdx = usrIdxResult[0].usr_idx; 

        return usrIdx; 
    } catch (err) {
        console.error("Error models comment.js => whatUsrIdx :", err);
        throw err;  
    }
}

exports.whatProIdx = async (comData) => {
    const pro_query = 'SELECT pro_idx FROM comments WHERE com_idx = ?';

    try {
        const [proIdxResult] = await conn.query(pro_query, comData.comIdx); 
        console.log("asdasdadas",proIdxResult);
        const proIdx = proIdxResult[0].pro_idx; 

        return proIdx; 
    } catch (err) {
        console.error("Error models comment.js => whatProIdx :", err);
        throw err;  
    }
}