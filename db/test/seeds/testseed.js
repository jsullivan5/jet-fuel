
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('links').del()
  .then(() => knex('folders').del())
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('folders').insert({
          name: 'bikes'
        }, 'id')
        .then(folder => {
          return knex('links').insert([
            {
              long_URL: 'http://www.google.com',
              short_URL: 'http://jt.fl/dc17c6d3',
              description: 'google',
              folder_id: folder[0]
            },
            {
              long_URL: 'http://www.example.com',
              short_URL: 'http://jt.fl/93331d9a',
              description: 'google',
              folder_id: folder[0]
            },
          ])
        })
        .then(() => console.log('done seeding'))
        .catch(error => console.log(`error seeding data ${error}`))
      ])
    })
    .then(() => {
        // Inserts seed entries
        return Promise.all([
          knex('folders').insert({
            name: 'pets'
          }, 'id')
          .then(folder => {
            return knex('links').insert([
              {
                long_URL: 'http://www.petsmart.com',
                short_URL: 'http://jt.fl/dc17c6d3',
                description: 'petsmart',
                folder_id: folder[0]
              }
            ])
          })
          .then(() => console.log('done seeding'))
          .catch(error => console.log(`error seeding data ${error}`))
        ]);
    });
  };
