import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | roadsign-concepts/edit', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:roadsign-concepts/edit');
    assert.ok(route);
  });
});
