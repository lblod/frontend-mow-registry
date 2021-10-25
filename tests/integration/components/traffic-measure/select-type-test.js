import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | traffic-measure/select-type',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<TrafficMeasure::SelectType />`);

      assert.equal(this.element.textContent.trim(), '');

      // Template block usage:
      await render(hbs`
      {{!-- template-lint-disable no-bare-strings --}}
      <TrafficMeasure::SelectType>
        template block text
      </TrafficMeasure::SelectType>
    `);

      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  }
);
