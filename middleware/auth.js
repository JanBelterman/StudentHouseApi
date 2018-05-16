// Require modules
const jwt = require('jsonwebtoken');

// Authentication function
function auth(req, res, next) {

    // Get token from request header
    const token = req.header('x-auth-token');
    // If token isn't provided send response to client
    if (!token) return res.status(401).send('Aces denied. Token not provided');
    // Log token
    console.log('Api called with token:\n', token);

    try {
        // Get payload from token
        const payload = jwt.verify(token, 'SeCrEtJsOnWeBtOkEn');
        // Create user from payload
        req.user = {
            ID: payload.user.ID,
            Email: payload.user.Email
        };
        // Log information
        console.log('Aces granted. Valid token');
        console.log('User gotten from token payload:\n', req.user);
        // Continue to next function in request-response pipeline
        next();
    } catch (ex) {
        // Log information
        res.status(401).send('Aces denied. Invalid token');
    }

}

// Export the authentication function
module.exports = auth;