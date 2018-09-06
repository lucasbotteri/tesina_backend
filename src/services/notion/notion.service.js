// Initializes the `Notion` service on path `/notion`
const createService = require('feathers-sequelize');
const createModel = require('../../models/notion.model');
const hooks = require('./notion.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/notion', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('notion');

  service.hooks(hooks);
};
