import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import ConceptRoute from './concept-route';

export default class RelatedSignsRoute extends ConceptRoute {
  @service declare store: Store;

  async model() {
    const { mainConcept, isSubSign } = this.modelFor(this.parentRoute);
    let relatedConcepts;
    if (isSubSign) {
      relatedConcepts = await mainConcept.relatedFromRoadSignConcepts;
    } else {
      relatedConcepts = await mainConcept.relatedToRoadSignConcepts;
    }
    return { mainConcept, isSubSign, relatedConcepts };
  }
}
