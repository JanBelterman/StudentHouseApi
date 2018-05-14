// Require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { validate } = require('../models/login');

// Get router
const router = express.Router();

// Login route
router.post('/', (req, res) => {

    // Getting client input
    let userClient = {
        email: req.body.email,
        password: req.body.password
    };

    // Validating client input
    const { error } = validate(userClient);
    if (error) return res.status(400).send(error.details[0].message);

    // Query database for user
    database.query(`SELECT * FROM user WHERE email = '${userClient.email}'`, (error, result, fields) => {
        // If user exists
        if (result.length > 0) {
            // Get user from server
            let userServer = {
                id: result[0].ID,
                email: result[0].Email,
                password: result[0].Password
            };
            // Log some information
            console.log('User from client:\n', userClient);
            console.log('Linked user from server:\n', userServer);
            // If password is correct
            if (userServer.password === userClient.password) {
                // Create token
                const token = jwt.sign({ userServer }, 'HoningDropVanVencoTijdensHetProgrammeren');
                // Send response to client
                const loginResult = {
                    email: userServer.email,
                    token: token
                };
                res.json(loginResult);
                // Log some information
                console.log('LoginResult:\n', loginResult);
            }
            // If password is not correct
            else {
                res.send('Password is incorrect');
            }
        }
        // If user not exists
        else {
            res.send('Not a valid user');
        }
    })
});


module.exports = router;