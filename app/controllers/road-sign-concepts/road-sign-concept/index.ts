import Controller from '@ember/controller';
import { ModelFrom } from 'mow-registry/utils/type-utils';
import RoadSignConceptsRoadSignConceptIndexRoute from 'mow-registry/routes/road-sign-concepts/road-sign-concept/index';

export default class RoadSignConceptsRoadsignConceptIndexController extends Controller {
  declare model: ModelFrom<RoadSignConceptsRoadSignConceptIndexRoute>;

  get isSubSign() {
    return this.model.isSubSign;
  }
}
