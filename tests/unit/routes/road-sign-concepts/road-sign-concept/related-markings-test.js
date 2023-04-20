import { module, test } from 'qunit';
import { setupTest } from 'mow-registry/tests/helpers';

module(
  'Unit | Route | road-sign-concepts/road-sign-concept/related-markings',
  function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
      let route = this.owner.lookup(
        'route:road-sign-concepts/road-sign-concept/related-markings'
      );
      assert.ok(route);
    });
  }
);
