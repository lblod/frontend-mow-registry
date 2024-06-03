import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class RoadsignConceptsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return hash({
      newRoadSignConcept: this.store.createRecord('road-sign-concept'),
      classifications: this.store.findAll('road-sign-category'),
      shapes: this.store.findAll('tribont-shape'),
    });
  }
}
