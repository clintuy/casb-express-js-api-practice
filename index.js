// export express js
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const moment = require('moment');

const app = express();

// connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee',
});

connection.connect();

// middleware
const logger = (req, res, next) => {
    console.log(
        `${req.protocol}://${req.get('host')}${
            req.originalUrl
        } : ${moment().format()}`
    );
    next();
};

app.use(logger);
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

// if the desired port is not available then will generate available port
const PORT = process.env.PORT || 5000;

// get all employee
app.get('/api/employee/all', (req, res) => {
    connection.query('SELECT * FROM userdata', (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

// get certain employee
app.get('/api/members/:id', (req, res) => {
    var id = req.params.id;

    connection.query(
        `SELECT * FROM userdata WHERE id = '${id}'`,
        (err, rows, fields) => {
            if (err) throw err;

            if (rows.length > 0) {
                res.json(rows);
            } else {
                res.status(400).json({ msg: `No user with an id of ${id}` });
            }
        }
    );
});

// add new user
app.post('/api/employee', (req, res) => {
    // var fname = req.body.fname;
    // var lname = req.body.lname;
    // var email = req.body.email;
    // var gender = req.body.gender;
    // OR

    const { fname, lname, email, gender } = req.body;

    connection.query(
        `INSERT INTO userdata (first_name, last_name, email, gender) VALUES ('${fname}', '${lname}', '${email}', '${gender}')`,
        (err, rows, fields) => {
            if (err) throw err;
            res.json({
                msg: `1 row was inserted`,
            });
        }
    );
});

// update user
app.put('/api/employee', (req, res) => {
    // var fname = req.body.fname;
    // var lname = req.body.lname;
    // var email = req.body.email;
    // var gender = req.body.gender;
    // var id = req.body.id;
    // OR

    const { id, fname, lname, email, gender } = req.body;

    connection.query(
        `UPDATE userdata SET first_name = '${fname}', last_name = '${lname}', email = '${email}', gender = '${gender}' WHERE id = '${id}'`,
        (err, rows, fields) => {
            if (err) throw err;
            res.json({
                msg: `1 row was updated successfully`,
            });
        }
    );
});

// delete user
app.delete('/api/employee', (req, res) => {
    var id = req.body.id;
    connection.query(
        `DELETE FROM userdata WHERE id = '${id}'`,
        (err, rows, fields) => {
            if (err) throw err;
            res.json({
                msg: `1 row was deleted successfully`,
            });
        }
    );
});

app.use(express.static(path.join(__dirname, 'public')));

// load server
app.listen(PORT, () => {
    console.log(`Server is started on port ${PORT}`);
});
