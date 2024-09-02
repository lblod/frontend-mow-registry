import { removeItem } from 'mow-registry/utils/array';
import { module, test } from 'qunit';

module('Unit | Utility | array', function () {
  module('removeItem', function () {
    test('it works', function (assert) {
      const originalArray = [1, 2, 3];
      removeItem(originalArray, 2);
      assert.deepEqual(originalArray, [1, 3]);
    });

    test('it only removes the first occurence', function (assert) {
      const originalArray = ['foo', 'bar', 'baz', 'foo'];
      removeItem(originalArray, 'foo');
      assert.deepEqual(originalArray, ['bar', 'baz', 'foo']);
    });

    test("it no-ops if the item isn't part of the array", function (assert) {
      const originalArray = ['foo', 'bar'];
      removeItem(originalArray, 'baz');
      assert.deepEqual(originalArray, ['foo', 'bar']);
    });
  });
});
