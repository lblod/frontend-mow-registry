import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class MeasureConceptsNewRoute extends Route {
  @service store;

  model() {
    return hash({
      newMeasureConcept: this.store.createRecord('measure-concept'),
      roadSignConcepts: this.store.findAll('road-sign-concept'),
    });
  }
}
