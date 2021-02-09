import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | roadsign-concepts.roadsign-concept', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:roadsign-concepts.roadsign-concept');
    assert.ok(route);
  });
});