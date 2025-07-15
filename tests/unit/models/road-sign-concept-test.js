import { module, test } from 'qunit';

import { setupTest } from 'mow-registry/tests/helpers';

module('Unit | Model | road sign concept', function (hooks) {
  setupTest(hooks);

  this.store = function () {
    return this.owner.lookup('service:store');
  };

  test('it has error when required fields are missing', async function (assert) {
    const model = this.store().createRecord('road-sign-concept');

    const isValid = await model.validate();

    assert.false(isValid);
    assert.strictEqual(Object.keys(model.error).length, 5);
    assert.strictEqual(model.error.image.message, 'errors.field.required');
    assert.strictEqual(model.error.meaning.message, 'errors.field.required');
    assert.strictEqual(model.error.label.message, 'errors.field.required');
    assert.strictEqual(
      model.error.classifications.message,
      'errors.field.required',
    );
  });

  test('it does not have error when all required fields are filled in', async function (assert) {
    const model = this.store().createRecord('road-sign-concept', {
      image: this.store().createRecord('image'),
      meaning: 'meaning',
      classifications: [this.store().createRecord('road-sign-category')],
      label: 'label',
      shapes: [this.store().createRecord('tribont-shape')],
      dimensions: [this.store().createRecord('dimension')],
    });

    const isValid = await model.validate();

    assert.true(isValid);
    assert.strictEqual(model.error, undefined);
  });
});
