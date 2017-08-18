const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should do something', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200)
    })
    done()
  })

});

describe('API Routes', () => {
  it('should do something else', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200)
    })
    done()
  })
});
