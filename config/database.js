const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const promisePool = db.promise();

module.exports = promisePool;