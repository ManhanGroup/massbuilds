import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | map/users', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:map/users');
    assert.ok(route);
  });
});
