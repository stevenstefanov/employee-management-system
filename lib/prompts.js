// Dependencies
const inquirer = require('inquirer');

// modules
const connection = require('../server');

// Empty arrays for departments, roles, or employees
let roleOptions = [];
let managerOptions = [];
let employeeOptions = [];
let departmentOptions = [];

// welcome message
const welcomePrompt = () => {
  console.log('Welcome to Company Employee Tracker - an easy way to keep track of your team! \n');
};

const prompts = [
  {
    name: 'continue',
    type: 'confirm',
    message: 'Enter To Continue To Main Menu \n',
  },
  {
    name: 'main_menu',
    type: 'list',
    message: 'MAIN MENU \n',
    choices: ['view', 'add', 'edit', 'remove'],
  },
  {
    name: 'select_view',
    type: 'list',
    message: 'VIEW BY... \n',
    choices: ['employee', 'department', 'role', 'manager'],
  },
  {
    name: 'select_dep',
    type: 'list',
    message: 'Department \n',
    choices: departmentOptions,
  },
  {
    name: 'select_role',
    type: 'list',
    message: 'Role \n',
    choices: roleOptions,
  },
  {
    name: 'select_emp',
    type: 'list',
    message: 'Select An Employee \n',
    choices: employeeOptions,
  },
  {
    name: 'select_mgmt',
    type: 'list',
    message: 'Manager \n',
    choices: managerOptions,
  },
  {
    name: 'first_name',
    type: 'input',
    message: 'First Name \n',
  },
  {
    name: 'last_name',
    type: 'input',
    message: 'Last Name \n',
  },
  {
    name: 'select_table',
    type: 'list',
    message: 'Select \n',
    choices: ['employee', 'department', 'role'],
  },
  {
    name: 'dep_name',
    type: 'input',
    message: 'Department Name \n',
  },
  {
    name: 'title',
    type: 'input',
    message: 'Title \n',
  },
  {
    name: 'salary',
    type: 'input',
    message: 'Starting Salary \n',
  },
  {
    name: 'emp_params',
    type: 'list',
    message: 'What Would You Like To Update? \n',
    choices: ['first name', 'last name', 'role', 'manager'],
  },
  {
    name: 'dep_input',
    type: 'input',
    message: 'Department Name \n',
  },
  {
    name: 'role_input',
    type: 'list',
    message: 'What Would You Like To Update? \n',
    choices: ['title', 'salary', 'department'],
  },
];

const optionsQuery = (a, b, c) => {
  let query = a;
  let param = b;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, res) => {
      if (err) throw err;
      res.forEach((obj) => {
        c.push(obj[param]);
      });
      resolve(true);
    });
  });
};

module.exports = { roleOptions, managerOptions, employeeOptions, departmentOptions, welcomePrompt, prompts, optionsQuery };