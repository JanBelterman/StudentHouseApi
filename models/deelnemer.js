const Joi = require('joi');

function validateDeelnemer(deelnemer) {

    const schema = {
        userId: Joi.string().required(),
        studentenhuisId: Joi.string().required(),
        maaltijdId: Joi.string().required()
    };

    return Joi.validate(deelnemer, schema);

}

exports.validate = validateDeelnemer;