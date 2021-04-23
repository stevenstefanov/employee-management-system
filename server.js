// Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const console_table = require('console.table');
const password = require('./config');

// Connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: password,
    database: 'employee_db',
});

module.exports = connection;