const mySql = require('mysql');

// Database connecting
let database = mySql.createConnection( {
    host: process.env.DB_HOST || '188.166.109.108',
    user: process.env.DB_USER || 'studentenhuis_user',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_DATABASE || 'studentenhuis',
    insecureAuth: true
});
database.connect( (error) => {

    if(error) {
        console.log(error);

    } else {
        console.log('Connected to database');

    }

});

module.exports = database;