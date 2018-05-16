const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const database = require('../database');
const jwt = require('jsonwebtoken');

chai.should();
chai.use(chaiHttp);

before(function(){

    global.token = jwt.sign({
        user: {
            ID: '999',
            Email: "janbelterman@test.nl"
        }}, 'SeCrEtJsOnWeBtOkEn');

    const user = {
        Email: 'janbelterman@test.nl',
        Password: '12345',
        Voornaam: "Jan",
        Achternaam: "Belterman",
        ID: '999'
    };

    database.query('INSERT INTO user SET ?', user, (error, result, field) => {
        if (error) console.log('Error inserting test user\n', error);
    });

    // Create test database records
    const studentenhuis = {
        ID: '999',
        Naam: "Studentenhuis van Jan",
        Adres: "Den Dries 63 Gilze",
        UserID: '999'
    };

    database.query(`INSERT INTO studentenhuis SET ?`, studentenhuis, (error, result, fields) => {
        if (error) console.log('Error inserting test studentenhuis\n', error);
    });

});

after(function(done) {

    console.log('Deleting test data');

    database.query(`DELETE FROM studentenhuis WHERE ID = '999'`, (error, result) => {
        if (error) console.log('Error deleting test studentenhuis\n', error);
    });
    database.query(`DELETE FROM studentenhuis WHERE Naam = 'Studentenhuis van Jan Test'`, (error, result) => {
        if (error) console.log('Error deleting test studentenhuis\n', error);
    });
    // Delete created data
    database.query(`DELETE FROM user WHERE Email = 'janbeltermanInserted@test.com'`, (error, result) => {
        if (error) console.log('Error deleting test user\n', error);
    });
    database.query(`DELETE FROM user WHERE Email = 'janbelterman@test.nl'`, (error, result) => {
        if (error) console.log('Error deleting test user2\n', error);
    });

    done();

});

describe('Studentenhuis API POST', () => {

    it('should throw an error when using invalid JWT token', (done) => {

        let token = 'jabiwbdioabwodbaobdob219eqwr9y8wy9q8rwy89qhrq89rbqw8bvqwr';

        chai.request(server)
            .post('/api/studentenhuis')
            .set('x-auth-token', token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()

    });

    it('should return a studentenhuis when posting a valid object', (done) => {

        let studentenhuis = {
            naam: 'Studentenhuis van Jan',
            adres: 'Den Dries 63 Gilze'
        };

        chai.request(server)
            .post('/api/studentenhuis')
            .set('x-auth-token', global.token)
            .send(studentenhuis)
            .end( (err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('ID');
                res.body.should.have.property('Naam');
                res.body.should.have.property('Adres');
                res.body.should.have.property('UserID');
            });

        done()

    });

    it('should throw an error when naam is missing', (done) => {

        let studentenhuis = {
            adres: 'Den Dries 63 Gilze'
        };

        chai.request(server)
            .post('/api/studentenhuis')
            .set('x-auth-token', global.token)
            .send(studentenhuis)
            .end( (err, res) => {
                res.should.have.status(412);
            });

        done()

    });

    it('should throw an error when adres is missing', (done) => {

        let studentenhuis = {
            naam: 'Studentenhuis van Jan'
        };

        chai.request(server)
            .post('/api/studentenhuis')
            .set('x-auth-token', global.token)
            .send(studentenhuis)
            .end( (err, res) => {
                res.should.have.status(412);
            });

        done();

    })
});

describe('Studentenhuis API GET all', () => {
    it('should throw an error when using invalid JWT token', (done) => {

        let token = 'jabiwbdioabwodbaobdob219eqwr9y8wy9q8rwy89qhrq89rbqw8bvqwr';

        chai.request(server)
            .get('/api/studentenhuis')
            .set('x-auth-token', token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()

    });

    it('should return all studentenhuizen when using a valid token', (done) => {

        chai.request(server)
            .get('/api/studentenhuis')
            .set('x-auth-token', global.token)
            .end( (err, res) => {
                res.body.should.be.a('array');
            });

        done();

    })
});

describe('Studentenhuis API GET one', () => {
    it('should throw an error when using invalid JWT token', (done) => {

        let token = 'jabiwbdioabwodbaobdob219eqwr9y8wy9q8rwy89qhrq89rbqw8bvqwr';

        chai.request(server)
            .get('/api/studentenhuis/999') // ASUMING EXITSTS
            .set('x-auth-token', token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done();

    });

    it('should return the correct studentenhuis when using an existing huisId', (done) => {

        chai.request(server)
            .get('/api/studentenhuis/999') // ASUMING DATA EXITSTS
            .set('x-auth-token', global.token)
            .end( (err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
            });


        done()
    });

    it('should return an error when using an non-existing huisId', (done) => {

        chai.request(server)
            .get('/api/studentenhuis/999999')
            .set('x-auth-token', global.token)
            .end( (err, res) => {
                res.should.have.status(404);
            });

        done()
    })
});

describe('Studentenhuis API PUT', () => {
    it('should throw an error when using invalid JWT token', (done) => {

        let token = 'jabiwbdioabwodbaobdob219eqwr9y8wy9q8rwy89qhrq89rbqw8bvqwr';

        chai.request(server)
            .put('/api/studentenhuis/999') // ASUMING DATA EXISTS
            .set('x-auth-token', token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done();

    });

    it('should return a studentenhuis with ID when posting a valid object', (done) => {

        chai.request(server)
            .put('/api/studentenhuis/999') // ASUMING DATA EXISTS
            .send({
                naam: 'Studentenhuis van Jan Test',
                adres: 'Den Dries 63 Gilze'
            })
            .set('x-auth-token', global.token)
            .end( (err, res) =>{
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('ID');
            });

        done()

    });

    it('should throw an error when naam is missing', (done) => {

        let studentenhuis = {
            adres: 'Den Dries 63 Gilze'
        };

        chai.request(server)
            .put('/api/studentenhuis/999') // ASUMING DATA EXISTS
            .send(studentenhuis)
            .set('x-auth-token', global.token)
            .end( (err, res) => {
                res.should.have.status(412)
            });

        done()

    });

    it('should throw an error when adres is missing', (done) => {

        let studentenhuis = {
            naam: 'Studentenhuis van Jan'
        };

        chai.request(server)
            .put('/api/studentenhuis/999') // ASUMING DATA EXISTS
            .send(studentenhuis)
            .set('x-auth-token', global.token)
            .end( (err, res) => {
                res.should.have.status(412)
            });

        done();

    })
});

describe('Studentenhuis API DELETE', () => {

    it('should throw an error when using invalid JWT token', (done) => {

        let token = 'jabiwbdioabwodbaobdob219eqwr9y8wy9q8rwy89qhrq89rbqw8bvqwr';

        chai.request(server)
            .delete('/api/studentenhuis/999') // ASUMING DATA EXISTS
            .set('x-auth-token', token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()

    });

    it(`should response with a message when succeeding deleting a studentenhuis`, (done) => {

        chai.request(server)
            .delete('/api/studentenhuis/999')
            .set('x-auth-token', global.token)
            .end( (err, res) => {
                res.should.have.status(200);
            });

        done();

    });

});