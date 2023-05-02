import { module, test } from 'qunit';
import { setupTest } from 'mow-registry/tests/helpers';

module(
  'Unit | Controller | traffic-light-concepts/traffic-light-concept/related-lights',
  function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test('it exists', function (assert) {
      let controller = this.owner.lookup(
        'controller:traffic-light-concepts/traffic-light-concept/related-lights'
      );
      assert.ok(controller);
    });
  }
);
