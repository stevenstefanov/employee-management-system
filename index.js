// Dependencies
const inquirer = require('inquirer');
const console_table = require('console.table');

const prompts = require('./lib/prompts');
const { viewTable } = require('./lib/table');
const { add } = require('./lib/add');
const { edit } = require('./lib/edit');
const { remove } = require('./lib/delete');

// Initialize the company program
const program = () => {
    inquirer.prompt(prompts.prompts[0]).then((res) => {
      res.continue === true
        ? inquirer.prompt(prompts.prompts[1]).then((res) => {
            switch (res.main_menu) {
              case 'View':
                viewTable(program);
                break;
              case 'Add':
                add(program);
                break;
              case 'Edit':
                edit(program);
                break;
              case 'Remove':
                remove(program);
                break;
            }
          })
        : process.exit(0);
    });
  };
  
  console.clear();
  prompts.welcomePrompt();
  program();