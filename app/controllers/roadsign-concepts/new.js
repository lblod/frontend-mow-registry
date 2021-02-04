import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RoadsignConceptsNewController extends Controller {
  @tracked isSaving = false;
  @service router;

  @action
  setRoadSignConceptValue(attributeName, event) {
    this.model.newRoadSignConcept[attributeName] = event.target.value;
  }

  @action
  setRoadSignConceptCategory(selection) {
    this.model.newRoadSignConcept.categories = selection;
  }

  @action
  async createRoadSignConcept(event) {
    event.preventDefault();

    if (!this.isSaving) {
      this.isSaving = true;

      await this.model.newRoadSignConcept.save();

      this.isSaving = false;

      this.router.transitionTo(
        'roadsign-concepts.roadsign-concept',
        this.model.newRoadSignConcept.id
      );
    }
  }
}
