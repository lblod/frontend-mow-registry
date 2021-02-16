import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RoadsignConceptsNewController extends Controller {
  @tracked isSaving = false;
  @service router;
  @service fileService;
  file;
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
  setImageUpload(event) {
    this.file = event.target.files[0];
    this.model.newRoadSignConcept.image = this.file.name;
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

      if (this.file) {
        this.model.newRoadSignConcept.image = await this.fileService.upload(
          this.file
        );
      }

      await this.model.newRoadSignConcept.save();

      this.isSaving = false;

      this.router.transitionTo(
        'road-sign-concepts.road-sign-concept',
        this.model.newRoadSignConcept.id
      );
    }
  }
}
