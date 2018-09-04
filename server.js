const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.end.NODE_env || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser).urlencoded({ extended: true });



