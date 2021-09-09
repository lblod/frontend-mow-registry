import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import TrafficLightConceptValidations from 'mow-registry/validations/traffic-light-concept';

export default class TrafficlightConceptsEditController extends Controller {
  @service router;
  @service fileService;

  TrafficLightConceptValidations = TrafficLightConceptValidations;
  file;

  get isSaving() {
    return this.editTrafficLightConceptTask.isRunning;
  }

  @action
  setImageUrl(trafficLightConcept, event) {
    trafficLightConcept.image = event.target.value;
    this.file = null;
  }

  @action
  setImageUpload(trafficLightConcept, event) {
    this.file = event.target.files[0];
    trafficLightConcept.image = this.file.name;
  }

  @action
  setTrafficLightConceptValue(trafficLightConcept, attributeName, event) {
    trafficLightConcept[attributeName] = event.target.value;
  }

  @action
  setTrafficLightConceptCategory(trafficLightConcept, selection) {
    trafficLightConcept.categories = selection;
  }

  @dropTask
  *editTrafficLightConceptTask(trafficLightConcept, event) {
    event.preventDefault();

    if (this.file) {
      let fileResponse = yield this.fileService.upload(this.file);
      this.model.trafficLightConcept.image = fileResponse.downloadLink;
    }

    yield trafficLightConcept.validate();

    if (trafficLightConcept.isValid) {
      yield trafficLightConcept.save();

      this.router.transitionTo(
        'traffic-light-concepts.traffic-light-concept',
        trafficLightConcept.id
      );
    }
  }

  reset() {
    this.file = null;
    this.model.trafficLightConcept.rollbackAttributes();
  }
}
