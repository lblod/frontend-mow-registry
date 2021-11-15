import Controller from '@ember/controller';

export default class RoadmarkingConceptsEditController extends Controller {
  reset() {
    this.model.roadMarkingConcept.rollbackAttributes();
  }
}
