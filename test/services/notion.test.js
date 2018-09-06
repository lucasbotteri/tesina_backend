const assert = require('assert');
const app = require('../../src/app');

describe('\'Notion\' service', () => {
  it('registered the service', () => {
    const service = app.service('notion');

    assert.ok(service, 'Registered the service');
  });
});
