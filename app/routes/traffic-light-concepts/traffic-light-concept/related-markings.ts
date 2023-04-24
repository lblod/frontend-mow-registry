import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import TrafficLightConceptsTrafficlightConceptRoute from 'mow-registry/routes/traffic-light-concepts/traffic-light-concept';

export default class TrafficLightConceptsTrafficLightConceptRelatedMarkingsRoute extends Route {
  async model() {
    const { mainConcept } = this.modelFor(
      'traffic-light-concepts.traffic-light-concept'
    ) as ModelFrom<TrafficLightConceptsTrafficlightConceptRoute>;
    const related = await mainConcept.relatedRoadMarkingConcepts;
    return { mainConcept, related };
  }
}
