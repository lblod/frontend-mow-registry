import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class RoadSignConceptsRoadsignConceptIndexController extends Controller {
  /** @returns {boolean} */
  get isSubSign() {
    return this.model.isSubSign;
  }

  @action
  addInstruction() {}
  @action
  editInstruction() {}

}
