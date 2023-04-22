import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import ConceptRoute from './concept-route';

export default class RelatedSignsRoute extends ConceptRoute {
  @service declare store: Store;

  async model() {
    const { mainConcept } = this.modelFor(this.parentRoute);
    if (mainConcept.relatedRoadSignConcepts) {
      let related = await mainConcept.relatedRoadSignConcepts;
      return { mainConcept, related };
    } else {
      let relatedFrom = await mainConcept.relatedFromRoadSignConcepts;
      let relatedTo = await mainConcept.relatedToRoadSignConcepts;
      return { mainConcept, relatedFrom, relatedTo };
    }
  }
}
