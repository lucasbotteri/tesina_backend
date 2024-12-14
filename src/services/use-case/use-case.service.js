const createService = require('feathers-sequelize');
const createModel = require('../../models/use-case.model');
const hooks = require('./use-case.hooks');

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

  app.use('/use-case', createService(options));
  const service = app.service('use-case');
  service.hooks(hooks);
}; 