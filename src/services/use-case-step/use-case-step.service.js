const createService = require('feathers-sequelize');
const createModel = require('../../models/use-case-step.model');
const hooks = require('./use-case-step.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    sequelize: {
      raw: false,
    },
  };

  app.use('/use-case-step', createService(options));
  const service = app.service('use-case-step');
  service.hooks(hooks);
};