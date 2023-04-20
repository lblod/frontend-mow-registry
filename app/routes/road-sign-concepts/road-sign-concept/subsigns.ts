import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadsignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';

export default class RoadSignConceptsRoadSignConceptSubsignsRoute extends Route {
  async model() {
    const { mainConcept, isSubSign } = this.modelFor(
      'road-sign-concepts.road-sign-concept'
    ) as ModelFrom<RoadsignConceptsRoadSignConceptRoute>;
    let relatedConcepts;
    if (isSubSign) {
      relatedConcepts = await mainConcept.mainSigns;
    } else {
      relatedConcepts = await mainConcept.subSigns;
    }
    return { mainConcept, isSubSign, relatedConcepts };
  }
}
