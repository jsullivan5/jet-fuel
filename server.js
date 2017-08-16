const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Fuel'
app.locals.folders = {}

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html')
});

app.post('/api/v1/folders', (request, response) => {
  const { folder } = request.body;

  app.locals.folders[folder] = folder;

  response.status(201).json({ folder });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
