const assert = require('assert');
const app = require('../../src/app');

describe('\'BehaviouralResponse\' service', () => {
  it('registered the service', () => {
    const service = app.service('behavioural-response');

    assert.ok(service, 'Registered the service');
  });
});
