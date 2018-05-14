const Joi = require('Joi');

function validateLogin(login) {
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required()
    };
    return Joi.validate(login, schema);
}

exports.validate = validateLogin;