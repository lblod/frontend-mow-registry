import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RoadsignConceptsEditController extends Controller {
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

  @action
  setImageUrl(event) {
    this.model.roadSignConcept.image = event.target.value;
    this.file = null;
  }

  @action
  setImageUpload(event) {
    this.file = event.target.files[0];
    this.model.roadSignConcept.image = this.file.name;
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

      if (this.file) {
        let fileResponse = await this.fileService.upload(this.file);
        this.model.roadSignConcept.image = fileResponse.downloadLink;
      }

      await this.model.roadSignConcept.save();

      this.isSaving = false;

      this.router.transitionTo(
        'road-sign-concepts.road-sign-concept',
        this.model.roadSignConcept.id
      );
    }
  }
}
