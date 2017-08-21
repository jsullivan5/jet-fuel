process.env.NODE_ENV = 'test';

const configuration =
require('../knexfile')['test'];
const database = require('knex')(configuration);

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the home page', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.have.string('Jet');
      response.res.text.should.have.string('Fuel');
      done();
    });
  });

  it('should return a 404 if endpoint not found', (done) => {
    chai.request(server)
    .get('/unhappy')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {

  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        database.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });

  describe('GET /api/v1/folders', () => {
    it('should get the folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('bikes');
        response.body[0].should.have.property('created_at');
        response.body[1].should.have.property('id');
        response.body[1].id.should.equal(2);
        response.body[1].should.have.property('name');
        response.body[1].name.should.equal('pets');
        response.body[1].should.have.property('created_at');
        done();
      });
    });
  });

  describe('POST /api/v1/folders', () => {
    it('should create a new folder', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        name: 'beers'
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('name');
        response.body.name.should.equal('beers');
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
        chai.request(server)
        .get('/api/v1/folders')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[2].id.should.equal(3);
          response.body[2].should.have.property('name');
          response.body[2].name.should.equal('beers');
          response.body[2].should.have.property('created_at');
          done();
        });
      });
    });

    it('should return an error if user tries to duplicate folder.', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        name: 'beers'
      })
      .end((err, response) => {
        response.should.have.status(201)
        chai.request(server)
        .post('/api/v1/folders')
        .send({
          name: 'beers'
        })
        .end((err, response) => {
          response.should.have.status(500);
          response.body.error.detail.should.equal('Key (name)=(beers) already exists.');
          done();
        });
      });
    });

    it('should return 422 if insufficient data is provided', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({})
      .end((err, response) => {
        response.should.have.status(422);
        response.body.error.should.equal('Missing required parameter name');
        done();
      });
    });
  });

  describe('GET api/v1/folders/:id/links', () => {
    it('should get links for a folder', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1/links')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);

        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('long_URL');
        response.body[0].long_URL.should.equal('http://www.google.com');
        response.body[0].should.have.property('short_URL');
        response.body[0].short_URL.should.equal('http://jt.fl/dc17c6d3');
        response.body[0].should.have.property('folder_id');
        response.body[0].folder_id.should.equal(1);
        response.body[0].should.have.property('description');
        response.body[0].description.should.equal('google');
        response.body[0].should.have.property('created_at');

        response.body[1].should.have.property('id');
        response.body[1].id.should.equal(2);
        response.body[1].should.have.property('long_URL');
        response.body[1].long_URL.should.equal('http://www.example.com');
        response.body[1].should.have.property('short_URL');
        response.body[1].short_URL.should.equal('http://jt.fl/93331d9a');
        response.body[1].should.have.property('folder_id');
        response.body[1].folder_id.should.equal(1);
        response.body[1].should.have.property('description');
        response.body[1].description.should.equal('google');
        response.body[1].should.have.property('created_at');
        done();
      });
    });
  });

  describe('POST /api/v1/links', () => {
    it('should create a link', (done) => {
      chai.request(server)
      .post('/api/v1/links')
      .send({
        long_URL: 'http://www.expedia.com',
        short_URL: '12345',
        folder_id: 1,
        description: 'expedia'
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');

        response.body.should.have.property('id');
        response.body.id.should.equal(4);
        response.body.should.have.property('long_URL');
        response.body.long_URL.should.equal('http://www.expedia.com');
        response.body.should.have.property('short_URL');
        response.body.short_URL.should.equal('http://jt.fl/ca2ea3b5');
        response.body.should.have.property('folder_id');
        response.body.folder_id.should.equal(1);
        response.body.should.have.property('description');
        response.body.description.should.equal('expedia');
        response.body.should.have.property('created_at');
        chai.request(server)
        .get('/api/v1/folders/1/links')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[2].should.have.property('long_URL');
          response.body[2].long_URL.should.equal('http://www.expedia.com');
          response.body[2].should.have.property('short_URL');
          response.body[2].short_URL.should.equal('http://jt.fl/ca2ea3b5');
          response.body[2].should.have.property('folder_id');
          response.body[2].folder_id.should.equal(1);
          response.body[2].should.have.property('description');
          response.body[2].description.should.equal('expedia');
          response.body[2].should.have.property('created_at');
          done();
        });
      });
    });

    it('should return 422 if insufficient data is provided', (done) => {
      chai.request(server)
      .post('/api/v1/links')
      .send({
        long_URL: 'http://www.expedia.com',
        short_URL: '12345',
        folder_id: 1
        // Missing description
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.error.should.equal('Missing required parameter description.');
        done();
      });
    });
  });

  describe('GET /api/*/:charHash', () => {
    it.only('should accept GET request to redirect', (done) => {
      chai.request(server)
      .get('/api/v1/http://jt.fl/93331d9a')
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
    });
  });
});
