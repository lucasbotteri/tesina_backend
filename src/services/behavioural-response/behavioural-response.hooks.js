const {authenticate} = require('@feathersjs/authentication').hooks;
const symbolExtractor = require('../../hooks/symbolExtractor');
const returnModelInstance = require('../../hooks/rawFalse');
const includeReferencedSymbols = require('../../hooks/includeSymbolsReferenced');
const removePagination = require('../../hooks/removePagination');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [removePagination, includeReferencedSymbols],
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
