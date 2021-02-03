import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | roadsign-concepts', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:roadsign-concepts');
    assert.ok(route);
  });
});
