import Route from '@ember/routing/route';
import type TrafficLightConceptRoute from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class TrafficLightConceptsTrafficLightConceptInstructionsIndexRoute extends Route {
  async model() {
    const { trafficLightConcept } = this.modelFor(
      'traffic-light-concepts.traffic-light-concept',
    ) as ModelFrom<TrafficLightConceptRoute>;

    return {
      trafficLightConcept,
      templates: await trafficLightConcept.hasInstructions,
    };
  }
}
