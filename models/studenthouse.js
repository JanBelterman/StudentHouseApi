const Joi = require('joi');

function validateStudenthouse(studenthouse) {
    const schema = {
        Naam: Joi.string().required(),
        Adres: Joi.string().required(),
        UserID: Joi.string().required()
    };
    return Joi.validate(studenthouse, schema);
}

exports.validate = validateStudenthouse;