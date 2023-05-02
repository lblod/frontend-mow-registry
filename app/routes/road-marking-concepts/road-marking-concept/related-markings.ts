import RoadMarkingConceptsRoadMarkingConceptRoute from 'mow-registry/routes/road-marking-concepts/road-marking-concept';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import Route from '@ember/routing/route';
import {
  addRelated,
  removeRelated,
} from 'mow-registry/utils/edit-related-concepts';

export default class RoadMarkingConceptsRoadMarkingConceptRelatedMarkingsRoute extends Route {
  async model() {
    const { mainConcept } = this.modelFor(
      'road-marking-concepts.road-marking-concept'
    ) as ModelFrom<RoadMarkingConceptsRoadMarkingConceptRoute>;
    const relatedFrom = await mainConcept.relatedFromRoadMarkingConcepts;
    const relatedTo = await mainConcept.relatedToRoadMarkingConcepts;
    const related = [...relatedTo.toArray(), ...relatedFrom.toArray()];
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
