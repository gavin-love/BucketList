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

  it('should return a list of items when a GET request is made', (done) => {
    chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        should.equal(error, null);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.should.have.length(1);
        response.body[0].should.be.a('object');
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('title');
        response.body[0].should.have.property('description');
        response.body[0].id.should.be.a('number');
        response.body[0].title.should.be.a('string');
        response.body[0].description.should.be.a('string');
        response.body[0].id.should.equal(1);
        response.body[0].title.should.equal('test-title');
        response.body[0].description.should.equal('test-description');
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
        should.equal(error, null);
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.be.a('number');
        response.body.id.should.equal(2);
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
        response.body.should.be.a('object');
        done();
      });
  });

  it('should delete a card from the bucket list when a DELETE request is made', (done) => {
    chai.request(server)
      .delete('/api/v1/items/1')
      .end((error, response) => {
        should.equal(error, null);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('string');
        done();
      });
  });

  it('throws an error if title does not exist when a DELETE request is made', (done) => {
    chai.request(server)
      .delete('/api/v1/items/2')
      .end((error, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('string');
        done();
      });
  });
});