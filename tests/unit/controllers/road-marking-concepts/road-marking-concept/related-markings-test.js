import { module, test } from 'qunit';
import { setupTest } from 'mow-registry/tests/helpers';

module(
  'Unit | Controller | road-marking-concepts/road-marking-concept/related-markings',
  function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test('it exists', function (assert) {
      let controller = this.owner.lookup(
        'controller:road-marking-concepts/road-marking-concept/related-markings'
      );
      assert.ok(controller);
    });
  }
);
