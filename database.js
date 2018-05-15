const mySql = require('mysql');

// Database connecting
let database = mySql.createConnection( {
    host: '188.166109.108',
    user: 'studentenhuis_user',
    password: 'secret',
    database: 'studentenhuis',
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