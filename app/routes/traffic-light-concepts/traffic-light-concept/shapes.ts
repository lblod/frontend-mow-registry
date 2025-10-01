import Route from '@ember/routing/route';
import type { ModelFrom } from 'mow-registry/utils/type-utils';
import type TrafficLightConcept from '../traffic-light-concept';
import type { Store } from '@warp-drive/core';
import { service } from '@ember/service';

export default class TrafficLightConceptsTrafficLightConceptMainSignsRoute extends Route {
  @service declare store: Store;

  model() {
    const { trafficLightConcept } = this.modelFor(
      'traffic-light-concepts.traffic-light-concept',
    ) as ModelFrom<TrafficLightConcept>;
    return { trafficLightConcept };
  }
}
