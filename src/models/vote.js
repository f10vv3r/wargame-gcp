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

exports.insertVoteValue = async (usr_idx, pro_idx, difficulty) => {
    const insertVote_query = 'INSERT INTO votes (usr_idx, pro_idx, vote_value) VALUES (?, ?, ?);';

    const usrIdx = parseInt(usr_idx, 10);
    const proIdx = parseInt(pro_idx, 10);
    const difficultyInt = parseInt(difficulty, 10);

    try {   
        await conn.query(insertVote_query, [usrIdx, proIdx, difficultyInt]);
        return 1;
    } catch (err) {
        console.error("Error vote.js => insertVoteValue:", err);
        throw err;  
    }
} 

exports.checkVote = async (usr_idx, pro_idx) => {
    const insertVote_query = 'SELECT * FROM votes WHERE usr_idx = ? AND pro_idx = ?';

    const usrIdx = parseInt(usr_idx, 10);
    const proIdx = parseInt(pro_idx, 10);

    try {   
        const [check] = await conn.query(insertVote_query, [usrIdx, proIdx]);
        console.log(check[0]);
        if (check[0]) {
            return 1;
        } else {
            return 0;
        }

    } catch (err) {
        console.error("Error vote.js => insertVoteValue:", err);
        throw err;  
    }
} 

exports.whatUsrIdx = async (usrData) => {
    const user_query = 'SELECT usr_idx FROM users WHERE id = ?';

    try {
        const [usrIdxResult] = await conn.query(user_query, usrData); 
        const useIdx = usrIdxResult[0]; 
        return useIdx; 
    } catch (err) {
        console.error("Error vote.js => whatUsrIdx:", err);
        throw err;  
    }
}