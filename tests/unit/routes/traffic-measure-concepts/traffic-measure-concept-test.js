import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module(
  'Unit | Route | traffic-measure-concepts/traffic-measure-concept',
  function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
      let route = this.owner.lookup(
        'route:traffic-measure-concepts/traffic-measure-concept'
      );
      assert.ok(route);
    });
  }
);
