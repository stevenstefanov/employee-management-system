// Dependencies
const inquirer = require('inquirer');

const connection = require('../server');
const {managerOptions, departmentOptions, roleOptions, prompts, optionsQuery} = require('./prompts');

// Display All Employees
const employeeTable = (cb) => {
  let query = `SELECT employee.id, employee.last_name, employee.first_name, role.title, department.name AS department, CONCAT('$',role.salary) AS salary, CONCAT(manager.last_name, ', ', manager.first_name) AS manager 
  FROM employee 
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager ON manager.id = employee.manager_id`;

  let totalSalary = `SELECT CONCAT('$', SUM(role.salary) OVER()) AS total_salary 
  FROM employee 
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager ON manager.id = employee.manager_id
  LIMIT 1`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
  });

  connection.query(totalSalary, (err, res) => {
    if (err) throw err;
    console.log('Total Payroll: ' + res[0].total_salary + '\n');
    cb();
  });
};

// Display employees by department or by role
const viewByTable = (column, val, cb) => {
  let query = `SELECT employee.id, employee.last_name, employee.first_name, role.title, department.name AS department, CONCAT('$',role.salary) AS salary, CONCAT(manager.last_name, ', ', manager.first_name) AS manager 
  FROM employee
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager 
  ON manager.id = employee.manager_id
  WHERE ${column} = ?`;

  let totalSalary = `SELECT CONCAT('$', SUM(role.salary) OVER())
  AS total_salary FROM employee
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager ON manager.id = employee.manager_id
  WHERE ${column} = ?
  LIMIT 1;`;

  connection.query(query, val, (err, res) => {
    if (err) throw err;
    console.table(res);
  });

  connection.query(totalSalary, val, (err, res) => {
    res == ''
      ? console.log('You do not have any employees here yet. \n')
      : console.log('Total Payroll: ' + res[0].total_salary + '\n');
    cb();
  });
};

// View table logic
const viewTable = (cb) =>
  inquirer.prompt(prompts[2]).then((res) => {
    console.clear();
    switch (res.select_view) {
      case 'Employee':
        employeeTable(cb);
        break;

      case 'Department':
        optionsQuery(`SELECT name FROM department`, 'name', departmentOptions).then((res) => {

          let departments = [];
          if (res.length > 0) {
            departments = [...new Set(res)];
          }

          return inquirer.prompt({
            name: 'select_dep',
            type: 'list',
            message: 'Department \n',
            choices: departments,
          }).then((res) => viewByTable('department.name', res.select_dep, cb));
        });
        break;

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
          }).then((res) => viewByTable('role.title', res.select_role, cb));
        });
        break;
        
      case 'Manager':
        optionsQuery(`SELECT CONCAT(last_name, ', ', first_name) AS manager FROM employee`, 'manager', managerOptions).then((res) => {
          let manager = [];
          if (res.length > 0) {
            manager = [...new Set(res)];
          }

          return inquirer.prompt({
            name: 'select_mgmt',
            type: 'list',
            message: 'Manager \n',
            choices: manager,
          }).then((res) => {
            manager = res.select_mgmt.split(',');
            connection.query('SELECT id FROM employee WHERE last_name = ?', manager[0], (err, res) => {
              viewByTable('employee.manager_id', res[0].id, cb);
            });
          });
        });
        break;
    }
  });

module.exports = { employeeTable, viewByTable, viewTable };