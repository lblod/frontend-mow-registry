import { module, test } from 'qunit';
import { setupTest } from 'mow-registry/tests/helpers';

module(
  'Unit | Route | road-sign-concepts/road-sign-concept/subsigns',
  function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
      let route = this.owner.lookup(
        'route:road-sign-concepts/road-sign-concept/subsigns'
      );
      assert.ok(route);
    });
  }
);
