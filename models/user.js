// Require modules
const Joi = require('Joi');

// Function to validate a user object
function validateUser(user) {
    // User schema
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required()
    };
    // Validate user and return the result
    return Joi.validate(user, schema);
}

// Export the validate function
exports.validate = validateUser;