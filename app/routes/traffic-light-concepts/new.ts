import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class TrafficlightConceptsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return hash({
      newTrafficLightConcept: this.store.createRecord('traffic-light-concept'),
    });
  }
}
