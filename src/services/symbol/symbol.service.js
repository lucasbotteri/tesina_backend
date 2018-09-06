// Initializes the `symbol` service on path `/symbol`
const createService = require('feathers-sequelize');
const createModel = require('../../models/symbol.model');
const hooks = require('./symbol.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  app.post('/symbol', (req, res ,next) => {
    console.log(req.body);
    next();
  })

  // Initialize our service with any options it requires
  app.use('/symbol', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('symbol');

  service.hooks(hooks);
};
