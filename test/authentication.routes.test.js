/**
 * Testcases aimed at testing the authentication process.
 */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.
let validToken;

describe('Registration', () => {
    it('should return a token when providing valid information', (done) => {

        chai.request(server)
            .post('/api/register')
            .send({
                email: 'janbeltermanInserted@test.com',
                password: '12345',
                voornaam: 'Jan',
                achternaam: 'Belterman'})
            .end( (err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('Token');
            });

        done()
    });

    it('should return an error on GET request', (done) => {

        done()

    });

    it('should throw an error when the user already exists', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when no firstname is provided', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when firstname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when no lastname is provided', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when lastname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when email is invalid', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

});

describe('Login', () => {

    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when email does not exist', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when email exists but password is invalid', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    });

    it('should throw an error when using an invalid email', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

});