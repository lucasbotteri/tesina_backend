const assert = require('assert');
const app = require('../../src/app');

describe('\'project\' service', () => {
  it('registered the service', () => {
    const service = app.service('project');

    assert.ok(service, 'Registered the service');
  });
});
