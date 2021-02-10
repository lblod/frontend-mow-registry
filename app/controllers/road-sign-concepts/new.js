import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RoadsignConceptsNewController extends Controller {
  @tracked isSaving = false;
  @service router;

  get notValid() {
    return (
      !this.roadSignConcept.image ||
      !this.roadSignConcept.roadSignConceptCode ||
      !this.roadSignConcept.meaning ||
      !this.roadSignConcept.categories?.length
    );
  }

  get roadSignConcept() {
    return this.model.newRoadSignConcept;
  }

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
        'road-sign-concepts.road-sign-concept',
        this.model.newRoadSignConcept.id
      );
    }
  }
}
