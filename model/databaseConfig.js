// Name: GAO QIANXI
// Class: DIT/FT/1B/06
// Admin No.: 2241434

const mysql = require('mysql');

// Connect to database
const dbconnect = {
    getConnection: () => {
        const conn = mysql.createConnection({
            host: 'localhost',
            user: 'bed_dvd_root',
            password: 'pa$$woRD123',
            database: 'bed_dvd_db'
        });
        return conn;
    }
};

module.exports = dbconnect;