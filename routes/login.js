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
    console.log('Login called with user:\n', userClient);
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
            console.log('Matching user found in server:\n', userServer);
            // Check password
            if (userServer.password === userClient.password) {
                // Create token
                const token = jwt.sign({ userServer }, 'HoningDropVanVencoTijdensHetProgrammeren');
                // Send response to client
                res.json({
                    email: userServer.email,
                    token: token
                });
            }
            // If password isn't correct
            else {
                res.send('Password is incorrect');
            }
        }
        // If user doesn't exists
        else {
            res.send('Not a valid user');
        }
    })
});

// Export login routes
module.exports = router;