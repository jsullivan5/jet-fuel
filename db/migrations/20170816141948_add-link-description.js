
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', function(table) {
      table.string('description');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', function(table) {
      table.dropColumn('description');
    })
  ]);
};
