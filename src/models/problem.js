const mysql = require("mysql2/promise"); 
const md5 = require('md5');
const { vote } = require("../controllers/vote.controller");

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

exports.infoProblem = async (proData) => {
    const info_query = 'SELECT * FROM problems WHERE pro_idx = ?;';

    try {
        const [problemInfoResult] = await conn.query(info_query, proData); 
        const proContent = problemInfoResult[0]; 

        return proContent; 
    } catch (err) {
        console.error("Error fetching problem info:", err);
        throw err;  
    }
};

exports.infoComment = async (proData) => {
    const info_query = 'SELECT * FROM comments WHERE pro_idx = ? ORDER BY depth ASC, com_time DESC;';

    try {
        const [commentInfoResult] = await conn.query(info_query, proData); 
        const comContent = commentInfoResult; 

        return comContent; 
    } catch (err) {
        console.error("Error Models problem.js infoComment:", err);
        throw err;  
    }
};

exports.resultCheckFlag = async (pro_idx, flag) => {
    const check_query = `SELECT * FROM problems WHERE pro_idx = ? AND flag = ?;`;

    try {
        const [checkFlagResult] = await conn.query(check_query, [pro_idx, flag]); 
        const proContent = checkFlagResult[0]; 

        return proContent; 
    } catch (err) {
        console.error("Error checking flag:", err);
        throw err;  
    }
};

exports.insertFlagLog = async (logData) => {
    const insert_query = 'INSERT INTO flag_log (pro_idx, pro_title, usr_idx, usr_id, flag, status) VALUES (?, ?, ?, ?, ?, ?);';

    try {
        await conn.query(insert_query, [logData.page, logData.proTitle, logData.usrIdx, logData.id, logData.flag, logData.status]); 
        return 1; 
    } catch (err) {
        console.error("Error checking flag:", err);
        throw err;  
    }
};

exports.resultInsertFlag = async (pro_idx, score, id) => {
    const fetch_query = `UPDATE users SET flag = ? WHERE id = ?;`;
    const search_query = `SELECT score, flag FROM users WHERE id = ?`;
    const scoreUpdate_query = `UPDATE users SET score = ? WHERE id = ?;`;

    try {
        const [searchScoreResult] = await conn.query(search_query, [id]);
        
        if (!searchScoreResult[0]) {
            throw new Error("User not found");
        }

        let userScore = searchScoreResult[0].score;
        let flag = searchScoreResult[0].flag;

        score = parseInt(score, 10);
        userScore = parseInt(userScore, 10);

        let flagObj = { "pro_idx": [] }; 
        
        if (flag) {
            if (typeof flag === 'string') {
                try {
                    flagObj = JSON.parse(flag);
                    console.log("Parsed flag:", flagObj); 
                } catch (err) {
                    console.error("Error parsing flag:", err);
                    throw new Error("Invalid flag data format");
                }
            } else if (typeof flag === 'object') {
                flagObj = flag;
                console.log("Flag is already an object:", flagObj); 
            } else {
                console.log("Invalid flag format:", flag); 
                throw new Error("Invalid flag format");
            }
        }

        if (!flagObj.pro_idx.includes(pro_idx)) {
            userScore += score;
            await conn.query(scoreUpdate_query, [userScore, id]);
            
            console.log(`Adding pro_idx: ${pro_idx} to the array`); 
            flagObj.pro_idx.push(pro_idx); 
        } else {
            console.log(`pro_idx: ${pro_idx} already exists in flag`); 
        }

        const flagValue = JSON.stringify(flagObj);

        await conn.query(fetch_query, [flagValue, id]);

        return { pro_idx, score, id };

    } catch (err) {
        console.error("Error in resultInsertFlag:", err);
        throw err;
    }
};

exports.checkDifficulty = async (pro_idx) => {
    const setDifficultyLevel_query = 'SELECT vote_value FROM votes WHERE pro_idx = ? GROUP BY vote_value ORDER BY COUNT(*) DESC LIMIT 1;';
    const proIdx = parseInt(pro_idx, 10);
    
    try {   
        const [voteValue] = await conn.query(setDifficultyLevel_query, proIdx);
        return voteValue[0].vote_value;
    } catch (err) {
        return 0;
    }
} 

exports.userContent = async (usrData) => {
    const user_query = 'SELECT * FROM users WHERE id = ?';

    try {
        const [usrContent] = await conn.query(user_query, usrData);  
        return usrContent[0]; 
    } catch (err) {
        console.error("Error Models problem.js => userContent:", err);
        throw err;  
    }
}

exports.whoUser = async (usrData) => {
    const user_query = 'SELECT id FROM users WHERE usr_idx = ?';

    try {
        const [userIdResult] = await conn.query(user_query, usrData); 
        const userId = userIdResult[0]; 

        return userId; 
    } catch (err) {
        console.error("Error Models problem.js => whoUser:", err);
        throw err;  
    }
}

exports.whoUsrIdx = async (usrData) => {
    const user_query = 'SELECT usr_idx FROM users WHERE id = ?';

    try {
        const [userIdxResult] = await conn.query(user_query, usrData); 
        const userIdx = userIdxResult[0]; 

        return userIdx; 
    } catch (err) {
        console.error("Error Models problem.js => whoUsrIdx:", err);
        throw err;  
    }
}

exports.whoCommentUser = async (usrData) => {
    const user_query = 'SELECT id FROM comments WHERE usr_idx = ?';

    try {
        const [userIdResult] = await conn.query(user_query, usrData); 
        const userId = userIdResult[0]; 

        return userId; 
    } catch (err) {
        console.error("Error Models problem.js => whoCommentUser:", err);
        throw err;  
    }
}