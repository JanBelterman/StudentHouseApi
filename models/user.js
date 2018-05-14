const Joi = require('Joi');

function validateUser(user) {
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required()
    };
    return Joi.validate(user, schema);
}

exports.validate = validateUser;