const { authenticate } = require('@feathersjs/authentication').hooks;

function includeAssociations() {
  return async (context) => {
    const sequelize = context.app.get('sequelizeClient');
    const { models } = sequelize;
    const include = [];

    const associations = {
      actors: { model: models.symbol, as: 'actors' },
      scenarios: { model: models.scenario, as: 'scenarios' },
      happyPathSteps: {
        model: models.use_case_step,
        as: 'happyPathSteps',
        separate: true,
        order: [['order', 'ASC']]
      },
      alternativePathSteps: {
        model: models.use_case_step,
        as: 'alternativePathSteps',
        separate: true,
        order: [['order', 'ASC']]
      },
      exceptionalPathSteps: {
        model: models.use_case_step,
        as: 'exceptionalPathSteps',
        separate: true,
        order: [['order', 'ASC']]
      }
    };

    if (context.params.query && context.params.query.$include) {
      const includes = context.params.query.$include.split(',');
      includes.forEach((inc) => {
        if (associations[inc]) {
          include.push(associations[inc]);
        }
      });
      delete context.params.query.$include;
    } else {
      include.push(...Object.values(associations));
    }

    context.params.sequelize = {
      include,
      raw: false,
    };

    return context;
  };
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [includeAssociations()],
    get: [includeAssociations()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}; 