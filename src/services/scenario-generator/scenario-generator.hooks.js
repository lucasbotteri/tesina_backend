const { authenticate } = require('@feathersjs/authentication').hooks;

const preserveContext = async context => {
  if (context.method === 'create') {
    const { app, data } = context;
    const scenarioService = app.service('scenario');

    // Get existing scenarios with their contexts
    const existingScenarios = await scenarioService.find({
      query: {
        projectId: data.projectId,
        $select: ['verbId', 'context']
      },
      paginate: false
    });

    // Store contexts in the hook context for later use
    context.existingContexts = existingScenarios.reduce((acc, scenario) => {
      if (scenario.context) {
        acc[scenario.verbId] = scenario.context;
      }
      return acc;
    }, {});
  }
  return context;
};

const applyStoredContext = async context => {
  if (context.method === 'create') {
    const generatedScenarios = context.result;
    const existingContexts = context.existingContexts || {};

    // Update scenarios with their previous contexts
    await Promise.all(generatedScenarios.map(async scenario => {
      if (existingContexts[scenario.verbId]) {
        await scenario.update({
          context: existingContexts[scenario.verbId]
        });
      }
    }));
  }
  return context;
};

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [preserveContext],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [applyStoredContext],
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
