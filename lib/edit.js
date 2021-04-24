// Dependencies
const inquirer = require('inquirer');

const connection = require('../server');
const {managerOptions, departmentOptions, roleOptions, prompts, employeeOptions, optionsQuery} = require('./prompts');

const update = (table, setProp, setVal, whereProp, whereVal, cb) => {
    let query = `UPDATE ${table}
    SET ${setProp} = ?
    WHERE ${whereProp} = ?`;
  
    connection.query(query, [setVal, whereVal], (err, res) => {
      err
        ? console.log("You've encountered an error. Please try again! \n")
        : console.log('Success! ' + setProp + ' has been changed to ' + setVal + ' at ' + whereVal + ' in the ' + table + ' table! \n');
      cb();
    });
  };

const edit = (cb) => {
    inquirer.prompt(prompts[9]).then((res) => {
        console.clear();
        switch (res.select_table) {
            case 'Employee':
                optionsQuery(`SELECT CONCAT(last_name, ', ', first_name) AS name FROM employee;`, 'name', employeeOptions).then(() => {
                    inquirer.prompt(prompts[5]).then((res) => {
                        let employee = res.select_emp.split(',');
                        connection.query(`SELECT id FROM employee WHERE last_name = ?`, employee[0], (err, res) => {
                            let id = res[0].id;
                            inquirer.prompt(prompts[13]).then((res) => {
                                switch (res.emp_params) {
                                    case 'First Name':
                                        inquirer.prompt(prompts[7]).then((res) => update('employee', 'first_name', res.first_name, 'id', id, cb));
                                        break;
                                    case 'Last Name':
                                        inquirer.prompt(prompts[8]).then((res) => update('employee', 'last_name', res.last_name, 'id', id, cb));
                                        break;
                                    case 'Role':
                                        optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() =>
                                            inquirer.prompt(prompts[4]).then((res) => {
                                                let role = res.select_role;
                                                connection.query(`SELECT id FROM role WHERE title = ?`, role, (err, res) => {
                                                    update('employee', 'role_id', res[0].id, 'id', id, cb);
                                                });
                                            })
                                        );
                                        break;
                                    case 'Manager':
                                        optionsQuery(`SELECT first_name, last_name, CONCAT(last_name, ', ', first_name) AS manager FROM employee;`,
                                        'manager',
                                        managerOptions
                                        ).then(() => {
                                            inquirer.prompt(prompts[6]).then((res) => {
                                                let manager = res.select_mgmt.split(',');
                                                connection.query(`SELECT id FROM employee WHERE last_name = ?`, manager[0], (err, res) => {
                                                    update('employee', 'manager_id', res[0].id, 'id', id, cb);
                                                    console.log(res[0].id);
                                                });
                                            });
                                        });
                                }
                            });
                        });
                    });
                });
                break;
            case 'Department':
                optionsQuery(`SELECT name FROM department`, 'name', departmentOptions).then(() =>
                    inquirer.prompt(prompts[3]).then((res) =>
                        connection.query(`SELECT id FROM department WHERE name = "${res.select_dep}"`, (err, res) => {
                            let id = res[0].id;
                            inquirer.prompt(prompts[14]).then((res) => {
                                let department = res.dep_input;
                                update('department', 'name', department, 'id', id, cb);
                            });
                        })
                    )
                );
                break;
            case 'Role':
                optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() =>
                    inquirer.prompt(prompts[4]).then((res) => {
                        let role = res.select_role;
                        connection.query(`SELECT id FROM role WHERE title = ?`, role, (err, res) => {
                            let id = res[0].id;
                            inquirer.prompt(prompts[15]).then((res) => {
                                switch (res.role_input) {
                                    case 'Title':
                                        inquirer.prompt(prompts[11]).then((res) => {
                                            let title = res.title;
                                            update('role', 'title', title, 'id', id, cb);
                                        });
                                        break;
                                    case 'Salary':
                                        inquirer.prompt(prompts[12]).then((res) => {
                                            let salary = res.salary;
                                            update('role', 'salary', salary, 'id', id, cb);
                                        });
                                        break;
                                    case 'Department':
                                        optionsQuery(`SELECT name FROM department`, 'name', departmentOptions).then(() =>
                                            inquirer.prompt(prompts[3]).then((res) => {
                                                connection.query(`SELECT id FROM department WHERE name = "${res.select_dep}"`, (err, res) => {
                                                    update('role', 'department_id', res[0].id, 'id', res[0].id, cb);
                                                });
                                            })
                                        );
                                        break;
                                }
                            });
                        });
                    })
                );
        }
    });
};

module.exports = { edit };