const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Database confiuguration
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Fuel'
app.locals.folders = {}

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html')
});

app.post('/api/v1/folders', (request, response) => {
  const newFolder = request.body;

  for (let requiredParameter of ['name']) {
    if (!newFolder[requiredParameter]) {
      return response.status(422).json({
        error: `Missing required parameter ${requiredParameter}`
      });
    }
  }

  database('folders').insert(newFolder, 'id')
    .then(folder => {
      response.status(201).json({ id: folder[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
