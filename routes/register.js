// Require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { validate } = require('../models/user');

// Get router
const router = express.Router();

// Register route
router.post('/', (req, res) => {

    // Converting client input into user object
    const login = {
        email: req.body.email,
        password: req.body.password,
        voornaam: req.body.firstname,
        achternaam: req.body.lastname
    };
    // Validating the user object
    const { error } = validate(login);
    if (error) return res.status(412).send(error.details[0].message);

    // Checking if user exists
    database.query(`SELECT email FROM user WHERE email = '${login.email}'`, (error, result, fields) => {
        if (result.length > 0) return res.status(400).send('User already exists');
        // Inserting user
        database.query('INSERT INTO user SET ?', login, (error, result, fields) => {
            database.query(`SELECT * FROM user WHERE id = ${result.insertId}`, (error, result, field) => {
                let userServer = {
                    email: result[0].Email,
                    id: result[0].ID
                };
                // Create token
                const token = jwt.sign({ userServer }, 'HoningDropVanVencoTijdensHetProgrammeren');
                // Send response to client
                res.json({
                    Email: result[0].Email,
                    Token: token
                });
            })
        })
    });

});

// Export register routes
module.exports = router;