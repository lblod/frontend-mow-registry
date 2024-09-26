import Route from '@ember/routing/route';
import RoadSignConcept from '../../road-sign-concept';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadSignConceptsRoadSignConceptInstructionsIndexRoute extends Route {
  async model() {
    const { roadSignConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept',
    ) as ModelFrom<RoadSignConcept>;

    return {
      roadSignConcept,
      templates: await roadSignConcept.hasInstructions,
    };
  }
}
