const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const shortHash = require('short-hash');

const getFolders = (request, response) => {
  database('folders').select('*')
    .then(folders => {
      response.status(200).json(folders);
    })
    .catch(error => {
      response.status(500).json({ error });
    })
}

const newFolder = (request, response) => {
  const newFolder = request.body;

  for (let requiredParameter of ['name']) {
    if (!newFolder[requiredParameter]) {
      return response.status(422).json({
        error: `Missing required parameter ${requiredParameter}`
      });
    }
  }

  database('folders').insert(newFolder, ['name', 'id'])
    .then(folder => {
      console.log(folder)
      response.status(201).json({
        name: folder[0].name,
        id: folder[0].id })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
}

const getFolderLinks = (request, response) => {
  database('links').where('folder_id', request.params.id).select()
    .then(links => {
      response.status(200).json(links);
    })
    .catch(error => {
      response.status(500).json({ error })
    })
}

module.exports = {
  getFolders: getFolders,
  newFolder: newFolder,
  getFolderLinks: getFolderLinks
};
