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
  console.log('\n Welcome to the Company Employee Tracker - an easy way to manage your team! \n');
};

const prompts = [
  {
    name: 'continue',
    type: 'confirm',
    message: 'Press Enter to go to the Main Menu \n',
  },
  {
    name: 'main_menu',
    type: 'list',
    message: '\n MAIN MENU \n \n What would you like to do?',
    choices: ['View', 'Add', 'Edit', 'Remove'],
  },
  {
    name: 'select_view',
    type: 'list',
    message: 'View... \n',
    choices: ['Employee', 'Department', 'Role', 'Manager'],
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
    choices: ['Employee', 'Department', 'Role'],
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
    choices: ['First Name', 'Last Name', 'Role', 'Manager'],
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
    choices: ['Title', 'Salary', 'Department'],
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
      resolve(c);
    });
  });
};

const removeOpt = (arr, selection) => {
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === selection) {
      arr.splice(i, 1);
      i--;
    }
  }
};

module.exports = { roleOptions, managerOptions, employeeOptions, departmentOptions, welcomePrompt, prompts, optionsQuery, removeOpt };