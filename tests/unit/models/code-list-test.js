import { module, test } from 'qunit';

import { setupTest } from 'mow-registry/tests/helpers';

module('Unit | Model | code list', function (hooks) {
  setupTest(hooks);

  this.store = function () {
    return this.owner.lookup('service:store');
  };

  test('it has error when label is missing', async function (assert) {
    const model = this.store().createRecord('code-list');

    const isValid = await model.validate();

    assert.false(isValid);
    assert.strictEqual(Object.keys(model.error).length, 1);
    assert.strictEqual(model.error.label.message, 'errors.label.required');
  });

  test('it does not have error when label is filled in', async function (assert) {
    const model = this.store().createRecord('code-list', {
      label: 'test',
    });

    const isValid = await model.validate();

    assert.true(isValid);
    assert.strictEqual(model.error, undefined);
  });
});
