import { module, test } from 'qunit';

import { setupTest } from 'mow-registry/tests/helpers';

module('Unit | Model | traffic light concept', function (hooks) {
  setupTest(hooks);

  this.store = function () {
    return this.owner.lookup('service:store');
  };

  test('it has error when mandatory fields are missing', async function (assert) {
    const model = this.store().createRecord('traffic-light-concept');

    const isValid = await model.validate();

    assert.false(isValid);
    assert.strictEqual(Object.keys(model.error).length, 3);
    assert.strictEqual(model.error.image.message, 'errors.field.required');
    assert.strictEqual(model.error.meaning.message, 'errors.field.required');
    assert.strictEqual(model.error.label.message, 'errors.field.required');
  });

  test('it does not have error when all mandatory fields are filled in', async function (assert) {
    const model = this.store().createRecord('traffic-light-concept', {
      label: 'label',
      image: this.store().createRecord('image'),
      meaning: 'meaning',
    });

    const isValid = await model.validate();

    assert.true(isValid);
    assert.strictEqual(model.error, undefined);
  });
});
