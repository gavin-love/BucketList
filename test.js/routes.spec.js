const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = require('../knexfile')['test'];
const database = require('knex')(environment);

chai.use(chaiHttp);

describe('/api/v1/bucket_list', () => {
  beforeEach(done => {
    database.migrate.rollback()
      .then(() => database.migrate.latest())
      .then(() => database.seed.run())
      .then(() => done());
  });

  it('should return a list of bucket lists when a GET request is made', (done) => {
    chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        done();
      })
  })

  it('should insert a new bucket list when a POST request is made', (done) => {
    chai.request(server)
      .post('/api/v1/items')
      .send({
        title: 'china',
        description: 'far'
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('id')
        done();
      });
  });

  it('throws an error if request params are missing when a POST request is made', (done) => {
    chai.request(server)
      .post('/api/v1/items')
      .send({
        title: 'failed'
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.should.be.json;
        done();
      });
  });

  it.only('should delete a card from the bucket list when a DELETE request is made', (done) => {
    chai.request(server)
      .delete('/api/v1/items/1')
      .end((error, response) => {
        response.should.have.status(200);
        done();
      });
  });

  it('throws an error if title does not exist when a DELETE request is made', (done) => {
    chai.request(server)
      .post('/api/v1/items/nope')
      .end((error, response) => {
        response.should.have.status(404);
        response.should.be.json;
        done();
      });
  });
});