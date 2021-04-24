USE employee_db;

INSERT INTO department (name)
VALUES ("Engineering"), ("Sales"), ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Web Developer", 115000, 1), ("Sales Manager", 130000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steven", "Stefanov", 1, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Peter", "Smith", 2, 1);