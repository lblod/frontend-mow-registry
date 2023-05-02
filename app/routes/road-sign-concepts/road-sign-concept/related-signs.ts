import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';
import {
  addRelated,
  removeRelated,
} from 'mow-registry/utils/edit-related-concepts';

export default class RoadSignConceptsRoadSignConceptRelatedSignsRoute extends Route {
  async model() {
    const { mainConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept'
    ) as ModelFrom<RoadSignConceptsRoadSignConceptRoute>;
    const relatedFrom = await mainConcept.relatedFromRoadSignConcepts;
    const relatedTo = await mainConcept.relatedToRoadSignConcepts;
    const related = [...relatedFrom.toArray(), ...relatedTo.toArray()];
    const refresh = this.refresh.bind(this);
    return {
      mainConcept,
      relatedFrom,
      relatedTo,
      related,
      addRelated: addRelated(mainConcept, refresh),
      removeRelated: removeRelated(mainConcept, refresh),
    };
  }
}
