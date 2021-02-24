import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | road-sign-concepts/subsigns/edit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:road-sign-concepts/subsigns/edit');
    assert.ok(route);
  });
});
