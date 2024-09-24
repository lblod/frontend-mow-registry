import Controller from '@ember/controller';
import RoadmarkingConceptsEditRoute from 'mow-registry/routes/road-marking-concepts/edit';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadmarkingConceptsEditController extends Controller {
  declare model: ModelFrom<RoadmarkingConceptsEditRoute>;

  reset() {
    this.model.roadMarkingConcept.rollbackAttributes();
  }
}
