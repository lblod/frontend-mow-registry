import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class MeasureConceptsEditRoute extends Route {
  @service store;

  model(params) {
    return hash({
      measureConcept: this.store.findRecord('measureConcept', params.id),
      roadSignConcepts: this.store.findAll('roadSignConcept'),
      measureConcepts: this.store
        .query('measureConcept', {
          page: {
            // TODO: technical debt. This is a work around to pagination. We need all the measureConcepts
            size: 100000,
          },
        })
        .then((concepts) => concepts.filter((c) => c.id !== params.id)),
    });
  }
  resetController(controller) {
    const measureConcept = controller.model.measureConcept;
    measureConcept.rollbackAttributes();
    measureConcept.belongsTo('roadSignConcept').reload();
    measureConcept.belongsTo('roadSignCombination').reload();
  }
}
