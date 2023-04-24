import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadMarkingConceptsRoadMarkingConceptRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept';

export default class RoadMarkingConceptsRoadMarkingConceptRelatedLightsRoute extends Route {
  async model() {
    const { mainConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept'
    ) as ModelFrom<RoadMarkingConceptsRoadMarkingConceptRoute>;
    let related = await mainConcept.relatedTrafficLightConcepts;
    return { mainConcept, related };
  }
}
