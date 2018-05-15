const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Aces denied. Token not provided');
    console.log('Api called with token:\n', token);
    try {
        const payload = jwt.verify(token, 'HoningDropVanVencoTijdensHetProgrammeren');
        req.user = {
            id: payload.userServer.id,
            email: payload.userServer.email
        };
        console.log('Aces granted. Valid token');
        console.log('User gotten from token payload:\n', req.user);
        next();
    } catch (ex) {
        res.status(400).send('Aces denied. Invalid token');
    }
}

module.exports = auth;