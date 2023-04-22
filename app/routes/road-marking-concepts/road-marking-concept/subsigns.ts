import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import { inject as service } from '@ember/service';
import RoadsignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import Store from '@ember-data/store';

const SUBSIGN_CATEGORY = 'Onderbord';
export default class RoadSignConceptsRoadSignConceptSubsignsRoute extends Route {
  @service declare store: Store;
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
    let categories = [];
    if (isSubSign) {
      // todo: at page refresh this does not return all categories (even though store has them all)
      categories = await this.store
        .findAll('road-sign-category')
        .then((categories) => {
          return categories
            .map((cat) => cat.label)
            .filter((label) => label !== SUBSIGN_CATEGORY);
        });
    } else {
      categories = [SUBSIGN_CATEGORY];
    }
    return { mainConcept, isSubSign, relatedConcepts, categories };
  }
}
