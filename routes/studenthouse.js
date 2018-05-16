// Require modules
const express = require('express');
const auth = require('../middleware/auth');
const database = require('../database');
const { validate } = require('../models/studenthouse');

// Get router
const router = express.Router();

router.post('/', auth, (req, res) => {

    // Validating client input
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Getting studenthouse
    const studentenhuis = {
        Naam: req.body.naam,
        Adres: req.body.adres,
        UserID: req.user.ID.toString()
    };

    // Inserting studentenhuis
    database.query('INSERT INTO studentenhuis SET ?', studentenhuis, (error, result, fields) => {
        console.log(error);

        // Querying studentenhuis and sending to client
        database.query(`SELECT * FROM studentenhuis WHERE ID = ${result.insertId}`, (error, result, field) => {
            console.log(error);

            res.status(200).json(result[0]);

        })
    })

});

router.get('/', auth, (req, res) => {

    // Querying studentenhuizen and sending to client
    database.query('SELECT * FROM studentenhuis', (error, result, fields) => {
        console.log(error);

        res.status(200).json(result);

    });

});

router.get('/:id', auth, (req, res) => {

    database.query(`SELECT * FROM studentenhuis WHERE ID = '${req.params.id}'`, (error, result, fields) => {
        console.log(error);

        if (result.length === 0) return res.status(404).send('Niet gevonden (huisId bestaad niet)');
        res.status(200).json(result);

    });

});

router.put('/:id', auth, (req, res) => {

    // Validating client input
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Getting studenthouse
    const studentenhuis = {
        Naam: req.body.naam,
        Adres: req.body.adres,
        UserID: req.user.ID.toString()
    };
    console.log('Update called for studentenhuis:\n', studentenhuis);

    // Checking if studentenhuis exists
    database.query(`SELECT * FROM studentenhuis WHERE ID = '${req.params.id}'`, (error, result, fields) => {
        console.log(error);

        if (result.length === 0) return res.status(404).send('Studentenhuis met dit id bestaad niet');
        // Checking if client can use this data
        if (!(studentenhuis.UserID.toString() === result[0].UserID.toString())) return res.status(409).send('Conflict (Gebruiker mag deze data niet wijzigen)');

        database.query(`UPDATE studentenhuis SET Naam = '${studentenhuis.Naam}', Adres = '${studentenhuis.Adres}' WHERE ID = '${req.params.id}'`, studentenhuis, (error, result, fields) => {
            console.log(error);

            database.query(`SELECT * FROM studentenhuis WHERE ID = '${req.params.id}'`, (error, result, fields) => {
                res.status(200).json(result[0]);

            })

        });
    })

});

router.delete('/:id', auth, (req, res) => {

    // Checking if studentenhuis exists
    database.query(`SELECT * FROM studentenhuis WHERE ID = '${req.params.id}'`, (error, result, fields) => {
        console.log(error);

        if (result.length === 0) return res.status(404).send(`Studenthoude with ID: ${req.params.id} not found`);

        // Checking if user can delete data
        if (!(req.user.ID.toString() === result[0].UserID.toString())) return res.status(409).send('User is not authorized to use this data');

        // Delete studentenhuis
        database.query(`DELETE FROM studentenhuis WHERE ID = '${req.params.id}'`, (err, result) => {
            if (err) console.log('Error deleting studentenhuis\n', err);

            res.status(200).send(`Studenthouse with ID: ${req.params.id} deleted successfully`);

        });

    })

});

module.exports = router;