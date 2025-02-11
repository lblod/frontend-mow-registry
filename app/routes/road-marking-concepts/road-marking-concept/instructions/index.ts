import Route from '@ember/routing/route';
import type RoadMarkingConceptRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadMarkingConceptsRoadMarkingConceptInstructionsIndexRoute extends Route {
  async model() {
    const { roadMarkingConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept',
    ) as ModelFrom<RoadMarkingConceptRoute>;

    return {
      roadMarkingConcept,
      templates: await roadMarkingConcept.hasInstructions,
    };
  }
}
