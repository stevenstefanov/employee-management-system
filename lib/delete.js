// Dependencies
const inquirer = require('inquirer');

const connection = require('../server');
const {managerOptions, departmentOptions, roleOptions, prompts, employeeOptions, optionsQuery} = require('./prompts');

const deleteQuery = (table, column, val, cb) => {
    connection.query(`DELETE FROM ${table} WHERE ${column} = ?`, val, (err, res) => {
      if (err) throw err;
      console.log(val + ' has been removed \n');
      cb();
    });
  };

  const remove = (cb) => {
    inquirer.prompt(prompts[9]).then((res) => {
      console.clear();
      switch (res.select_table) {
        case 'employee':
          optionsQuery(`SELECT CONCAT(last_name, ', ', first_name) AS name FROM employee;`, 'name', employeeOptions).then(() =>
            inquirer.prompt(prompts[5]).then((res) => {
              let employee = res.select_emp.split(',');
              deleteQuery('employee', 'last_name', employee[0], cb);
              removeOpt(employeeOptions, res.select_emp);
            })
          );
          break;
        case 'department':
          optionsQuery(`SELECT name FROM department`, 'name', departmentOptions)
            .then(() => inquirer.prompt(prompts[3]))
            .then((res) => {
              deleteQuery('department', 'name', res.select_dep, cb);
              removeOpt(departmentOptions, res.select_dep);
            });
            break;
          case 'role':
            optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() =>
              inquirer.prompt(prompts[4]).then((res) => {
                deleteQuery('role', 'title', res.select_role, cb);
                removeOpt(roleOptions, res.select_role);
            })
          );
          break;
      }
    });
  };
  
  module.exports = { remove };