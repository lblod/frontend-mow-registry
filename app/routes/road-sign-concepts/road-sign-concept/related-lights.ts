import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';

export default class RoadSignConceptsRoadSignConceptRelatedLightsRoute extends Route {
  async model() {
    const { mainConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept'
    ) as ModelFrom<RoadSignConceptsRoadSignConceptRoute>;
    let related = await mainConcept.relatedTrafficLightConcepts;
    return { mainConcept, related };
  }
}
