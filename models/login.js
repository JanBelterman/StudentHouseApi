// Require modules
const Joi = require('joi');

// Validate function for the login object
function validateLogin(login) {
    // Create schema
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required()
    };
    // Validate login and return the result
    return Joi.validate(login, schema);
}

// Export validate function
exports.validate = validateLogin;