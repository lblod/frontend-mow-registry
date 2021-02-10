import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RoadsignConceptsEditController extends Controller {
  @tracked isSaving = false;
  @service router;

  @action
  setRoadSignConceptValue(attributeName, event) {
    this.model.roadSignConcept[attributeName] = event.target.value;
  }

  get notValid() {
    return (
      !this.model.roadSignConcept.image ||
      !this.model.roadSignConcept.roadSignConceptCode ||
      !this.model.roadSignConcept.meaning ||
      !this.model.roadSignConcept.categories?.length
    );
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
