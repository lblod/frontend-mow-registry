import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class TrafficlightConceptsNewRoute extends Route {
  @service store;

  model() {
    return hash({
      newTrafficLightConcept: this.store.createRecord('traffic-light-concept'),
    });
  }

  resetController(controller) {
    controller.reset();
  }
}
