// Require modules
const express = require('express');
const auth = require('../middleware/auth');
const database = require('../database');
const { validate } = require('../models/studenthouse');

// Get router
const router = express.Router();

router.post('/', auth, (req, res) => {

    // Getting studenthouse
    const studentenhuis = {
        naam: req.body.naam,
        adres: req.body.adres
    };

    // Validating client input
    const { error } = validate(studentenhuis);
    if (error) return res.status(400).send(error.details[0].message);

    database.query('INSERT INTO studentenhuis SET ?', studentenhuis, (error, result, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).send('Error inserting studentenhuis');
        }
        database.query(`SELECT * FROM studentenhuis WHERE id = ${result.insertId}`, (error, rows, field) => {
            res.json(rows);
        })
    })

});

module.exports = router;