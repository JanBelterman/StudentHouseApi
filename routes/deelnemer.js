// Require modules
const express = require('express');
const auth = require('../middleware/auth');
const database = require('../database');

// Get router
const router = express.Router();

router.post('/:studentenhuisId/maaltijd/:maaltijdId/deelnemers', auth, (req, res) => {

    const deelnemer = {
        UserID: req.user.ID.toString(),
        StudentenhuisID: req.params.studentenhuisId,
        MaaltijdID: req.params.maaltijdId
    };

    database.query(`SELECT * FROM deelnemers WHERE UserID = '${deelnemer.UserID}' AND StudentenhuisID = '${deelnemer.StudentenhuisID}' AND MaaltijdID = '${deelnemer.MaaltijdID}'`, (error, result, fields) => {
        console.log(result);
        if (result.length > 0) return res.status(409).send('Conflict (Gebruiker is al aangemeld)');

        database.query('INSERT INTO deelnemers SET ?', deelnemer, (error, result, fields) => {
            if (error) return res.status(404).send('Niet gevonden (huisId of maaltijdId bestaat niet)');
            res.status(200).json(result);
        });
    });

});

router.get('/:studentenhuisId/maaltijd/:maaltijdId/deelnemers', auth, (req, res) => {

    const deelnemer = {
        UserID: req.user.ID.toString(),
        StudentenhuisID: req.params.studentenhuisId,
        MaaltijdID: req.params.maaltijdId
    };

    database.query(`SELECT * FROM deelnemers WHERE StudentenhuisID = '${deelnemer.StudentenhuisID}' AND MaaltijdID = '${deelnemer.MaaltijdID}'`, (error, result, fields) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (huisId of maaltijdId bestaat niet)');
        res.status(200).json(result);
    });
});

router.delete('/:studentenhuisId/maaltijd/:maaltijdId/deelnemers', auth, (req, res) => {

    const deelnemer = {
        UserID: req.user.ID.toString(),
        StudentenhuisID: req.params.studentenhuisId,
        MaaltijdID: req.params.maaltijdId
    };

    database.query(`SELECT * FROM deelnemers WHERE StudentenhuisID = '${deelnemer.StudentenhuisID}' AND MaaltijdID = '${deelnemer.MaaltijdID}'`, (error, result, fields) => {
        if (result.length === 0) return res.status(404).send('Niet gevonden (huisId of maaltijdId bestaat niet)');
        if (!(deelnemer.UserID.toString() === result[0].UserID.toString())) return res.status(409).send('Conflict (Gebruiker mag deze data niet wijzigen)');
        database.query(`DELETE FROM deelnemers WHERE StudentenhuisID = '${deelnemer.StudentenhuisID}' AND MaaltijdID = '${deelnemer.MaaltijdID}'`, (err, result) => {

            res.status(200).send(`Deelnemer met id: ${deelnemer.UserID} met succes verwijderd`);

        });
    });

});

module.exports = router;