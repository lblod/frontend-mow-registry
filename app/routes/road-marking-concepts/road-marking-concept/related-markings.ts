import RoadMarkingConceptsRoadMarkingConceptRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import Route from '@ember/routing/route';

export default class RoadMarkingConceptsRoadMarkingConceptRelatedMarkingsRoute extends Route {
  async model() {
    const { mainConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept'
    ) as ModelFrom<RoadMarkingConceptsRoadMarkingConceptRoute>;
    let relatedFrom = await mainConcept.relatedFromRoadMarkingConcepts;
    let relatedTo = await mainConcept.relatedToRoadMarkingConcepts;
    return { mainConcept, relatedFrom, relatedTo };
  }
}
