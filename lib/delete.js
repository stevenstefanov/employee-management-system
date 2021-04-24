// Dependencies
const inquirer = require('inquirer');

const connection = require('../server');
const {managerOptions, departmentOptions, roleOptions, prompts, optionsQuery} = require('./prompts');

const deleteQuery = (table, column, val, cb) => {
    connection.query(`DELETE FROM ${table} WHERE ${column} = ?`, val, (err, res) => {
      if (err) throw err;
      console.log(val + ' has been removed \n');
      cb();
    });
  };

  const remove = (cb) => {
    inquirer.prompt(prompts[9]).then((res) => {
      switch (res.select_table) {
        case 'employee':
          optionsQuery(`SELECT CONCAT(last_name, ', ', first_name) AS name FROM employee;`, 'name', employeeOptions).then(() =>
            inquirer.prompt(prompts[5]).then((res) => {
              let employee = res.select_emp.split(',');
              console.log(employee[0]);
              deleteQuery('employee', 'last_name', employee[0], cb);
            })
          );
          break;
        case 'department':
          optionsQuery(`SELECT name FROM department`, 'name', departmentOptions)
            .then(() => inquirer.prompt(prompts[3]))
            .then((res) => deleteQuery('department', 'name', res.select_dep, cb));
          break;
        case 'role':
          optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() =>
            inquirer.prompt(prompts[4]).then((res) => {
              deleteQuery('role', 'title', res.select_role, cb);
            })
          );
          break;
      }
    });
  };
  
  module.exports = { remove };