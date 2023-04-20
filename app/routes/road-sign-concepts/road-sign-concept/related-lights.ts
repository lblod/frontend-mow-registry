import Route from '@ember/routing/route';
import { ModelFrom } from '../../../utils/type-utils';
import RoadsignConceptsRoadSignConceptRoute from '../road-sign-concept';

export default class RoadSignConceptsRoadSignConceptRelatedLightsRoute extends Route {
  async model() {
    const { roadSignConcept: mainConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept'
    ) as ModelFrom<RoadsignConceptsRoadSignConceptRoute>;
    const relatedConcepts = await mainConcept.relatedTrafficLightConcepts;
    return { mainConcept, relatedConcepts };
  }
}
