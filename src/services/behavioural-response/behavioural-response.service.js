// Initializes the `BehaviouralResponse` service on path `/behavioural-response`
const createService = require('feathers-sequelize');
const createModel = require('../../models/behavioural-response.model');
const hooks = require('./behavioural-response.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/behavioural-response', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('behavioural-response');

  service.hooks(hooks);
};
