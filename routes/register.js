// Require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { validate } = require('../models/user');

// Get router
const router = express.Router();

// Register route
router.post('/', (req, res) => {

    // Validating client input
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Creating login
    const login = {
        email: req.body.email,
        password: req.body.password,
        voornaam: req.body.firstname,
        achternaam: req.body.lastname
    };
    // Checking if login exists
    database.query("SELECT email FROM user WHERE email = '" + login.email + "'", (error, result, fields) => {
        if (result.length > 0) return res.status(400).send('User already exists');
        // Inserting login
        database.query('INSERT INTO user SET ?', login, (error, result, fields) => {
            if (error) return res.status(400).send('Error inserting user');
            database.query(`SELECT * FROM user WHERE id = ${result.insertId}`, (error, rows, field) => {
                res.json(rows);
            })
        })
    });

});

module.exports = router;