// Require modules
const express = require('express');
const auth = require('../middleware/auth');
const database = require('../database');
const { validate } = require('../models/maaltijd');

// Get router
const router = express.Router();

router.post('/:id/maaltijd', auth, async (req, res) => {

    // Getting maaltijd from:
    // - Request body
    // - Request parameters (StudentenhuisID)
    // - Auth token (UserID)
    const maaltijd = {
        Naam: req.body.naam,
        Beschrijving: req.body.beschrijving,
        Ingredienten: req.body.ingredienten,
        Allergie: req.body.allergie,
        Prijs: req.body.prijs,
        UserID: req.user.id.toString(),
        StudentenhuisID: req.params.id
    };
    console.log('Post called for maaltijd:\n', maaltijd);

    // Validating maaltijd
    const { error } = validate(maaltijd);
    if (error) return res.status(412).send(error.details[0].message);

    // Checking if studentenhuis exists
    database.query(`SELECT * FROM studentenhuis WHERE ID = ${maaltijd.StudentenhuisID}`, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (huisId bestaad niet)');
        // Inserting maaltijd
        database.query('INSERT INTO maaltijd SET ?', maaltijd, (error, result, fields) => {
            // Querying maaltijd and sending to client
            database.query(`SELECT * FROM maaltijd WHERE id = ${result.insertId}`, (error, result, field) => {
                res.status(200).json(result);
            })
        })
    });

});

router.get('/:id/maaltijd', auth, (req, res) => {

    // Checking if studentenhuis exists
    database.query(`SELECT * FROM studentenhuis WHERE ID = ${req.params.id}`, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (huisId bestaad niet)');
        // Querying studentenhuis and sending to client
        database.query('SELECT * FROM maaltijd', (error, result, fields) => {
            res.status(200).json(result);
        });
    });

});

router.get('/:id/maaltijd/:mid', auth, (req, res) => {

    // Get client input
    const studentenhuisID = req.params.id;
    const maaltijdID = req.params.mid;

    // Create query's
    let queryStudentenhuis =
        `SELECT *
        FROM studentenhuis
        WHERE ID = '${studentenhuisID}'`;
    const queryMaaltijd =
        `SELECT *
        FROM maaltijd
        WHERE StudentenhuisID = '${studentenhuisID}'
        AND ID = '${maaltijdID}'`;

    // Checking if studentenhuis exists
    database.query(queryStudentenhuis, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (studentenhuis bestaad niet)');
        // Querying studentenhuis and sending to client
        database.query(queryMaaltijd, (error, result, fields) => {
            if (result.length === 0) return res.status(404).send('Niet gevonden (maaltijd bestaad niet)');
            res.status(200).json(result);
        });
    });

});

router.put('/:id/maaltijd/:mid', auth, (req, res) => {

    // Get client input
    const studentenhuisID = req.params.id;
    const maaltijdID = req.params.mid;
    const userID = req.user.id.toString();

    // Create query's
    let queryStudentenhuis =
        `SELECT *
        FROM studentenhuis
        WHERE ID = '${studentenhuisID}'`;
    const queryMaaltijd =
        `SELECT *
        FROM maaltijd
        WHERE StudentenhuisID = '${studentenhuisID}'
        AND ID = '${maaltijdID}'`;

    // Checking if studentenhuis exists
    database.query(queryStudentenhuis, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (studentenhuis bestaad niet)');
        database.query(queryMaaltijd, (dbError, result, fields) => {
            if (result.length === 0) return res.status(404).send('Niet gevonden (maaltijd bestaad niet)');
            const maaltijd = {
                ID: result[0].ID.toString(),
                Naam: req.body.naam,
                Beschrijving: req.body.beschrijving,
                Ingredienten: req.body.ingredienten,
                Allergie: req.body.allergie,
                Prijs: req.body.prijs,
                UserID: result[0].UserID.toString(),
                StudentenhuisID: result[0].StudentenhuisID.toString()
            };
            console.log('Maaltijd:\n', maaltijd);
            console.log('User trying to edit maaltijd:\n', userID);
            const { error } = validate(maaltijd);
            if (error) return res.status(412).send(error.details[0].message);
            if (!(userID.toString() === maaltijd.UserID.toString())) return res.status(409).send('Cannot modify someone else his/her maaltijden');
            const statementUpdateMaaltijd =
                `UPDATE maaltijd
                SET Naam = '${maaltijd.Naam}',
                Beschrijving = '${maaltijd.Beschrijving}',
                Ingredienten = '${maaltijd.Ingredienten}',
                Allergie = '${maaltijd.Allergie}',
                Prijs = '${maaltijd.Prijs}'
                WHERE ID = '${maaltijd.ID}'`;
            console.log('Update statement:\n', statementUpdateMaaltijd);
            database.query(statementUpdateMaaltijd, maaltijd, (error, result, fields) => {
                database.query(`SELECT * FROM maaltijd WHERE id = '${maaltijd.ID}'`, (error, result, fields) => {
                    res.status(200).json(result);
                })

            });
        });
    });

});

router.delete('/:id/maaltijd/:mid', auth, (req, res) => {

    // Get client input
    const studentenhuisID = req.params.id;
    const maaltijdID = req.params.mid;
    const userID = req.user.id.toString();

    // Create query's
    let queryStudentenhuis =
        `SELECT *
        FROM studentenhuis
        WHERE ID = '${studentenhuisID}'`;
    const queryMaaltijd =
        `SELECT *
        FROM maaltijd
        WHERE StudentenhuisID = '${studentenhuisID}'
        AND ID = '${maaltijdID}'`;

    // Checking if studentenhuis exists
    database.query(queryStudentenhuis, (error, result, field) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (studentenhuis bestaad niet)');
        database.query(queryMaaltijd, (dbError, result, fields) => {
            if (result.length === 0) return res.status(404).send('Niet gevonden (maaltijd bestaad niet)');
            if (!(userID.toString() === result[0].UserID.toString())) return res.status(409).send('Cannot delete someone else his/her maaltijden');
            database.query(`DELETE FROM maaltijd WHERE StudentenhuisID = '${studentenhuisID}' AND ID = '${maaltijdID}'`, (error, result) => {
                res.status(200).send('Maaltijd met succes verwijderd');

            });
        });
    });

});

module.exports = router;