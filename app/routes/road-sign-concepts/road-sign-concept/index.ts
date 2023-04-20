import Route from '@ember/routing/route';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadsignConceptsRoadSignConceptRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept';

export default class RoadSignConceptsRoadSignConceptIndexRoute extends Route {
  async model() {
    const { roadSignConcept: mainConcept } = this.modelFor(
      'road-sign-concepts.road-sign-concept'
    ) as ModelFrom<RoadsignConceptsRoadSignConceptRoute>;
    return { mainConcept };
  }
}
