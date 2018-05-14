// Required Modules
const express = require('express');
const login = require('./routes/login');
const register = require('./routes/register');
const studenthouse = require('./routes/studenthouse');

// Middleware
const app = express();
app.use(express.json());
app.use('/api/login', login);
app.use('/api/register', register);
app.use('/api/studentenhuis', studenthouse);

// Listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}..`);
});