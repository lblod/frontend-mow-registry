import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service router;
  @service intl;

  @action
  async removeRoadSignConcept(roadSignConcept, event) {
    event.preventDefault();

    await roadSignConcept.destroyRecord();
    this.router.transitionTo('road-sign-concepts');
  }

  @action
  async removeSubSign(subSign, event) {
    event.preventDefault();
    let subSigns = await this.model.subSigns;
    subSigns.removeObject(subSign);
    this.model.save();
  }

  @action
  async removeRelatedRoadSignConcept(relatedRoadSignConcept, event) {
    event.preventDefault();
    let relatedRoadSignConcepts = await this.model.relatedRoadSignConcepts;
    relatedRoadSignConcepts.removeObject(relatedRoadSignConcept);
    this.model.save();
  }
}
