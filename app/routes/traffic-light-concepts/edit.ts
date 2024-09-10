import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import TrafficlightConceptsEditController from 'mow-registry/controllers/traffic-light-concepts/edit';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import { hash } from 'rsvp';

type Params = {
  id: string;
};
export default class TrafficLightConceptsEditRoute extends Route {
  @service declare store: Store;

  model(params: Params) {
    return hash({
      trafficLightConcept: this.store.findRecord<TrafficLightConcept>(
        'traffic-light-concept',
        params.id,
      ),
    });
  }
  resetController(controller: TrafficlightConceptsEditController) {
    controller.reset();
  }
}
