const assert = require('assert');
const app = require('../../src/app');

describe('\'symbol\' service', () => {
  it('registered the service', () => {
    const service = app.service('symbol');

    assert.ok(service, 'Registered the service');
  });
});
