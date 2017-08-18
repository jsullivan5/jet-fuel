const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const app = express();

// Database confiuguration
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Fuel'
app.locals.folders = {}

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html')
});

app.use('/api', router);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

module.exports = app;
