import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class MeasureConceptsEditRoute extends Route {
  @service store;

  model(params) {
    return hash({
      measureConcept: this.store.findRecord('measureConcept', params.id),
      roadSignConcepts: this.store.findAll('roadSignConcept'),
    });
  }
}
