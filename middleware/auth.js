const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Aces denied. Token not provided');
    try {
        const payload = jwt.verify(token, 'HoningDropVanVencoTijdensHetProgrammeren');
        req.user = payload;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token');
    }
}

module.exports = auth;