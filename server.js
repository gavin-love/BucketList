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

app.post('/api/v1/bucket_lists', (req, resp) => {
  const bucketList = req.body;

  for (let requiredParameter of ['title', 'description']) {
    if (!bucketList[requiredParameter]) {
      return Response.status(422).json({
        error: `Your bucket list is missing a required parameter of "${requiredParameter}"`
      });
    };
  };

  database('bucket_list').insert(bucketList, 'id')
    .then(bucket_list => {
      return resp.status(201).json({ id: bucket_list[0] })
    })
    .catch(error => {
      return resp.status(500).json({ error })
    });
});

app.get('/api/v1/bucket_lists', (req, resp) => {
  database('bucket_list').select()
    .then(bucketLists => {
      return res.status(200).json(bucketLists);
    })
    .catch(error => {
      return res.status(500).json({ error })
    })
})

