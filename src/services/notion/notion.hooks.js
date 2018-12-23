const {authenticate} = require('@feathersjs/authentication').hooks;
const symbolExtractor = require('../../hooks/symbolExtractor');
const returnModelInstance = require('../../hooks/rawFalse');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      function (context) {
        if (context.params.query && context.params.query.symbolId) {
          context.params.paginate = false;
          delete context.params.query.$limit;
        }
        return context;
      }],
    get: [],
    // We need the instance to use ORM association
    create: [returnModelInstance],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [symbolExtractor],
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
