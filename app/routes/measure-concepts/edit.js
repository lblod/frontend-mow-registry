import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class MeasureConceptsEditRoute extends Route {
  @service store;

  model(params) {
    return hash({
      measureConcept: this.store.findRecord('measureconcept', params.id),
      roadSignConcepts: this.store.findAll('roadsignconcept'),
    });
  }
}
