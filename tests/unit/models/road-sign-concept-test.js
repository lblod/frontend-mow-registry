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
    assert.strictEqual(Object.keys(model.error).length, 4);
    assert.strictEqual(model.error.image.message, 'errors.label.required');
    assert.strictEqual(model.error.meaning.message, 'errors.label.required');
    assert.strictEqual(
      model.error.roadSignConceptCode.message,
      'errors.label.required',
    );
    assert.strictEqual(model.error.categories.message, 'errors.field.required');
  });

  test('it does not have error when all required fields are filled in', async function (assert) {
    const model = this.store().createRecord('road-sign-concept', {
      image: 'test',
      meaning: 'test',
      categories: [this.store().createRecord('road-sign-category')],
      roadSignConceptCode: 'test',
    });

    const isValid = await model.validate();

    assert.true(isValid);
    assert.strictEqual(model.error, undefined);
  });
});
