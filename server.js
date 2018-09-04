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

app.post('/api/v1/bucketlists', (req, resp) => {
  const bucketList = req.body;

  for (let requiredParameter of ['title', 'description']) {
    if (!bucketList[requiredParameter]) {
      return resp.status(422).json({
        error: `Your bucket list is missing a required parameter of "${requiredParameter}"`
      });
    };
  };

  database('bucket_list').insert(bucketList, 'id')
    .then(bucketList => {
      return resp.status(201).json({ id: bucketList[0] });
    })
    .catch(error => {
      return resp.status(500).json({ error });
    });
});

app.get('/api/v1/bucketlists', (req, resp) => {
  database('bucket_list').select()
    .then(bucketLists => {
      return resp.status(200).json(bucketLists);
    })
    .catch(error => {
      return resp.status(500).json({ error });
    });
});

app.delete('/api/v1/bucketlists/:title', (req, resp) => {
  const title = request.params.title;

  database('bucket_list').where('title', title).select().del()
    .then(bucketList => {
      if (bucketList) {
        return resp.status(200).json('Bucket list was deleted');
      } else {
        return resp.status(404).json('The bucket list you are looking for does not exist in the database');
      };
    })
    .catch(error => {
      return resp.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`you are listening on ${app.get('port')}`);
});

