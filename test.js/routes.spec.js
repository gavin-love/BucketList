const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = require('../knexfile')['test'];
const database = require('knex')(environment);

chai.use(chaiHttp);