// Dependencies
const inquirer = require('inquirer');

const connection = require('../server');
const {managerOptions, departmentOptions, roleOptions, prompts, optionsQuery} = require('./prompts');

// Define Department class
class Department {
    constructor(name) {
      this.name = name;
    }

    insert(cb) {
      let query = `INSERT INTO department(name) VALUES(?)`;
      connection.query(query, this.name, (err, res) => {
        err
          ? console.log("You've encountered an error. Please try again! \n")
          : console.log('Success! ' + this.name + ' has been added to the Departments table! \n');
        cb();
      });
    }
  }
  
  // Define Employee class
  class Employee {
    constructor(first_name, last_name, role_id, manager_id) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.role_id = role_id;
      this.manager_id = manager_id;
    }

    insert(cb) {
      let query = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`;
      connection.query(query, [this.first_name, this.last_name, this.role_id, this.manager_id], (err, res) => {
        err
          ? console.log("You've encountered an error. Please try again! \n")
          : console.log('Success! ' + this.first_name + ' ' + this.last_name + ' has been added! \n');
        cb();
      });
    }
  }
  
  // Define Role class
  class Role {
    constructor(title, salary, department_id) {
      this.title = title;
      this.salary = salary;
      this.department_id = department_id;
    }

    insert(cb) {
      let query = `INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?)`;
      connection.query(query, [this.title, this.salary, this.department_id], (err, res) => {
        err
          ? console.log("You've encountered an error. Please try again!\n")
          : console.log('Success! ' + this.title + ' has been added with a starting salary of ' + this.salary + '! \n');
        cb();
      });
    }
  }
  
  const add = (cb) =>
    inquirer.prompt(prompts[9]).then((res) => {
      switch (res.select_table) {
        case 'employee':
          let employeeProps = [];
          inquirer.prompt(prompts[7]).then((res) => {
            employeeProps.push(res.first_name);
            inquirer.prompt(prompts[8]).then((res) => {
              employeeProps.push(res.last_name);
              optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() => {
                return inquirer.prompt(prompts[4]).then((res) => {
                  let role = res.select_role;
                  connection.query('SELECT id FROM role WHERE title = ?', role, (err, res) => {
                    employeeProps.push(res[0].id);
                  });
                  optionsQuery(
                    `SELECT first_name, last_name, CONCAT(last_name, ', ', first_name) AS manager FROM employee;`,
                    'manager',
                    managerOptions
                  ).then(() => {
                    inquirer.prompt(prompts[6]).then((res) => {
                      let manager = res.select_mgmt.split(',');
                      connection.query(`SELECT id FROM employee WHERE last_name = ?`, manager[0], (err, res) => {
                        employeeProps.push(res[0].id);
                        let newEmployee = new Employee(employeeProps[0], employeeProps[1], employeeProps[2], employeeProps[3]);
                        newEmployee.insert(cb);
                      });
                    });
                  });
                });
              });
            });
          });
          break;
        case 'department':
          inquirer.prompt(prompts[10]).then((res) => {
            let newDepartment = new Department(res.dep_name);
            newDepartment.insert(cb);
          });
          break;
        case 'role':
          let roleProps = [];
          inquirer.prompt(prompts[11]).then((res) => {
            roleProps.push(res.title);
            inquirer.prompt(prompts[12]).then((res) => {
              roleProps.push(res.salary);
              optionsQuery(`SELECT name FROM department`, 'name', departmentOptions).then(() => {
                inquirer.prompt(prompts[3]).then((res) => {
                  let department = res.select_dep;
                  connection.query(`SELECT id FROM department WHERE name = "${department}"`, (err, res) => {
                    roleProps.push(res[0].id);
                    let newRole = new Role(roleProps[0], roleProps[1], roleProps[2]);
                    newRole.insert(cb);
                  });
                });
              });
            });
          });
      }
    });
  
  module.exports = { Department, Employee, Role, add };