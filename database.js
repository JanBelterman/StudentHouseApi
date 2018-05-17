const mySql = require('mysql');

// Database connecting
let database = mySql.createConnection( {
    host: proces.env.DB_HOST,
    user: proces.env.DB_USER,
    password: proces.env.DB_PASSWORD,
    database: proces.env.DB_DATABASE,
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