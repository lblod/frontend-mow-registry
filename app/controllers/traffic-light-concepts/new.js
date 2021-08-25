import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import TrafficLightConceptValidations from 'mow-registry/validations/traffic-light-concept';

export default class TrafficlightConceptsNewController extends Controller {
  @service router;
  @service fileService;

  TrafficLightConceptValidations = TrafficLightConceptValidations;
  file = null;

  get isSaving() {
    return this.createTrafficLightConceptTask.isRunning;
  }

  @action
  setTrafficLightConceptValue(trafficLightConcept, attributeName, event) {
    trafficLightConcept[attributeName] = event.target.value;
  }

  @action
  setImageUpload(trafficLightConcept, event) {
    this.file = event.target.files[0];
    trafficLightConcept.image = this.file.name;
  }

  @action
  setTrafficLightConceptCategory(trafficLightConcept, selection) {
    trafficLightConcept.categories = selection;
  }

  @action
  setImageUrl(trafficLightConcept, event) {
    trafficLightConcept.image = event.target.value;
    this.file = null;
  }

  @dropTask
  *createTrafficLightConceptTask(trafficLightConcept, event) {
    event.preventDefault();

    if (this.file) {
      let fileResponse = yield this.fileService.upload(this.file);
      trafficLightConcept.image = fileResponse.downloadLink;
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
  }
}
