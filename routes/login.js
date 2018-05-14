// Require modules
const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { validate } = require('../models/user');

// Get router
const router = express.Router();

// Login route
router.post('/', (req, res) => {
    let userClient = {
        email: req.body.email,
        password: req.body.password
    };
    database.query(`SELECT * FROM user WHERE email = '${userClient.email}'`, (error, result, fields) => {
        if (result.length > 0) {
            let userServer = result[0];
            console.log(userClient);
            console.log(userServer);
            if (userServer.Password === userClient.password) {
                const token = jwt.sign({ userServer }, 'HoningDropVanVencoTijdensHetProgrammeren');
                const loginResult = {
                    email: userServer.Email,
                    token: token
                };
                console.log(loginResult);
                res.json(loginResult);
            } else {
                res.send('Password is incorrect');
            }
        } else {
            res.send('Not a valid user');
        }
    })
});


module.exports = router;