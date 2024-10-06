const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {

    all: [authenticate('jwt')],
    find: [includeAssociations()],
    get: [includeAssociations()],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {},
  error: {},
};

function includeAssociations() {
  return async (context) => {
    const sequelize = context.app.get('sequelizeClient');
    const { models } = sequelize;
    const include = [];

    const associations = {
      verb: { model: models.symbol, as: 'verb' },
      actors: { model: models.symbol, as: 'actors' },
      goals: { model: models.notion, as: 'goals' },
      resources: { model: models.symbol, as: 'resources' },
      episodes: { model: models.behavioural_response, as: 'episodes' },
    };

    // Check for query params like ?$include=actors,goals
    if (context.params.query && context.params.query.$include) {
      const includes = context.params.query.$include.split(',');

      includes.forEach((inc) => {
        if (associations[inc]) {
          include.push(associations[inc]);
        }
      });

      // Remove $include from the query to avoid errors
      delete context.params.query.$include;
    } else {
      // Default includes
      include.push(...Object.values(associations));
    }

    context.params.sequelize = {
      include,
      raw: false,
    };

    return context;
  };
}