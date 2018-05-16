// Required Modules
// Express
const express = require('express');
// Routes
const login = require('./routes/login');
const register = require('./routes/register');
const studenthouse = require('./routes/studenthouse');
const maaltijd = require('./routes/maaltijd');
const deelnemer = require('./routes/deelnemer');

// Middleware
const app = express();
// JSON parser
app.use(express.json());
app.use('/api/login', login);
app.use('/api/register', register);
app.use('/api/studentenhuis', studenthouse);
app.use('/api/studentenhuis', maaltijd);
app.use('/api/studentenhuis', deelnemer);

// Getting port and listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}..`);
});

// Exporting app (for tests)
module.exports = app;