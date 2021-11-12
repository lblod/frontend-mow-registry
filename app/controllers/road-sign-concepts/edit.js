import Controller from '@ember/controller';

export default class RoadsignConceptsEditController extends Controller {
  reset() {
    this.file = null;
    this.model.roadSignConcept.rollbackAttributes();
    this.model.roadSignConcept.hasMany('categories').reload();
  }
}
