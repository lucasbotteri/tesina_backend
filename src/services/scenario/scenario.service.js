// Initializes the `scenario` service on path `/scenario`
const createService = require('feathers-sequelize');
const createModel = require('../../models/scenario.model');
const hooks = require('./scenario.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/scenario', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('scenario');

  service.hooks(hooks);
};
