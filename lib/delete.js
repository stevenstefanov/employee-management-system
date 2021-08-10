// Dependencies
const inquirer = require('inquirer');

const connection = require('../server');
const {departmentOptions, roleOptions, prompts, employeeOptions, optionsQuery, removeOpt} = require('./prompts');

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

      // Case Employee
      case 'Employee':
        optionsQuery(`SELECT CONCAT(last_name, ', ', first_name) AS name FROM employee;`, 'name', employeeOptions).then(() =>
          inquirer.prompt(prompts[5]).then((res) => {
            let employee = res.select_emp.split(',');
            deleteQuery('employee', 'last_name', employee[0], cb);
            removeOpt(employeeOptions, res.select_emp);
          })
        );
        break;

      // Case Department  
      case 'Department':
        optionsQuery(`SELECT name FROM department`, 'name', departmentOptions)
          .then((res) => {

            let departments = [];
            if (res.length > 0) {
              departments = [...new Set(res)];
            }
  
            return inquirer.prompt({
              name: 'select_dep',
              type: 'list',
              message: 'Department \n',
              choices: departments,
            }).then((res) => {
              deleteQuery('department', 'name', res.select_dep, cb);
              removeOpt(departmentOptions, res.select_dep);
            });
          });
          break;

        // Case Role  
        case 'Role':
          optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then((res) => {
            let roles = [];
            if (res.length > 0) {
              roles = [...new Set(res)];
            }

            return inquirer.prompt({
              name: 'select_role',
              type: 'list',
              message: 'Role \n',
              choices: roles,   
            }).then((res) => {
                deleteQuery('role', 'title', res.select_role, cb);
                removeOpt(roleOptions, res.select_role);
              })
          });
        break;
    }
  });
};
  
module.exports = { remove };