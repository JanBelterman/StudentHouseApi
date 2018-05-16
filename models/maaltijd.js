// Require modules
const Joi = require('joi');

// Validate function for the maaltijd object
function validateMaaltijd(maaltijd) {

    // Maaltijd schema
    const schema = {
        naam: Joi.string().required(),
        beschrijving: Joi.string().required(),
        ingredienten: Joi.string().required(),
        allergie: Joi.string().required(),
        prijs: Joi.number().required()
    };

    // Validate maaltijd and return result
    return Joi.validate(maaltijd, schema);

}

// Export validate function
exports.validate = validateMaaltijd;