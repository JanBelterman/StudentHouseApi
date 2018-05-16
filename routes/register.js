// Require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { validate } = require('../models/user');

// Get router
const router = express.Router();

// Register route
router.post('/', (req, res) => {

    // Validating the user object (code 412)
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Converting client input into user object
    const login = {
        Email: req.body.email,
        Password: req.body.password,
        Voornaam: req.body.voornaam,
        Achternaam: req.body.achternaam
    };

    // Checking if user exists
    database.query(`SELECT email FROM user WHERE email = '${login.Email}'`, (error, result, fields) => {
        // If user already exists (code 401)
        if (result.length > 0) return res.status(401).send('User already exists');

        // Inserting user
        database.query('INSERT INTO user SET ?', login, (error, result, fields) => {

            // Getting user to return to client
            database.query(`SELECT * FROM user WHERE id = ${result.insertId}`, (error, result, field) => {

                // Create token
                const token = jwt.sign({
                    user: {
                        ID: result[0].ID,
                        Email: result[0].Email
                    }}, 'SeCrEtJsOnWeBtOkEn');

                // Send response to client
                res.status(200).json({
                    Email: result[0].Email,
                    Token: token
                });

            })
        })
    });

});

// Export register routes
module.exports = router;