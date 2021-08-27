import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadMarkingConceptValidations from 'mow-registry/validations/road-marking-concept';

export default class RoadmarkingConceptsEditController extends Controller {
  @service router;
  @service fileService;

  RoadMarkingConceptValidations = RoadMarkingConceptValidations;
  file;

  get isSaving() {
    return this.editRoadMarkingConceptTask.isRunning;
  }

  @action
  setImageUrl(roadMarkingConcept, event) {
    roadMarkingConcept.image = event.target.value;
    this.file = null;
  }

  @action
  setImageUpload(roadMarkingConcept, event) {
    this.file = event.target.files[0];
    roadMarkingConcept.image = this.file.name;
  }

  @action
  setRoadMarkingConceptValue(roadMarkingConcept, attributeName, event) {
    roadMarkingConcept[attributeName] = event.target.value;
  }

  @dropTask
  *editRoadMarkingConceptTask(roadMarkingConcept, event) {
    event.preventDefault();

    if (this.file) {
      let fileResponse = yield this.fileService.upload(this.file);
      this.model.roadMarkingConcept.image = fileResponse.downloadLink;
    }

    yield roadMarkingConcept.validate();

    if (roadMarkingConcept.isValid) {
      yield roadMarkingConcept.save();

      this.router.transitionTo(
        'road-marking-concepts.road-marking-concept',
        roadMarkingConcept.id
      );
    }
  }
}
