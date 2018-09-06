// Initializes the `project` service on path `/project`
const createService = require('feathers-sequelize');
const createModel = require('../../models/project.model');
const hooks = require('./project.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/project', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('project');

  service.hooks(hooks);
};
