// Require modules
const Joi = require('joi');

// Validate function for the maaltijd object
function validateMaaltijd(maaltijd) {
    // Maaltijd schema
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
    // Validate maaltijd and return result
    return Joi.validate(maaltijd, schema);
}

// Export validate function
exports.validate = validateMaaltijd;