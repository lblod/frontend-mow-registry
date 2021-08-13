import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadSignConceptValidations from 'mow-registry/validations/traffic-light-concept';

export default class RoadsignConceptsNewController extends Controller {
  @service router;
  @service fileService;

  RoadSignConceptValidations = RoadSignConceptValidations;
  file = null;

  get isSaving() {
    return this.createRoadSignConceptTask.isRunning;
  }

  @action
  setRoadSignConceptValue(roadSignConcept, attributeName, event) {
    roadSignConcept[attributeName] = event.target.value;
  }

  @action
  setImageUpload(roadSignConcept, event) {
    this.file = event.target.files[0];
    roadSignConcept.image = this.file.name;
  }

  @action
  setRoadSignConceptCategory(roadSignConcept, selection) {
    roadSignConcept.categories = selection;
  }

  @action
  setImageUrl(roadSignConcept, event) {
    roadSignConcept.image = event.target.value;
    this.file = null;
  }

  @dropTask
  *createRoadSignConceptTask(roadSignConcept, event) {
    event.preventDefault();

    if (this.file) {
      let fileResponse = yield this.fileService.upload(this.file);
      roadSignConcept.image = fileResponse.downloadLink;
    }

    yield roadSignConcept.validate();

    if (roadSignConcept.isValid) {
      yield roadSignConcept.save();

      this.router.transitionTo(
        'traffic-light-concepts.traffic-light-concept',
        roadSignConcept.id
      );
    }
  }

  reset() {
    this.file = null;
  }
}
