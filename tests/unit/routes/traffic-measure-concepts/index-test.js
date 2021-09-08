import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | traffic-measure-concepts/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:traffic-measure-concepts/index');
    assert.ok(route);
  });
});
