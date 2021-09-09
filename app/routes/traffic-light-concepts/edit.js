import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class TrafficLightConceptsEditRoute extends Route {
  @service store;

  model(params) {
    return hash({
      trafficLightConcept: this.store.findRecord(
        'traffic-light-concept',
        params.id
      ),
    });
  }
  resetController(controller) {
    controller.reset();
    const trafficLightConcept = controller.model.trafficLightConcept;
    trafficLightConcept.rollbackAttributes();
  }
}
