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

exports.infoProblem = async () => {
    const count_query = 'SELECT COUNT(*) AS count FROM problems;';
    const content_query = 'SELECT * FROM problems;';

    try {
        const [countResults] = await conn.query(count_query); 
        const [problem] = await conn.query(content_query);

        const count = countResults[0].count;  
        return { count, problem }; 

    } catch (err) {
        console.error("Error admin models  => infoProblem:", err);
        throw err;  
    }
};

exports.infoReport = async () => {
    const count_query = 'SELECT COUNT(*) AS count FROM reports;';
    const info_query = "SELECT * FROM reports;";

    try {
        const [countResult] = await conn.query(count_query);
        const [report] = await conn.query(info_query);
        
        const count = countResult[0].count;
        return { count, report }; 

    } catch (err) {
        console.error("Error admin models  => infoReports:", err);
        throw err;  
    }
};

exports.infoUser = async () => {
    const count_query = 'SELECT COUNT(*) AS count FROM users;';
    const info_query = "SELECT * FROM users;";

    try {
        const [countResult] = await conn.query(count_query);
        const [user] = await conn.query(info_query);
        
        const count = countResult[0].count;
        return { count, user }; 

    } catch (err) {
        console.error("Error admin models  => infoUser:", err);
        throw err;  
    }
};

exports.infoCurrentUser = async (id) => {
    const user_query = "SELECT * FROM users WHERE id = ?;";

    try {
        const [user] = await conn.query(user_query, id);
        const userInfo = [user][0][0];
        return { userInfo }; 

    } catch (err) {
        console.error("Error admin models  => infoUser:", err);
        throw err;  
    }
};

exports.infoFlagLog = async () => {
    const user_query = "SELECT * FROM flag_log ORDER BY flg_time DESC;";

    try {
        const [flagLog] = await conn.query(user_query);
        return flagLog; 

    } catch (err) {
        console.error("Error admin models  => infoFlagLog:", err);
        throw err;  
    }
};

exports.infoEditProblem = async (proIdx) => {
    const user_query = "SELECT * FROM problems WHERE pro_idx = ?;";

    try {
        const [problem] = await conn.query(user_query, proIdx);
        return problem;
    } catch (err) {
        console.error("Error admin models  => infoUser:", err);
        throw err;  
    }
};

exports.editProblemNotFile = async (ediContent) => {
    const update_query = "UPDATE problems SET title = ?, text = ?, category = ?, flag = ?, score = ?, port = ? WHERE pro_idx = ?;";
    const proIdx = ediContent.proIdx; 
    const title = ediContent.title; 
    const text = ediContent.text; 
    const category = ediContent.category; 
    const flag = ediContent.flag; 
    const score = ediContent.score; 
    const port = ediContent.port; 

    console.log(ediContent);
    try {
        await conn.query(update_query, [title, text, category, flag, score, port, proIdx]);
        return 1;
    } catch (err) {
        console.error("Error admin models  => editProblemNotFile:", err);
        throw err;  
    }
};

exports.editProblem = async (ediContent) => {
    try {
        const delete_query = "UPDATE problems SET title = ?, text = ?, category = ?, flag = ?, score = ?, port = ?, file = ? WHERE pro_idx = ?;";
        const proIdx = ediContent.proIdx; 
        const title = ediContent.title; 
        const text = ediContent.text; 
        const category = ediContent.category; 
        const flag = ediContent.flag; 
        const score = ediContent.score; 
        const port = ediContent.port;
        const file = ediContent.fileName; 
    
    
        await conn.query(delete_query,  [title, text, category, flag, score, file, port, proIdx]);
        return 1;
    } catch (err) {
        console.error("Error admin models  => editProblem:", err);
        throw err;  
    }
};


exports.deleteProblem = async (ediContent) => {
    const delete_query = "DELETE FROM problems WHERE pro_idx = ?;";
    
    try {
        await conn.query(delete_query, [ediContent]);
        return 1;
    } catch (err) {
        console.error("Error admin models  => deleteProblem:", err);
        throw err;  
    }
};

exports.banUser = async (usrIdx) => {
    const delete_query = "DELETE FROM reports WHERE usr_idx = ?;";
    try {
        await conn.query(delete_query, [usrIdx]);
        return 1;
    } catch (err) {
        console.error("Error admin models  => banUser:", err);
        throw err;  
    }
};

exports.checkReport = async (repIdx) => {
    const delete_query = "DELETE FROM reports WHERE rep_idx = ?;";
    
    try {
        await conn.query(delete_query, [repIdx]);
        return 1;
    } catch (err) {
        console.error("Error admin models  => checkReport:", err);
        throw err;  
    }
};

