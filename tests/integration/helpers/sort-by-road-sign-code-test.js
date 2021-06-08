import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | sort-by-road-sign-code', function (hooks) {
  setupRenderingTest(hooks);

  test('it sorts road-sign-concepts numerically based on the code', async function (assert) {
    this.set('roadSignConcepts', [
      {
        roadSignConceptCode: 'A30',
      },
      {
        roadSignConceptCode: 'A3',
      },
      {
        roadSignConceptCode: 'A4',
      },
      {
        roadSignConceptCode: 'B12',
      },
      {
        roadSignConceptCode: 'B10',
      },
      {
        roadSignConceptCode: 'L42',
      },
    ]);

    await render(hbs`
      {{#each (sort-by-road-sign-code this.roadSignConcepts) as |roadSignConcept|~}}
        {{roadSignConcept.roadSignConceptCode}}{{" "}}
      {{~/each}}
    `);

    assert.equal(this.element.textContent.trim(), 'A3 A4 A30 B10 B12 L42');
  });

  test('it returns an empty array when no road-sign-concepts are provided', async function (assert) {
    this.roadSignConcepts = null;

    await render(
      hbs`{{get (sort-by-road-sign-code this.roadSignConcepts) "length"}}`
    );

    assert.equal(this.element.textContent.trim(), '0');
  });
});
