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
        const [contentResults] = await conn.query(content_query);

        const count = countResults[0].count;  
        const content = contentResults; 

        return { count, content }; 

    } catch (err) {
        console.error("Error fetching problem info:", err);
        throw err;  
    }
};

exports.infoUser = async (id) => {
    const user_query = "SELECT * FROM users WHERE id = ?;";

    try {
        const [user] = await conn.query(user_query, id);
        const userInfo = [user][0][0];
        return { userInfo }; 

    } catch (err) {
        console.error("Error wargame models infoUser:", err);
        throw err;  
    }
};
