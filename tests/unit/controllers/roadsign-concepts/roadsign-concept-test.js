import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module(
  'Unit | Controller | roadsign-concepts/roadsign-concept',
  function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test('it exists', function (assert) {
      let controller = this.owner.lookup(
        'controller:roadsign-concepts/roadsign-concept'
      );
      assert.ok(controller);
    });
  }
);
