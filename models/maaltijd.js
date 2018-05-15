const Joi = require('Joi');

function validateMaaltijd(maaltijd) {
    const schema = {
        ID: Joi.string().required(),
        Naam: Joi.string().required(),
        Beschrijving: Joi.string().required(),
        Ingredienten: Joi.string().required(),
        Allergie: Joi.string().required(),
        Prijs: Joi.number().required(),
        UserID: Joi.string().required(),
        StudentenhuisID: Joi.string().required()
    };
    return Joi.validate(maaltijd, schema);
}

exports.validate = validateMaaltijd;