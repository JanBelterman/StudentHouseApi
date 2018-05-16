// Require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { validate } = require('../models/login');

// Get router
const router = express.Router();

// Login route
router.post('/', (req, res) => {

    // Validate client input (code 412)
    const {error} = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Checking if user exists
    database.query(`SELECT * FROM user WHERE email = '${req.body.email}'`, (error, result, fields) => {

        // If user exists
        if (result.length > 0) {

            // Check password
            if (req.body.password === result[0].Password) {

                // Create token
                const token = jwt.sign({
                    user: {
                        ID: result[0].ID,
                        Email: result[0].Email
                    }}, 'SeCrEtJsOnWeBtOkEn');

                // Send response to client (code 200)
                res.status(200).json({
                    Token: token,
                    Email: result[0].Email
                });

            }

            // If password isn't correct (code 401)
            else {
                res.status(401).send('Aces denied. Password is incorrect');
            }

        }

        // If user doesn't exists (code 401)
        else {
            res.status(401).send('Aces denied. Not a valid user');
        }

    })
});

// Export login routes
module.exports = router;