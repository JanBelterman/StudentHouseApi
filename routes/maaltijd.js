// Require modules
const express = require('express');
const auth = require('../middleware/auth');
const database = require('../database');
const { validate } = require('../models/maaltijd');

// Get router
const router = express.Router();

router.post('/:studentenhuisId/maaltijd', auth, async (req, res) => {

    // Validating client input
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Getting maaltijd
    const maaltijd = {
        Naam: req.body.naam,
        Beschrijving: req.body.beschrijving,
        Ingredienten: req.body.ingredienten,
        Allergie: req.body.allergie,
        Prijs: req.body.prijs,
        UserID: req.user.ID.toString(),
        StudentenhuisID: req.params.studentenhuisId
    };

    // Checking if studentenhuis exists
    database.query(`SELECT * FROM studentenhuis WHERE ID = ${maaltijd.StudentenhuisID}`, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (huisId bestaad niet)');

        // Inserting maaltijd
        database.query('INSERT INTO maaltijd SET ?', maaltijd, (error, result, fields) => {

            // Querying maaltijd and sending to client
            database.query(`SELECT * FROM maaltijd WHERE id = ${result.insertId}`, (error, result, field) => {
                res.status(200).json(result);

            });

        });

    });

});

router.get('/:studentenhuisId/maaltijd', auth, (req, res) => {

    // Checking if studentenhuis exists
    database.query(`SELECT * FROM studentenhuis WHERE ID = ${req.params.studentenhuisId}`, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (huisId bestaad niet)');

        // Querying studentenhuis and sending to client
        database.query('SELECT * FROM maaltijd', (error, result, fields) => {
            res.status(200).json(result);

        });

    });

});

router.get('/:studentenhuisId/maaltijd/:maaltijdId', auth, (req, res) => {

    // Checking if studentenhuis exists
    database.query(`SELECT * FROM studentenhuis WHERE ID = '${req.params.studentenhuisId}'`, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (studentenhuis bestaad niet)');

        // Querying studentenhuis and sending to client
        database.query(`SELECT * FROM maaltijd WHERE StudentenhuisID = '${req.params.maaltijdId}' AND ID = '${maaltijdID}'`, (error, result, fields) => {
            if (result.length === 0) return res.status(404).send('Niet gevonden (maaltijd bestaad niet)');

            res.status(200).json(result);

        });

    });

});

router.put('/:studentenhuisId/maaltijd/:maaltijdId', auth, (req, res) => {

    // Validate client input
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Checking if studentenhuis exists
    database.query(`SELECT * FROM studentenhuis WHERE ID = '${req.params.studentenhuisId}'`, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (studentenhuis bestaad niet)');

        // Checkign if maaltijd exists
        database.query(`SELECT * FROM maaltijd WHERE ID = '${req.params.maaltijdId}'`, (dbError, result, fields) => {
            if (result.length === 0) return res.status(404).send('Niet gevonden (maaltijd bestaad niet)');

            // Checking if client is authorized to edit data
            if (!(req.user.ID.toString() === result[0].UserID.toString())) return res.status(409).send('Cannot modify someone else his/her maaltijden');

            database.query(
                `UPDATE maaltijd
                SET Naam = '${req.body.naam}',
                Beschrijving = '${req.body.beschrijving}',
                Ingredienten = '${req.body.ingredienten}',
                Allergie = '${req.body.allergie}',
                Prijs = '${req.body.prijs}'
                WHERE ID = '${req.params.maaltijdId}'`, (error, result, fields) => {

                // Getting maaltijd and return
                database.query(`SELECT * FROM maaltijd WHERE id = '${req.params.maaltijdId}'`, (error, result, fields) => {
                    res.status(200).json(result);

                });

            });

        });

    });

});

router.delete('/:studentenhuisId/maaltijd/:maaltijdId', auth, (req, res) => {

    // Checking if studentenhuis exists
    database.query(`SELECT * FROM studentenhuis WHERE ID = '${studentenhuisID}'`, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Studenthouse not found');

        // Checking if maaltijd exists
        database.query(`SELECT * FROM maaltijd WHERE StudentenhuisID = '${studentenhuisID}' AND ID = '${maaltijdID}'`, (error, result, fields) => {
            if (result.length === 0) return res.status(404).send('Maaltijd not found');

            // Checking if client is authorized to edit this maaltijd
            if (!(req.user.ID.toString() === result[0].UserID.toString())) return res.status(409).send('Cannot delete someone else his/her maaltijden');

            // Deleting maaltijd
            database.query(`DELETE FROM maaltijd WHERE StudentenhuisID = '${req.params.studentenhuisId}' AND ID = '${req.params.maaltijdId}'`, (error, result) => {
                res.status(200).send('Maaltijd has been deleted successfully');

            });
        });
    });

});

module.exports = router;