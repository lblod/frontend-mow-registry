import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import TrafficLightConceptValidations from 'mow-registry/validations/traffic-light-concept';

export default class TrafficLightFormComponent extends Component {
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

  editTrafficLightConceptTask = dropTask(async (trafficLightConcept, event) => {
    event.preventDefault();

    if (this.file) {
      let fileResponse = await this.fileService.upload(this.file);
      trafficLightConcept.image = fileResponse.downloadLink;
    }

    await trafficLightConcept.validate();

    if (trafficLightConcept.isValid) {
      await trafficLightConcept.save();

      this.router.transitionTo(
        'traffic-light-concepts.traffic-light-concept',
        trafficLightConcept.id
      );
    }
  });
}
