import Route from '@ember/routing/route';
import RoadMarkingConceptsRoadMarkingConceptRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadMarkingConceptsRoadMarkingConceptRelatedSignsRoute extends Route {
  async model() {
    const { mainConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept'
    ) as ModelFrom<RoadMarkingConceptsRoadMarkingConceptRoute>;
    let related = await mainConcept.relatedRoadSignConcepts;
    return { mainConcept, related };
  }
}
