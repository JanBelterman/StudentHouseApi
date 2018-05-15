const Joi = require('Joi');

function validateDeelnemer(deelnemer) {
    const schema = {
        UserID: Joi.string().required(),
        StudentenhuisID: Joi.string().required(),
        MaaltijdID: Joi.string().required()
    };
    return Joi.validate(deelnemer, schema);
}

exports.validate = validateDeelnemer;