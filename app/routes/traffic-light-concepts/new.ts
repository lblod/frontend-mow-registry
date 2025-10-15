import Store from 'mow-registry/services/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type TrafficLightConcept from 'mow-registry/models/traffic-light-concept';

export default class TrafficlightConceptsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return {
      newTrafficLightConcept: this.store.createRecord<TrafficLightConcept>(
        'traffic-light-concept',
        {},
      ),
    };
  }
}
