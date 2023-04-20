import { module, test } from 'qunit';
import { setupTest } from 'mow-registry/tests/helpers';

module(
  'Unit | Controller | road-sign-concepts/road-sign-concept',
  function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test('it exists', function (assert) {
      let controller = this.owner.lookup(
        'controller:road-sign-concepts/road-sign-concept'
      );
      assert.ok(controller);
    });
  }
);
