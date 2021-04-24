// Dependencies
const mysql = require('mysql');
const password = require('./config');

// Connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: password,
    database: 'employee_db',
});

// Export connection
module.exports = connection;