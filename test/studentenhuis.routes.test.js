const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

describe('Studentenhuis API POST', () => {

    before(function(){
        global.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyU2VydmVyIjp7ImlkIjo2OCwiZW1haWwiOiJqYW5iZWx0ZXJtYW5AYXZhbnMubmwiLCJwYXNzd29yZCI6IjEyMzQ1In0sImlhdCI6MTUyNjQxMzc0Mn0.nThTFJwXroRerJfSnaygiAUxmLFH0LzimKq77QF4c1I';
    });

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
            .get('/api/studentenhuis/1')
            .set('x-auth-token', token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done();

    });

    it('should return the correct studentenhuis when using an existing huisId', (done) => {

        chai.request(server)
            .get('/api/studentenhuis/1')
            .set('x-auth-token', global.token)
            .end( (err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
            });


        done()
    });

    it('should return an error when using an non-existing huisId', (done) => {

        chai.request(server)
            .get('/api/studentenhuis/999')
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
            .put('/api/studentenhuis/1')
            .set('x-auth-token', token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done();

    });

    it('should return a studentenhuis with ID when posting a valid object', (done) => {

        let studentenhuis = {
            naam: 'Studentenhuis van Jan',
            adres: 'Den Dries 63 Gilze'
        };

        chai.request(server)
            .put('/api/studentenhuis/75')
            .send(studentenhuis)
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
            .put('/api/studentenhuis/7')
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
            .put('/api/studentenhuis/7')
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
            .delete('/api/studentenhuis/8')
            .set('x-auth-token', token)
            .end( (err, res) => {
                res.should.have.status(401);
            });

        done()

    });

    // ?????
    // it('should return a studentenhuis when posting a valid object', (done) => {
    //
    //     chai.request(server)
    //         .delete('/api/studentenhuis/8')
    //         .set('x-auth-token', global.token)
    //         .end( (err, res) => {
    //             res.should.be.a('object');
    //             res.should.have.status(200);
    //         });
    //
    //     done()
    //
    // });
    //
    // it('should throw an error when naam is missing', (done) => {
    //
    //
    //
    //     done()
    //
    // });
    //
    // it('should throw an error when adres is missing', (done) => {
    //
    //
    //
    //     done()
    //
    // })
});