import Controller from '@ember/controller';
import RoadsignConceptsEditRoute from 'mow-registry/routes/road-sign-concepts/edit';
import type { ModelFrom } from 'mow-registry/utils/type-utils';

export default class RoadsignConceptsEditController extends Controller {
  file = null;
  declare model: ModelFrom<RoadsignConceptsEditRoute>;

  reset() {
    this.file = null;
    this.model.roadSignConcept.rollbackAttributes();
    void this.model.roadSignConcept.hasMany('classifications').reload();
  }
}
