exports.seed = function (knex, Promise) {
  return knex('bucket_list').del()
    .then(function () {
      return Promise.all([
        knex('bucket_list').insert([
          { title: 'test-title', description: 'test-description' }
        ])
      ])
    });
};
