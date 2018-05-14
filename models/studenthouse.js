const Joi = require('Joi');

function validateStudenthouse(studenthouse) {
    const schema = {
        naam: Joi.string().required(),
        adres: Joi.string().required(),
        userId: Joi.string().required()
    };
    return Joi.validate(studenthouse, schema);
}

exports.validate = validateStudenthouse;