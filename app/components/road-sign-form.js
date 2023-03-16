import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask, task } from 'ember-concurrency';
import RoadSignConceptValidations from 'mow-registry/validations/road-sign-concept';
import ENV from 'mow-registry/config/environment';

export default class RoadSignFormComponent extends Component {
  @service router;
  @service fileService;

  RoadSignConceptValidations = RoadSignConceptValidations;
  file;

  get isSaving() {
    return this.editRoadSignConceptTask.isRunning;
  }

  @action
  setImageUrl(roadSignConcept, event) {
    roadSignConcept.image = event.target.value;
    this.file = null;
  }

  @action
  setImageUpload(roadSignConcept, event) {
    this.file = event.target.files[0];
    roadSignConcept.image = this.file.name;
  }

  @action
  setRoadSignConceptValue(roadSignConcept, attributeName, event) {
    roadSignConcept[attributeName] = event.target.value;
  }

  @action
  setRoadSignConceptCategory(roadSignConcept, selection) {
    roadSignConcept.categories = selection;
  }

  editRoadSignConceptTask = dropTask(async (roadSignConcept, event) => {
    event.preventDefault();

    if (this.file) {
      let fileResponse = await this.fileService.upload(this.file);
      if (ENV.baseUrl) {
        roadSignConcept.image = ENV.baseUrl + fileResponse.downloadLink;
      } else {
        roadSignConcept.image = fileResponse.downloadLink;
      }
    }

    await roadSignConcept.validate();

    if (roadSignConcept.isValid) {
      await roadSignConcept.save();

      this.router.transitionTo(
        'road-sign-concepts.road-sign-concept',
        roadSignConcept.id
      );
    }
  });
}
