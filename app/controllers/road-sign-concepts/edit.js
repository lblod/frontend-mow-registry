import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RoadsignConceptsEditController extends Controller {
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
    return this.model.roadSignConcept;
  }

  @action
  setRoadSignConceptValue(attributeName, event) {
    this.model.roadSignConcept[attributeName] = event.target.value;
  }

  @action
  setRoadSignConceptCategory(selection) {
    this.model.roadSignConcept.categories = selection;
  }

  @action
  async editRoadSignConcept(event) {
    event.preventDefault();

    if (!this.isSaving) {
      this.isSaving = true;

      await this.model.roadSignConcept.save();

      this.isSaving = false;

      this.router.transitionTo(
        'road-sign-concepts.road-sign-concept',
        this.model.roadSignConcept.id
      );
    }
  }
}
