import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';

export default class RoadsignConceptsNewController extends Controller {
  @service router;
  @service fileService;
  file;

  get isSaving() {
    return this.createRoadSignConceptTask.isRunning;
  }

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
  setImageUrl(event) {
    this.model.newRoadSignConcept.image = event.target.value;
    this.file = null;
  }

  @dropTask
  *createRoadSignConceptTask(event) {
    event.preventDefault();

    if (this.file) {
      let fileResponse = yield this.fileService.upload(this.file);
      this.model.newRoadSignConcept.image = fileResponse.downloadLink;
    }

    yield this.model.newRoadSignConcept.save();

    this.router.transitionTo(
      'road-sign-concepts.road-sign-concept',
      this.model.newRoadSignConcept.id
    );
  }
}
