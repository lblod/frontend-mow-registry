import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class RoadSignConceptsSubsignsEditController extends Controller {
  @action
  async editSubSignRelation(subSign, event) {
    event.preventDefault();
    let subSigns = await this.model.roadSignConcept.subSigns;
    let roadSigns = await this.model.allSubSigns.roadSignConcepts;
    if (event.target.checked) {
      subSigns.pushObject(subSign);
      this.model.roadSignConcept.save();
      roadSigns.removeObject(subSign);
      this.model.allSubSigns.save();
    } else {
      subSigns.removeObject(subSign);
      this.model.roadSignConcept.save();
      roadSigns.pushObject(subSign);
      this.model.allSubSigns.save();
    }
  }
}
