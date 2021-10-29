import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | traffic-measure/instruction-entry',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<TrafficMeasure::InstructionEntry />`);

      assert.equal(this.element.textContent.trim(), '');

      // Template block usage:
      await render(hbs`
      <TrafficMeasure::InstructionEntry>
        template block text
      </TrafficMeasure::InstructionEntry>
    `);

      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  }
);
