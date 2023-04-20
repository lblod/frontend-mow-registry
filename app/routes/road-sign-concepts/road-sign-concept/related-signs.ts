import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadsignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';

export default class RoadSignConceptsRoadSignConceptRelatedSignsRoute extends Route {
  @service declare store: Store;

  async model() {
    const { roadSignConcept: mainConcept, isSubSign } = this.modelFor(
      'road-sign-concepts.road-sign-concept'
    ) as ModelFrom<RoadsignConceptsRoadSignConceptRoute>;
    let relatedConcepts;
    if (isSubSign) {
      relatedConcepts = await mainConcept.relatedFromRoadSignConcepts;
    } else {
      relatedConcepts = await mainConcept.relatedToRoadSignConcepts;
    }
    return { mainConcept, isSubSign, relatedConcepts };
  }
}
