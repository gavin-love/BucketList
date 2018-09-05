const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

app.post('/api/v1/items', (req, resp) => {
  const item = req.body;

  if (!item.title || !item.description) {
    return resp.status(422).json({
      error: `Your bucket list is missing a required parameter of"`
    });
  };


  database('bucket_list').insert(item, 'id')
    .then(card => {
      return resp.status(201).json({ id: card[0] });
    })
    .catch(error => {
      return resp.status(500).json({ error });
    });
});

app.get('/api/v1/items', (req, resp) => {
  database('bucket_list').select()
    .then(item => {
      return resp.status(200).json(item);
    })
    .catch(error => {
      return resp.status(500).json({ error });
    });
});

app.delete('/api/v1/items/:id', (req, resp) => {
  const id = req.params.id;

  database('bucket_list').where('id', id).select().del()
    .then(item => {
      if (item) {
        return resp.status(200).json('Item was deleted');
      } else {
        return resp.status(404).json('Item you are looking for does not exist in the database');
      };
    })
    .catch(error => {
      return resp.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`you are listening on ${app.get('port')}`);
});

module.exports = app;

